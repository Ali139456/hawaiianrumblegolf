import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { SiteFooter } from "@/components/site-footer";
import { StickySiteChrome } from "@/components/sticky-site-chrome";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Deals & specials",
  description: `Current offers and ways to save at ${site.name} in Orlando, FL. Group rates, replay pricing, and window discounts.`,
};

export default function DealsPage() {
  const { dealsPage, hours, phone, phoneTel } = site;

  return (
    <div className="flex min-h-full flex-col">
      <StickySiteChrome />
      <main className="flex-1">
        <section className="border-b border-slate-200/80 bg-surface px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-800/80">Save on your round</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{dealsPage.title}</h1>
              <p className="mt-4 text-lg text-muted">{dealsPage.subtitle}</p>
            </Reveal>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-7 lg:grid-cols-3">
            {dealsPage.cards.map((card, i) => (
              <Reveal key={card.title} delay={i * 0.06}>
                <article className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-950 ring-1 ring-amber-400/30">
                      {card.badge}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold text-slate-900">{card.title}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{card.body}</p>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      {card.compareAt ? (
                        <span className="text-lg text-slate-400 line-through decoration-slate-400">
                          {card.compareAt}
                        </span>
                      ) : null}
                      <span className="text-2xl font-bold text-slate-900">{card.price}</span>
                    </div>
                    <p className="mt-1 text-xs font-medium text-slate-500">{card.hint}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-12 max-w-3xl" delay={0.12}>
            <div className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-6 text-center shadow-sm sm:px-8">
              <p className="text-sm font-semibold text-slate-800">Hours</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>{hours.week}</li>
                <li>{hours.weekend}</li>
              </ul>
              <p className="mt-4 text-sm">
                <a href={`tel:${phoneTel}`} className="font-semibold text-sky-800 hover:underline">
                  {phone}
                </a>
              </p>
              <p className="mt-4 text-xs text-muted">{dealsPage.footnote}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/#rates"
                  className="inline-flex rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Full rate breakdown
                </Link>
                <Link
                  href="/#contact"
                  className="inline-flex rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  Contact for groups
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
