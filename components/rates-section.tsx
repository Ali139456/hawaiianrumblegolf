import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { TropicalFramedSection } from "@/components/tropical-framed-section";
import type { SiteConfig } from "@/lib/site";

type TicketLine = {
  label: string;
  detail: string;
  price: string;
  pricePrefix: string;
  priceNote?: string;
  compareAtPrice?: string;
  highlight?: boolean;
  badge?: string;
  cta?: { readonly href: string; readonly label: string };
};

function formatUsd(amount: string) {
  const n = Number.parseFloat(amount);
  if (Number.isNaN(n)) return amount;
  return n.toFixed(2);
}

function savingsVersusFullRound(compareAt: string, price: string) {
  const w = Number.parseFloat(compareAt);
  const n = Number.parseFloat(price);
  if (Number.isNaN(w) || Number.isNaN(n) || w <= n) return null;
  const save = (w - n).toFixed(2);
  return `Save $${save} vs. another full-price round`;
}

function TicketRow({ item }: { item: TicketLine }) {
  const base =
    "relative flex h-full flex-col rounded-xl border px-5 py-5 text-left shadow-sm transition-colors sm:px-6 sm:py-6";

  const normal = "border-white/10 bg-slate-900/60";

  const featured =
    "border-amber-400/45 bg-gradient-to-br from-amber-950/55 via-slate-900/85 to-emerald-950/30 ring-2 ring-amber-400/35 shadow-[0_0_48px_rgba(251,191,36,0.12)] md:scale-[1.03] md:z-[1]";

  const saleCopy = item.compareAtPrice ? savingsVersusFullRound(item.compareAtPrice, item.price) : null;

  return (
    <div className={`${base} ${item.highlight ? featured : normal}`}>
      {item.compareAtPrice ? (
        <div
          className="pointer-events-none absolute -right-px -top-px overflow-hidden rounded-tr-xl rounded-bl-2xl"
          aria-hidden
        >
          <div className="origin-top-right rotate-45 translate-x-8 translate-y-3 bg-gradient-to-r from-emerald-500 to-teal-600 px-10 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
            On sale
          </div>
        </div>
      ) : null}
      {item.badge && !item.compareAtPrice ? (
        <span className="absolute right-3 top-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm sm:right-4 sm:top-4 sm:text-xs">
          {item.badge}
        </span>
      ) : null}
      <h3 className="pr-14 text-lg font-semibold tracking-tight text-white sm:text-xl">{item.label}</h3>
      {item.badge && item.compareAtPrice ? (
        <span className="mt-2 inline-flex w-fit rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-200 ring-1 ring-amber-400/40">
          {item.badge}
        </span>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.detail}</p>

      {item.compareAtPrice ? (
        <div className="mt-5 space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-300/95">Same-day replay</p>
          <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="flex items-baseline gap-1 text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Was</span>
              <span className="text-2xl font-semibold line-through decoration-2 decoration-slate-500/90">
                <span className="text-lg">$</span>
                {formatUsd(item.compareAtPrice)}
              </span>
            </span>
            <span className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold uppercase tracking-wide text-emerald-300">Now</span>
              <span className="text-4xl font-bold tracking-tight text-amber-200 sm:text-5xl">
                <span className="text-2xl font-bold text-amber-200/95">$</span>
                {item.price}
              </span>
            </span>
          </div>
          {saleCopy ? (
            <p className="text-sm font-semibold text-emerald-300/90">{saleCopy}</p>
          ) : null}
          <p className="text-xs leading-relaxed text-slate-500">
            Play your first round at the regular rate, then lock in replay pricing for round two. Perfect
            for families doubling up on fun.
          </p>
        </div>
      ) : (
        <p className="mt-5 flex flex-wrap items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-amber-300 sm:text-4xl">
            {item.pricePrefix ? (
              <span className="mr-0.5 text-2xl font-bold text-amber-200/90">{item.pricePrefix}</span>
            ) : null}
            <span className="align-top text-2xl font-bold text-amber-200/95">$</span>
            {item.price}
          </span>
          {item.priceNote ? (
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              {item.priceNote}
            </span>
          ) : null}
        </p>
      )}

      {item.cta ? (
        <Link
          href={item.cta.href}
          className="mt-auto inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
        >
          {item.cta.label}
        </Link>
      ) : null}
    </div>
  );
}

export function RatesSection({ site }: { site: SiteConfig }) {
  const { rates } = site;

  const cards: TicketLine[] = [rates.leftColumn[0], rates.leftColumn[1], rates.rightColumn[0]];

  const columnHeadings = [
    { title: rates.leftColumnTitle, sub: rates.leftColumnSub },
    { title: "Replay deal", sub: "Same day · per person" },
    { title: rates.rightColumnTitle, sub: rates.rightColumnSub },
  ] as const;

  return (
    <TropicalFramedSection id="rates">
      <>
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Rates that reward another round
          </h2>
          <p className="mt-3 text-lg text-muted">
            Walk-ins welcome all week. Stack a same-day 2nd game for huge value, or bring 20+ for group
            pricing. Ask at the window about{" "}
            <span className="font-semibold text-slate-800">
              military, seniors, Florida residents, and Disney &amp; Universal cast
            </span>{" "}
            specials.
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.05}>
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#070b12] shadow-2xl shadow-slate-900/50 ring-1 ring-white/5">
            <div className="border-b border-white/10 bg-gradient-to-b from-slate-900/90 to-[#070b12] px-6 py-7 text-center sm:px-10 sm:py-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-amber-400 sm:text-xs sm:tracking-[0.35em]">
                {rates.title}
              </p>
              <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">
                1st game · 2nd game (same day) · Group rate · simple pricing, more mini golf.
              </p>
            </div>

            <div className="px-5 py-8 sm:px-10 sm:py-10">
              <div className="mb-6 hidden gap-5 md:grid md:grid-cols-3 lg:gap-8">
                {columnHeadings.map((col) => (
                  <div key={col.title} className="border-b border-white/10 pb-3 text-center">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400 sm:text-sm sm:tracking-[0.2em]">
                      {col.title}
                    </p>
                    <p className="mt-1 text-xs italic text-slate-400 sm:text-sm">{col.sub}</p>
                  </div>
                ))}
              </div>

              <StaggerRoot className="grid gap-8 md:grid-cols-3 md:gap-5 lg:gap-8 md:items-stretch">
                {cards.map((item, index) => (
                  <MotionItem key={`${item.label}-${index}`} index={index}>
                    <div className="flex h-full flex-col gap-3">
                      <div className="border-b border-white/10 pb-3 md:hidden">
                        <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-400">
                          {columnHeadings[index].title}
                        </p>
                        <p className="mt-1 text-xs italic text-slate-400">{columnHeadings[index].sub}</p>
                      </div>
                      <TicketRow item={item} />
                    </div>
                  </MotionItem>
                ))}
              </StaggerRoot>

              <ul className="mt-10 space-y-2.5 border-t border-white/10 pt-8 text-left text-xs leading-relaxed text-slate-500 sm:text-sm">
                {rates.footnotes.map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span className="shrink-0 font-semibold text-amber-500/90" aria-hidden>
                      *
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10" delay={0.08}>
          <div
            id="deals"
            className="rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-50/90 via-white to-sky-50/80 p-6 shadow-sm sm:p-8"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Offers &amp; who saves</h3>
                <p className="mt-2 max-w-2xl text-muted">
                  We love locals, service members, and park crews. Ask about discounted rates when you check
                  in (ID may be required).
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-400/25 px-3 py-1 text-xs font-bold uppercase tracking-wide text-amber-950">
                At the clubhouse
              </span>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {site.highlights.map((h) => (
                <li
                  key={h}
                  className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/70 px-4 py-3 text-sm text-slate-800"
                >
                  <span className="mt-0.5 text-amber-600" aria-hidden>
                    ✓
                  </span>
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/deals"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-sm ring-1 ring-amber-600/20 transition hover:brightness-105"
              >
                View deals page
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Plan a group outing
              </Link>
              <Link
                href="#testimonials"
                className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Read guest reviews
              </Link>
            </div>
          </div>
        </Reveal>
      </>
    </TropicalFramedSection>
  );
}
