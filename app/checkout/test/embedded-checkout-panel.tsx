"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export function EmbeddedCheckoutPanel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.trim();
    if (!pk) {
      setLoading(false);
      setError(
        "Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to use embedded checkout (Apple Pay / Google Pay on your site).",
      );
      return;
    }

    let cancelled = false;
    let embedded: { destroy: () => void } | null = null;

    (async () => {
      setError(null);
      setLoading(true);
      try {
        const stripe = await loadStripe(pk);
        if (!stripe || cancelled) return;

        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ embedded: true }),
        });
        const data = (await res.json()) as { clientSecret?: string; error?: string };
        if (!res.ok) {
          setError(data.error ?? "Could not start embedded checkout.");
          return;
        }
        if (!data.clientSecret) {
          setError("Missing client secret from Stripe.");
          return;
        }

        const checkout = await stripe.createEmbeddedCheckoutPage({
          clientSecret: data.clientSecret,
        });
        if (cancelled) {
          checkout.destroy();
          return;
        }
        embedded = checkout;
        checkout.mount(el);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Could not load checkout.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      embedded?.destroy();
      embedded = null;
    };
  }, []);

  return (
    <div className="space-y-3">
      {loading ? (
        <p className="text-sm text-muted">Loading checkout…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <div
        ref={mountRef}
        className="min-h-[480px] w-full rounded-xl border border-slate-200/80 bg-white/50 p-2 sm:p-4"
      />
    </div>
  );
}
