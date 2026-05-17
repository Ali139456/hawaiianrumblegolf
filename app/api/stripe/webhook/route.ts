import { NextResponse } from "next/server";
import Stripe from "stripe";
import {
  cancelVisitSlotReservation,
  confirmVisitSlotReservation,
} from "@/lib/visit-slot-capacity";
import { getStripeServer } from "@/lib/stripe-server";

export const runtime = "nodejs";

/** Browser / Stripe “Send test webhook” health check — real events use POST. */
export async function GET() {
  const configured = Boolean(process.env.STRIPE_WEBHOOK_SECRET?.trim());
  return NextResponse.json({
    ok: true,
    endpoint: "stripe-webhook",
    configured,
    message: configured
      ? "Ready. Stripe sends POST with a signed payload."
      : "Route is live. Set STRIPE_WEBHOOK_SECRET in Vercel, then add this URL in Stripe Dashboard.",
  });
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await req.text();
    const stripe = getStripeServer();
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.metadata?.source === "tickets_modal" && session.id) {
      await confirmVisitSlotReservation(session.id);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.id) {
      await cancelVisitSlotReservation(session.id);
    }
  }

  return NextResponse.json({ received: true });
}
