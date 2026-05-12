import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <StaggerRoot className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-3">
        <MotionItem index={0}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/90">
              Visit us
            </p>
            <p className="mt-3 text-lg font-medium text-white">{site.name}</p>
            <p className="mt-2 text-sm leading-relaxed">
              {site.addressLine}
              <br />
              {site.cityStateZip}
            </p>
            <p className="mt-3">
              <a
                href={`tel:${site.phoneTel}`}
                className="text-lg font-semibold text-white hover:underline"
              >
                {site.phone}
              </a>
            </p>
          </div>
        </MotionItem>
        <MotionItem index={1}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/90">
              Hours
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>{site.hours.week}</li>
              <li>{site.hours.weekend}</li>
            </ul>
            <p className="mt-4 text-xs text-slate-500">
              Hours may change on holidays—call ahead to confirm.
            </p>
          </div>
        </MotionItem>
        <MotionItem index={2}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-300/90">
              Connect
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              <li>
                <Link
                  href={site.mapsUrl}
                  className="text-white underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Google Maps
                </Link>
              </li>
              <li>
                <Link
                  href={site.facebookUrl}
                  className="text-white underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href={site.texasMovieShopUrl}
                  className="text-white underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  The Great Texas Movie Shop
                </Link>
              </li>
            </ul>
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
