import { Reveal } from "@/components/motion/reveal";
import type { SiteConfig } from "@/lib/site";

export function InfoStrip({ site }: { site: SiteConfig }) {
  return (
    <section className="overflow-x-clip border-y border-amber-400/20 bg-gradient-to-r from-amber-950/50 via-slate-900/80 to-sky-950/40">
      <Reveal className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center shadow-sm backdrop-blur-sm sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-left sm:shadow-none">
            <p className="text-sm font-bold text-ink sm:font-semibold">Open 7 days a week</p>
            <a
              href={`tel:${site.phoneTel}`}
              className="mt-1 inline-block text-base font-bold tracking-tight text-sky-400 hover:underline sm:mt-0 sm:inline sm:text-sm sm:font-semibold sm:text-ink"
            >
              {site.phone}
            </a>
          </div>
          <p className="rounded-2xl border border-amber-400/25 bg-gradient-to-br from-amber-950/40 to-orange-950/30 px-4 py-3 text-center text-[11px] font-semibold uppercase leading-relaxed tracking-wide text-amber-200/90 sm:max-w-xl sm:rounded-none sm:border-0 sm:bg-transparent sm:px-0 sm:py-0 sm:text-right sm:text-xs sm:normal-case sm:tracking-wide sm:text-amber-200/80">
            Discounts for military · seniors · FL residents · Disney &amp; Universal cast · ask at check-in
          </p>
        </div>
        <ul className="flex flex-col gap-2.5 border-t border-amber-500/25 pt-4 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-8 md:justify-between">
          <li className="rounded-xl bg-white/5 px-3 py-2 text-center text-base font-semibold text-white shadow-sm backdrop-blur-sm sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-left sm:shadow-none">
            {site.hours.week}
          </li>
          <li className="rounded-xl bg-white/5 px-3 py-2 text-center text-base font-semibold text-white shadow-sm backdrop-blur-sm sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0 sm:text-left sm:shadow-none">
            {site.hours.weekend}
          </li>
        </ul>
      </Reveal>
    </section>
  );
}