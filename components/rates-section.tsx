import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { site } from "@/lib/site";

type TicketLine = {
  label: string;
  detail: string;
  price: string;
  pricePrefix: string;
  priceNote?: string;
  highlight?: boolean;
  badge?: string;
  cta?: { readonly href: string; readonly label: string };
};

function TicketRow({ item }: { item: TicketLine }) {
  const base =
    "relative rounded-xl border px-5 py-5 text-left shadow-sm transition-colors sm:px-6 sm:py-5";

  const normal = "border-white/10 bg-slate-900/60";

  const featured =
    "border-amber-400/35 bg-gradient-to-br from-amber-950/40 to-slate-900/80 ring-1 ring-amber-400/25";

  return (
    <div className={`${base} ${item.highlight ? featured : normal}`}>
      {item.badge ? (
        <span className="absolute right-3 top-3 rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:right-4 sm:top-4 sm:text-xs">
          {item.badge}
        </span>
      ) : null}
      <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{item.label}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.detail}</p>
      <p className="mt-4 flex flex-wrap items-baseline gap-2">
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
      {item.cta ? (
        <Link
          href={item.cta.href}
          className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15 sm:w-auto"
        >
          {item.cta.label}
        </Link>
      ) : null}
    </div>
  );
}

export function RatesSection() {
  const { rates } = site;

  return (
    <section id="rates" className="scroll-mt-24 bg-surface px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ticket rates &amp; pricing
          </h2>
          <p className="mt-3 text-lg text-muted">
            Walk-ins welcome. Ask about specials for military, seniors, Florida residents, and Disney
            &amp; Universal cast members.
          </p>
        </Reveal>

        <Reveal className="mt-10" delay={0.05}>
          <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#070b12] shadow-2xl shadow-slate-900/50 ring-1 ring-white/5">
            <div className="border-b border-white/10 bg-gradient-to-b from-slate-900/90 to-[#070b12] px-6 py-7 text-center sm:px-10 sm:py-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.38em] text-amber-400 sm:text-xs sm:tracking-[0.35em]">
                {rates.title}
              </p>
            </div>

            <div className="px-5 py-8 sm:px-10 sm:py-10">
              <StaggerRoot className="grid gap-8 md:grid-cols-2 md:gap-10 lg:gap-14">
                <div className="flex flex-col gap-4">
                  {rates.leftColumn.map((item, i) => (
                    <MotionItem key={item.label} index={i}>
                      <TicketRow item={item} />
                    </MotionItem>
                  ))}
                </div>
                <div className="flex flex-col gap-4">
                  {rates.rightColumn.map((item, i) => (
                    <MotionItem key={item.label} index={i + rates.leftColumn.length}>
                      <TicketRow item={item} />
                    </MotionItem>
                  ))}
                </div>
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
            className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 sm:p-8"
          >
            <h3 className="text-lg font-semibold text-slate-900">Groups &amp; parties</h3>
            <p className="mt-2 max-w-3xl text-muted">
              Planning a birthday, team outing, or large group? Stop by the clubhouse or send us a
              message—we&apos;ll help you plan.
            </p>
            <Link
              href="#contact"
              className="mt-6 inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Contact us about groups
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
