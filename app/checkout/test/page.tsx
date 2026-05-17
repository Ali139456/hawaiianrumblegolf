import type { Metadata } from "next";
import Link from "next/link";
import { StickySiteChrome } from "@/components/sticky-site-chrome";
import { getLiveSite } from "@/lib/site-live";
import { CheckoutTestButton } from "./checkout-test-button";
import { EmbeddedCheckoutPanel } from "./embedded-checkout-panel";

export const metadata: Metadata = {
  title: "Stripe test checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutTestPage() {
  const site = await getLiveSite();

  return (
    <div className="flex min-h-full flex-col">
      <StickySiteChrome site={site} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16">
        <div className="rounded-2xl border border-white/60 bg-surface-elevated/90 p-8 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Developer / QA
          </p>
          <h1 className="mt-2 text-2xl font-bold text-ink">Stripe Checkout (test)</h1>
          <p className="mt-3 text-sm text-muted">
            Uses{" "}
            <code className="rounded bg-surface px-1 py-0.5 text-ink">STRIPE_SECRET_KEY</code> on
            the server and{" "}
            <code className="rounded bg-surface px-1 py-0.5 text-ink">
              NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
            </code>{" "}
            for embedded checkout. Test card{" "}
            <code className="rounded bg-surface px-1 py-0.5 text-ink">4242 4242 4242 4242</code>{" "}
            (any future expiry, any CVC). US wallets: Apple Pay and Google Pay show when the device
            supports them (embedded checkout on your domain also needs the Apple Pay domain file —
            see below).
          </p>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-ink">On this page (Apple Pay / Google Pay)</h2>
            <p className="mt-2 text-sm text-muted">
              Embedded Checkout. Register your domain in Stripe → Settings → Payment methods →
              Apple Pay, then either set{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-ink">
                STRIPE_APPLE_PAY_DOMAIN_ASSOCIATION
              </code>{" "}
              to the verification file contents, or place that file in{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-ink">public/.well-known/</code> so
              it is served at{" "}
              <code className="rounded bg-surface px-1 py-0.5 text-ink">
                /.well-known/apple-developer-merchantid-domain-association
              </code>
              .
            </p>
            <div className="mt-4">
              <EmbeddedCheckoutPanel />
            </div>
          </section>

          <section className="mt-12 border-t border-slate-200/80 pt-10">
            <h2 className="text-lg font-semibold text-ink">Hosted Stripe page</h2>
            <p className="mt-2 text-sm text-muted">
              Redirects to checkout.stripe.com — wallets still appear there when the browser allows
              it.
            </p>
            <div className="mt-4">
              <CheckoutTestButton />
            </div>
          </section>

          <p className="mt-10 text-sm text-muted">
            <Link href="/" className="font-medium text-ocean-deep underline-offset-2 hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
