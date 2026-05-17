import Image from "next/image";
import { media, type SiteConfig } from "@/lib/site";

const stats = [
  { k: "Courses", v: "Two 18-hole adventures" },
  { k: "Play again", v: "Another 18 · $9.95 same day" },
  { k: "Vibe", v: "Music & tropical fun" },
] as const;

const statDelays = ["hero-stat-delay-1", "hero-stat-delay-2", "hero-stat-delay-3"] as const;

export function HeroSection({ site }: { site: SiteConfig }) {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <div className="hero-image-wrap absolute inset-0">
          <Image
            src={media.hero}
            alt="Tropical mini golf course at Hawaiian Rumble Adventure Golf"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div
          className="hero-gradient-fade absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/25 to-slate-950/45"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.14),transparent_58%)]"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-4 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-16 sm:gap-10 sm:px-6 sm:pb-28 sm:pt-20 lg:pt-28">
        <div className="max-w-2xl">
          <p className="hero-line hero-line-delay-1 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-300/95 sm:text-left sm:text-xs sm:tracking-[0.22em] md:text-sm md:tracking-[0.2em]">
            Orlando, FL · Open 7 days
          </p>
          <div className="hero-line hero-line-delay-2 mt-6 flex flex-col items-stretch gap-3 sm:mt-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-2.5">
            <span className="inline-flex w-full items-center justify-center rounded-xl border border-emerald-400/40 bg-emerald-950/50 px-3 py-2 text-center text-[11px] font-semibold leading-snug text-emerald-100 shadow-[0_6px_18px_rgba(0,0,0,0.18)] backdrop-blur-md sm:w-auto sm:justify-start sm:rounded-full sm:px-3 sm:py-1 sm:text-xs">
              Another 18 holes same day $9.95 · was $15.95
            </span>
            <span className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/12 px-3 py-2 text-center text-[11px] font-semibold leading-snug text-amber-50 shadow-[0_6px_18px_rgba(0,0,0,0.12)] backdrop-blur-md sm:w-auto sm:justify-start sm:rounded-full sm:px-3 sm:py-1 sm:text-xs">
              ~1 mile from Disney &amp; Disney Springs
            </span>
          </div>
          <h1 className="hero-line hero-line-delay-3 mt-8 text-center text-[1.75rem] font-bold leading-[1.12] tracking-tight text-white sm:mt-5 sm:text-left sm:text-4xl sm:leading-[1.08] lg:text-6xl">
            {site.tagline}
          </h1>
          <p className="hero-line hero-line-delay-4 mt-6 max-w-xl text-center text-sm leading-relaxed text-slate-200/95 sm:mt-5 sm:text-left sm:text-base lg:text-lg">
            Two full 18-hole courses with lights, music, and tropical energy. Walk in, play one or double up
            and save when you play another 18 the same day.
          </p>
        </div>

        <dl className="grid w-full max-w-md grid-cols-2 gap-4 self-center sm:max-w-none sm:grid-cols-3 sm:gap-3 sm:self-stretch">
          {stats.map((item, i) => (
            <div
              key={item.k}
              className={`hero-stat ${statDelays[i]} rounded-2xl border border-white/25 bg-white/[0.14] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_12px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:px-4 sm:py-4 ${
                i === 2
                  ? "col-span-2 justify-self-center w-[calc((100%-1rem)/2)] sm:col-span-1 sm:w-auto sm:justify-self-stretch"
                  : ""
              }`}
            >
              <dt className="text-[9px] font-bold uppercase tracking-[0.18em] text-amber-200/95 sm:text-xs sm:tracking-widest">
                {item.k}
              </dt>
              <dd className="mt-1 text-xs font-semibold leading-snug text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.4)] sm:mt-1.5 sm:text-sm sm:font-medium">
                {item.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
