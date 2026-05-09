import Image from "next/image";
import Link from "next/link";
import { media, site } from "@/lib/site";

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-slate-950">
      <div className="absolute inset-0">
        <Image
          src={media.hero}
          alt="Tropical mini golf course at Hawaiian Rumble Adventure Golf"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/55 to-slate-950"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.18),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:pt-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300/95">
            Orlando, FL · Open 7 days
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {site.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200/95">
            Two exciting 18-hole courses with island vibes, music, and fun for every age—minutes
            from Disney World.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#rates"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-orange-500/20 transition hover:brightness-105"
            >
              See rates &amp; deals
            </Link>
            <Link
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              Get directions
            </Link>
          </div>
        </div>

        <dl className="grid gap-3 sm:grid-cols-3">
          {[
            { k: "Courses", v: "Two 18-hole adventures" },
            { k: "Location", v: "~1 mi from Disney" },
            { k: "Vibe", v: "Music & tropical fun" },
          ].map((item) => (
            <div
              key={item.k}
              className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-4 backdrop-blur-md"
            >
              <dt className="text-xs font-semibold uppercase tracking-widest text-amber-200/90">
                {item.k}
              </dt>
              <dd className="mt-1 text-sm font-medium text-white">{item.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
