import { NextResponse } from "next/server";
import { site } from "@/lib/site";
import { getAppOrigin } from "@/lib/app-origin";
import { getStripeServer } from "@/lib/stripe-server";

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

function parseUsd(s: string) {
  const n = Number.parseFloat(String(s).replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function toCents(usd: number) {
  return Math.max(0, Math.round(usd * 100));
}

/** Match browser `<input type="date" min>` (local calendar day, not UTC-only). */
function todayIsoLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isValidVisitDate(iso: string, minIso: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const t = new Date(`${iso}T12:00:00`).getTime();
  if (Number.isNaN(t)) return false;
  const minT = new Date(`${minIso}T12:00:00`).getTime();
  return t >= minT;
}

type Body = {
  visitDate?: unknown;
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
  if (!visitDate) {
    return NextResponse.json({ error: "Choose a visit date." }, { status: 400 });
  }
  const minIso = todayIsoLocal();
  if (!isValidVisitDate(visitDate, minIso)) {
    return NextResponse.json({ error: "Visit date must be today or later." }, { status: 400 });
  }
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
        unit_amount: toCents(unit),
        product_data: {
          name: `${site.rates.leftColumn[0].label} · ${playersNum} guest${playersNum === 1 ? "" : "s"}`,
          description: `Visit ${visitDate}. Posted rate estimate — specials finalize at the window.`,
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
        unit_amount: toCents(unit),
        product_data: {
          name: `${site.rates.leftColumn[1].label} · ${playersNum} guest${playersNum === 1 ? "" : "s"}`,
          description: `Visit ${visitDate}. Same-day replay after a paid first round.`,
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
        unit_amount: toCents(unit * head),
        product_data: {
          name: `${site.rates.rightColumn[0].label} · ${head} guest${head === 1 ? "" : "s"}`,
          description: `Visit ${visitDate}. Group estimate (min. ${GROUP_MIN_HEAD} guests for posted per-person rate).`,
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
