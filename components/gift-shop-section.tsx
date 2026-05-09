import Image from "next/image";
import Link from "next/link";
import { media, site } from "@/lib/site";

export function GiftShopSection() {
  return (
    <section id="gift-shop" className="scroll-mt-24 bg-slate-950 px-4 py-20 text-white sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:items-center">
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-300/95">
            While you&apos;re here
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Orlando&apos;s most unique gift shop
          </h2>
          <p className="mt-4 text-lg text-slate-300">
            Browse movie posters, Hollywood collectibles, one-of-a-kind finds, and retro candy—then
            visit{" "}
            <span className="font-semibold text-white">The Great Texas Movie Shop</span> online.
          </p>
          <Link
            href={site.texasMovieShopUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
          >
            Explore the movie shop
          </Link>
        </div>
        <div className="order-1 overflow-hidden rounded-3xl border border-white/10 shadow-2xl lg:order-2">
          <Image
            src={media.giftShop}
            alt="Gift shop and collectibles at Hawaiian Rumble"
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
