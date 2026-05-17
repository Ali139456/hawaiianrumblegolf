import type { Metadata } from "next";
import Link from "next/link";
import { StickySiteChrome } from "@/components/sticky-site-chrome";
import { getLiveSite } from "@/lib/site-live";

export const metadata: Metadata = {
  title: "Payment complete",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function EmbeddedCheckoutReturnPage({ searchParams }: Props) {
  const site = await getLiveSite();
  const { session_id: sessionId } = await searchParams;

  return (
    <div className="flex min-h-full flex-col">
      <StickySiteChrome site={site} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16">
        <div className="rounded-2xl border border-white/60 bg-surface-elevated/90 p-8 shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-ink">Thank you</h1>
          <p className="mt-3 text-sm text-muted">
            Embedded checkout finished. Confirm payment server-side with the Checkout Session or a
            webhook before fulfilling orders.
          </p>
          {sessionId ? (
            <p className="mt-4 font-mono text-xs text-muted break-all">Session: {sessionId}</p>
          ) : null}
          <p className="mt-8">
            <Link
              href="/"
              className="text-sm font-medium text-ocean-deep underline-offset-2 hover:underline"
            >
              ← Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
