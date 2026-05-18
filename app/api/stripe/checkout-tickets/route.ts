import { NextResponse } from "next/server";
import { isValidVisitDate, todayIsoLocal } from "@/lib/booking-dates";
import { getAppOrigin } from "@/lib/app-origin";
import { parseUsd, usdToCents } from "@/lib/pricing";
import { site } from "@/lib/site";
import { getStripeServer } from "@/lib/stripe-server";
import {
  formatVisitTimeForStripe,
  isValidVisitTime,
  slotAllowedOnDate,
  VISIT_TIME_SLOTS,
} from "@/lib/visit-time-slots";

const PAYMENT_METHOD_TYPES = ["card", "link"] as const;

type TicketLineItem = {
  quantity: number;
  price_data: {
    currency: "usd";
    unit_amount: number;
    product_data: { name: string; description: string };
  };
};
const GROUP_MIN_HEAD = 20;
const MAX_PLAYERS = 100;

type Body = {
  visitDate?: unknown;
  visitTime?: unknown;
  players?: unknown;
  first?: unknown;
  replay?: unknown;
  group?: unknown;
};

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return NextResponse.json(
      { error: "Stripe is not configured (STRIPE_SECRET_KEY)." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const visitDate = typeof body.visitDate === "string" ? body.visitDate.trim() : "";
  const visitTime = typeof body.visitTime === "string" ? body.visitTime.trim() : "";
  const playersRaw = body.players;
  const playersNum =
    typeof playersRaw === "number" && Number.isInteger(playersRaw)
      ? playersRaw
      : typeof playersRaw === "string"
        ? Number.parseInt(playersRaw, 10)
        : NaN;

  const first = body.first === true;
  const replay = body.replay === true;
  const group = body.group === true;

  if (!first && !replay && !group) {
    return NextResponse.json({ error: "Select at least one ticket type." }, { status: 400 });
  }
  if (replay && !first) {
    return NextResponse.json(
      { error: "Another 18 holes must be booked with a 1st game in the same order." },
      { status: 400 },
    );
  }
  if (!visitDate) {
    return NextResponse.json({ error: "Choose a visit date." }, { status: 400 });
  }
  if (!visitTime) {
    return NextResponse.json({ error: "Choose an arrival time." }, { status: 400 });
  }
  const slotDef = VISIT_TIME_SLOTS.find((s) => s.value === visitTime);
  if (!slotDef || !isValidVisitTime(visitTime)) {
    return NextResponse.json({ error: "Choose a valid arrival time." }, { status: 400 });
  }
  const minIso = todayIsoLocal();
  if (!isValidVisitDate(visitDate, minIso)) {
    return NextResponse.json({ error: "Visit date must be today or later." }, { status: 400 });
  }
  if (!slotAllowedOnDate(slotDef, visitDate)) {
    return NextResponse.json(
      { error: "That arrival time is only available on Friday and Saturday." },
      { status: 400 },
    );
  }
  const visitWhen = `${visitDate} · ${formatVisitTimeForStripe(visitTime)}`;
  if (!Number.isFinite(playersNum) || playersNum < 1 || playersNum > MAX_PLAYERS) {
    return NextResponse.json({ error: "Select a valid guest count." }, { status: 400 });
  }

  const line_items: TicketLineItem[] = [];

  if (first) {
    const unit = parseUsd(site.rates.leftColumn[0].price);
    line_items.push({
      quantity: playersNum,
      price_data: {
        currency: "usd",
        unit_amount: usdToCents(unit),
        product_data: {
          name: `${site.rates.leftColumn[0].label} · ${playersNum} guest${playersNum === 1 ? "" : "s"}`,
          description: `Visit ${visitWhen}. Posted rate estimate — specials finalize at the window.`,
        },
      },
    });
  }

  if (replay) {
    const unit = parseUsd(site.rates.leftColumn[1].price);
    line_items.push({
      quantity: playersNum,
      price_data: {
        currency: "usd",
        unit_amount: usdToCents(unit),
        product_data: {
          name: `${site.rates.leftColumn[1].label} · ${playersNum} guest${playersNum === 1 ? "" : "s"}`,
          description: `Visit ${visitWhen}. Another 18 holes same day after a paid first round.`,
        },
      },
    });
  }

  if (group) {
    const unit = parseUsd(site.rates.rightColumn[0].price);
    const head = Math.max(playersNum, GROUP_MIN_HEAD);
    line_items.push({
      quantity: 1,
      price_data: {
        currency: "usd",
        unit_amount: usdToCents(unit * head),
        product_data: {
          name: `${site.rates.rightColumn[0].label} · ${head} guest${head === 1 ? "" : "s"}`,
          description: `Visit ${visitWhen}. Group estimate (min. ${GROUP_MIN_HEAD} guests for posted per-person rate).`,
        },
      },
    });
  }

  const totalCents = line_items.reduce((sum, li) => {
    const q = li.quantity ?? 1;
    const ua = li.price_data?.unit_amount ?? 0;
    return sum + ua * q;
  }, 0);

  if (totalCents < 50) {
    return NextResponse.json(
      { error: "Order total is too small for checkout. Add guests or ticket types." },
      { status: 400 },
    );
  }

  const origin = getAppOrigin();
  const bundle = [first && "first", replay && "replay", group && "group"].filter(Boolean).join("+");

  try {
    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.create({
      ui_mode: "hosted_page",
      mode: "payment",
      line_items,
      payment_method_types: [...PAYMENT_METHOD_TYPES],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        visit_date: visitDate,
        visit_time: visitTime,
        players: String(playersNum),
        bundle,
        source: "tickets_modal",
      },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Checkout did not return a URL." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
