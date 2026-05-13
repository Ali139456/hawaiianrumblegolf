import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { media } from "@/lib/site";

export function AmenitiesSection() {
  return (
    <section className="bg-surface px-4 py-20 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal className="overflow-hidden rounded-3xl border border-slate-200 shadow-lg" y={20}>
          <Image
            src={media.refreshments}
            alt="Clubhouse refreshments at Hawaiian Rumble"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </Reveal>
        <Reveal className="lg:pl-2" delay={0.12} y={20}>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Drinks, snacks &amp; sweets
          </h2>
          <p className="mt-3 text-lg text-muted">
            After your round, cool off with bottled water and soft drinks from the clubhouse, and
            explore a giant candy selection for the ride home.
          </p>
          <ul className="mt-8 space-y-3 text-slate-800">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" aria-hidden />
              Cold beverages ready when you finish your game
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sky-500" aria-hidden />
              Candy shop packed with treats for kids (and kids at heart)
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
