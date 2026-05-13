import { siFacebook, siTripadvisor, siYelp } from "simple-icons";
import Image from "next/image";
import Link from "next/link";
import { MapPinIcon, PhoneIcon, StorefrontIcon } from "@/components/icons/contact-icons";
import { SimpleBrandIcon } from "@/components/icons/simple-brand-icon";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import type { SiteConfig } from "@/lib/site";

export function SiteFooter({ site }: { site: SiteConfig }) {
  const reviewLinks = [
    { href: site.yelpUrl, label: "Hawaiian Rumble on Yelp", icon: siYelp },
    { href: site.tripAdvisorUrl, label: "Hawaiian Rumble on Tripadvisor", icon: siTripadvisor },
    { href: site.facebookUrl, label: "Hawaiian Rumble on Facebook", icon: siFacebook },
  ] as const;

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl border-b border-white/10 px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-xl ring-white/0 transition hover:ring-2 hover:ring-amber-400/25"
          >
            <Image
              src="/logo.png"
              alt="Hawaiian Rumble Adventure Golf"
              width={260}
              height={68}
              className="h-14 w-auto sm:h-16"
            />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-3" aria-label="Reviews and social">
            {reviewLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/15 transition hover:bg-white/12 hover:ring-amber-400/30"
              >
                <span style={{ color: `#${item.icon.hex}` }} className="inline-flex">
                  <SimpleBrandIcon icon={item.icon} className="h-6 w-6" />
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <StaggerRoot className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <MotionItem index={0}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/90">Visit us</p>
            <p className="mt-3 text-lg font-medium text-white">{site.name}</p>
            <ul className="mt-3 space-y-4 text-sm leading-relaxed">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/25">
                  <MapPinIcon className="h-5 w-5" />
                </span>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 underline-offset-2 hover:text-white hover:underline"
                >
                  {site.addressLine}
                  <br />
                  {site.cityStateZip}
                </a>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/25">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <a
                  href={`tel:${site.phoneTel}`}
                  className="font-semibold text-white underline-offset-2 hover:underline"
                >
                  {site.phone}
                </a>
              </li>
            </ul>
          </div>
        </MotionItem>
        <MotionItem index={1}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/90">Hours</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>{site.hours.week}</li>
              <li>{site.hours.weekend}</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Hours may change on holidays. Call ahead to confirm.
            </p>
          </div>
        </MotionItem>
        <MotionItem index={2}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/90">Connect</p>
            <ul className="mt-3 flex flex-col gap-3 text-sm">
              <li className="flex gap-2">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/20">
                  <MapPinIcon className="h-4 w-4" />
                </span>
                <Link
                  href={site.mapsUrl}
                  className="self-center text-white underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </Link>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20">
                  <StorefrontIcon className="h-4 w-4" />
                </span>
                <Link
                  href={site.texasMovieShopUrl}
                  className="self-center text-white underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Great Texas Movie Shop
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Reviews:{" "}
              <a href={site.yelpUrl} className="text-amber-200/90 hover:underline" target="_blank" rel="noopener noreferrer">
                Yelp
              </a>
              {" · "}
              <a
                href={site.tripAdvisorUrl}
                className="text-amber-200/90 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tripadvisor
              </a>
              {" · "}
              <a
                href={site.facebookUrl}
                className="text-amber-200/90 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </p>
          </div>
        </MotionItem>
      </StaggerRoot>
      <div className="border-t border-white/10">
        <Reveal className="py-6 text-center text-xs text-slate-500" y={8}>
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </Reveal>
      </div>
    </footer>
  );
}
