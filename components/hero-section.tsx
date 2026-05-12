import Image from "next/image";
import Link from "next/link";
import { media, site } from "@/lib/site";

const stats = [
  { k: "Courses", v: "Two 18-hole adventures" },
  { k: "Location", v: "~1 mi from Disney" },
  { k: "Vibe", v: "Music & tropical fun" },
] as const;

const statDelays = ["hero-stat-delay-1", "hero-stat-delay-2", "hero-stat-delay-3"] as const;

export function HeroSection() {
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

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:pt-28">
        <div className="max-w-2xl">
          <p className="hero-line hero-line-delay-1 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300/95">
            Orlando, FL · Open 7 days
          </p>
          <h1 className="hero-line hero-line-delay-2 mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {site.tagline}
          </h1>
          <p className="hero-line hero-line-delay-3 mt-5 max-w-xl text-lg leading-relaxed text-slate-200/95">
            Two exciting 18-hole courses with island vibes, music, and fun for every age—minutes from
            Disney World.
          </p>
          <div className="hero-line hero-line-delay-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#rates"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/25 transition hover:brightness-105 active:scale-[0.98]"
            >
              See rates &amp; deals
            </Link>
            <Link
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10 active:scale-[0.98]"
            >
              Get directions
            </Link>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3">
          {stats.map((item, i) => (
            <div
              key={item.k}
              className={`hero-stat ${statDelays[i]} rounded-2xl border border-white/20 bg-white/[0.12] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl`}
            >
              <dt className="text-xs font-semibold uppercase tracking-widest text-amber-200">
                {item.k}
              </dt>
              <dd className="mt-1 text-sm font-medium text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.35)]">
                {item.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
