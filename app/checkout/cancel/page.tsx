import type { Metadata } from "next";
import Link from "next/link";
import { StickySiteChrome } from "@/components/sticky-site-chrome";
import { getLiveSite } from "@/lib/site-live";

export const metadata: Metadata = {
  title: "Checkout cancelled",
  robots: { index: false, follow: false },
};

export default async function CheckoutCancelPage() {
  const site = await getLiveSite();

  return (
    <div className="flex min-h-full flex-col">
      <StickySiteChrome site={site} />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-16">
        <div className="rounded-2xl border border-white/60 bg-surface-elevated/90 p-8 shadow-sm backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-ink">Checkout cancelled</h1>
          <p className="mt-3 text-sm text-muted">No charge was completed. You can close this tab or try again.</p>
          <p className="mt-8 flex flex-wrap gap-4 text-sm">
            <Link
              href="/checkout/test"
              className="font-medium text-ocean-deep underline-offset-2 hover:underline"
            >
              Try test checkout again
            </Link>
            <Link href="/" className="font-medium text-ocean-deep underline-offset-2 hover:underline">
              Home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
