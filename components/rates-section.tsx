import Link from "next/link";
import { site } from "@/lib/site";

export function RatesSection() {
  return (
    <section id="rates" className="scroll-mt-24 bg-surface px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Simple pricing for big fun
          </h2>
          <p className="mt-3 text-lg text-muted">
            Walk-ins welcome. Ask about specials for military, seniors, Florida residents, and
            Disney &amp; Universal cast members.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-600">
              {site.rates.firstGame.note}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{site.rates.firstGame.label}</h3>
            <p className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
              <span className="align-top text-2xl">$</span>
              {site.rates.firstGame.price}
            </p>
            <p className="mt-2 text-sm text-muted">Per person</p>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-amber-50 to-orange-50 p-8 shadow-md ring-1 ring-orange-200/60">
            <div className="absolute right-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Popular
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-700">
              {site.rates.secondGame.note}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{site.rates.secondGame.label}</h3>
            <p className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
              <span className="align-top text-2xl">$</span>
              {site.rates.secondGame.price}
            </p>
            <p className="mt-2 text-sm text-muted">Replay the fun the same day</p>
          </article>

          <article className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky-700">Groups</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{site.rates.group.label}</h3>
            <p className="mt-6 text-5xl font-bold tracking-tight text-slate-900">
              <span className="align-top text-2xl">$</span>
              {site.rates.group.price}
            </p>
            <p className="mt-2 text-sm text-muted">{site.rates.group.note}</p>
            <Link
              href="#contact"
              className="mt-8 inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              Plan a group outing
            </Link>
          </article>
        </div>

        <div
          id="deals"
          className="mt-10 rounded-3xl border border-dashed border-slate-300 bg-slate-50/80 p-6 sm:p-8"
        >
          <h3 className="text-lg font-semibold text-slate-900">Deals &amp; discounts</h3>
          <p className="mt-2 max-w-3xl text-muted">
            Promotions can change seasonally. Stop by the clubhouse for the latest offers—or send us
            a note and we&apos;ll point you in the right direction.
          </p>
        </div>
      </div>
    </section>
  );
}
