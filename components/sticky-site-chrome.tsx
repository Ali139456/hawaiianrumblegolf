import { MarketingTicker } from "@/components/marketing-ticker";
import { SiteHeader } from "@/components/site-header";
import type { SiteConfig } from "@/lib/site";

/** Ticker + nav, sticky together (reuse on home, /deals, and future pages). */
export function StickySiteChrome({ site }: { site: SiteConfig }) {
  return (
    <div className="sticky top-0 z-50 w-full max-w-full overflow-x-clip">
      <MarketingTicker site={site} />
      <SiteHeader />
    </div>
  );
}
