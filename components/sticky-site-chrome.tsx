import { MarketingTicker } from "@/components/marketing-ticker";
import { SiteHeader } from "@/components/site-header";

/** Ticker + nav, sticky together (reuse on home, /deals, and future pages). */
export function StickySiteChrome() {
  return (
    <div className="sticky top-0 z-50">
      <MarketingTicker />
      <SiteHeader />
    </div>
  );
}
