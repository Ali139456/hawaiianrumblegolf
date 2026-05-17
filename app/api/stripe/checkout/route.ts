import { NextResponse } from "next/server";
import { getAppOrigin } from "@/lib/app-origin";
import { getStripeServer } from "@/lib/stripe-server";

/** One-off test line item in cents (USD). */
const TEST_UNIT_AMOUNT_CENTS = 100;

/** US-oriented Checkout: card (includes Apple Pay / Google Pay wallets) + Link. */
const PAYMENT_METHOD_TYPES = ["card", "link"] as const;

async function readEmbeddedFlag(req: Request): Promise<boolean> {
  const ct = req.headers.get("content-type") ?? "";
  if (!ct.includes("application/json")) return false;
  try {
    const raw = await req.text();
    if (!raw.trim()) return false;
    const j = JSON.parse(raw) as { embedded?: unknown };
    return j.embedded === true;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY?.trim()) {
    return NextResponse.json(
      { error: "Stripe is not configured (STRIPE_SECRET_KEY)." },
      { status: 503 },
    );
  }

  const embedded = await readEmbeddedFlag(req);
  const origin = getAppOrigin();

  try {
    const stripe = getStripeServer();

    const line_items = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: TEST_UNIT_AMOUNT_CENTS,
          product_data: {
            name: "Stripe test checkout",
            description: "Integration test — replace with real products or remove this route.",
          },
        },
      },
    ] as const;

    if (embedded) {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded_page",
        mode: "payment",
        line_items: [...line_items],
        payment_method_types: [...PAYMENT_METHOD_TYPES],
        return_url: `${origin}/checkout/embedded-return?session_id={CHECKOUT_SESSION_ID}`,
      });

      if (!session.client_secret) {
        return NextResponse.json(
          { error: "Embedded checkout did not return a client secret." },
          { status: 500 },
        );
      }

      return NextResponse.json({ clientSecret: session.client_secret });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "hosted_page",
      mode: "payment",
      line_items: [...line_items],
      payment_method_types: [...PAYMENT_METHOD_TYPES],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Checkout session did not return a URL." },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Stripe error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
