import { site } from "@/lib/site";

export function MarketingTicker() {
  const phoneLine = `${site.phone} · Walk-ins welcome`;
  const ctaLine = "Walk-ins welcome · come join us on the course";

  const lines = [...site.tickerLines, phoneLine, ctaLine] as const;

  return (
    <div
      className="relative z-[60] border-b border-amber-400/25 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
      role="region"
      aria-label="Highlights and promotions"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-950 to-transparent sm:w-16" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-950 to-transparent sm:w-16" />

      <div className="overflow-hidden py-3 sm:py-3">
        <div className="marketing-marquee-track flex">
          <ul className="flex shrink-0 list-none items-center gap-0 pr-10">
            {lines.map((text) => (
              <li
                key={text}
                className="flex shrink-0 items-center gap-3 pl-10 text-[14px] font-medium leading-snug tracking-tight text-slate-50 sm:text-sm sm:text-slate-100"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  aria-hidden
                />
                <span className="whitespace-nowrap">{text}</span>
              </li>
            ))}
          </ul>
          <ul className="flex shrink-0 list-none items-center gap-0 pr-10" aria-hidden>
            {lines.map((text) => (
              <li
                key={`dup-${text}`}
                className="flex shrink-0 items-center gap-3 pl-10 text-[14px] font-medium leading-snug tracking-tight text-slate-50 sm:text-sm sm:text-slate-100"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                  aria-hidden
                />
                <span className="whitespace-nowrap">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
