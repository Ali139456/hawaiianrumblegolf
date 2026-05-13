import { ContactForm } from "@/components/contact-form";
import { MapPinIcon, PhoneIcon } from "@/components/icons/contact-icons";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { TropicalFramedSection } from "@/components/tropical-framed-section";
import type { SiteConfig } from "@/lib/site";

export function ContactSection({ site }: { site: SiteConfig }) {
  const mapSrc = `https://maps.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}&z=15&output=embed`;

  return (
    <TropicalFramedSection id="contact">
      <>
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Contact &amp; location
          </h2>
          <ul className="mt-5 space-y-4 text-slate-700">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Address</p>
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 block text-lg font-medium text-slate-900 underline-offset-2 hover:text-sky-800 hover:underline"
                >
                  {site.addressLine}
                  <br />
                  {site.cityStateZip}
                </a>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <PhoneIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Phone</p>
                <a
                  href={`tel:${site.phoneTel}`}
                  className="mt-0.5 block text-lg font-semibold text-slate-900 underline-offset-2 hover:text-sky-800 hover:underline"
                >
                  {site.phone}
                </a>
              </div>
            </li>
          </ul>
          <ul className="mt-6 space-y-2 border-t border-slate-200/80 pt-6 text-sm text-slate-700">
            {site.highlights.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </Reveal>

        <StaggerRoot className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-12">
          <MotionItem index={0}>
            <ContactForm />
          </MotionItem>
          <MotionItem index={1}>
            <div className="flex min-h-[320px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:min-h-[480px]">
              <iframe
                title="Map of Hawaiian Rumble Adventure Golf"
                src={mapSrc}
                className="h-full min-h-[320px] w-full flex-1 border-0 lg:min-h-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-t border-slate-200 px-4 py-3 text-center text-sm font-semibold text-sky-800 hover:bg-slate-50"
              >
                Open in Google Maps
              </a>
            </div>
          </MotionItem>
        </StaggerRoot>
      </>
    </TropicalFramedSection>
  );
}
