import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { site } from "@/lib/site";

const mapSrc = `https://maps.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}&z=15&output=embed`;

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-surface px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Contact &amp; location
          </h2>
          <p className="mt-3 text-lg text-muted">
            {site.addressLine}, {site.cityStateZip} · {site.phone}
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {site.highlights.map((h) => (
              <li key={h}>{h}</li>
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
      </div>
    </section>
  );
}
