"use client";

import { useState } from "react";

export function CheckoutTestButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startCheckout() {
    setError(null);
    setPending(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embedded: false }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not start checkout.");
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setError("No redirect URL returned.");
    } catch {
      setError("Network error. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={startCheckout}
        disabled={pending}
        className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Opening Stripe…" : "Pay $1.00 (test mode)"}
      </button>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
