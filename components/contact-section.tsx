import type { ReactNode } from "react";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { MapPinIcon, PhoneIcon } from "@/components/icons/contact-icons";
import { Reveal } from "@/components/motion/reveal";
import { MotionItem, StaggerRoot } from "@/components/motion/stagger";
import { TropicalFramedSection } from "@/components/tropical-framed-section";
import type { SiteConfig } from "@/lib/site";

function InfoCard({
  icon,
  label,
  children,
  tone,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  tone: "sky" | "amber" | "teal";
}) {
  const toneClass = {
    sky: "bg-sky-500/10 text-sky-300 ring-sky-400/20",
    amber: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
    teal: "bg-teal-500/10 text-teal-300 ring-teal-400/20",
  }[tone];

  return (
    <div className="rounded-2xl border border-white/10 bg-surface-elevated/80 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:p-5">
      <div className="flex gap-3">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${toneClass}`}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <div className="mt-1.5 text-sm leading-relaxed text-slate-200 sm:text-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function ContactSection({ site }: { site: SiteConfig }) {
  const mapSrc = `https://maps.google.com/maps?q=${site.coordinates.lat},${site.coordinates.lng}&z=15&output=embed`;

  return (
    <TropicalFramedSection id="contact">
      <>
        <Reveal className="max-w-3xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal-400/90">
            Plan your visit
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Contact &amp; location
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Questions about groups, parties, or your round? Message us below or call — we&apos;re a mile from
            Disney &amp; Disney Springs.
          </p>
        </Reveal>

        <Reveal className="mt-10 lg:mt-12" delay={0.05}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              tone="sky"
              label="Address"
              icon={<MapPinIcon className="h-5 w-5" />}
            >
              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ink underline-offset-2 transition hover:text-sky-400 hover:underline"
              >
                {site.addressLine}
                <br />
                {site.cityStateZip}
              </a>
            </InfoCard>

            <InfoCard tone="amber" label="Phone" icon={<PhoneIcon className="h-5 w-5" />}>
              <a
                href={`tel:${site.phoneTel}`}
                className="text-lg font-bold text-ink underline-offset-2 transition hover:text-amber-300 hover:underline"
              >
                {site.phone}
              </a>
              <p className="mt-1 text-xs text-slate-500">Walk-ins welcome · open 7 days</p>
            </InfoCard>

            <InfoCard
              tone="teal"
              label="Hours"
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            >
              <ul className="space-y-1.5">
                <li>{site.hours.week}</li>
                <li>{site.hours.weekend}</li>
              </ul>
            </InfoCard>
          </div>
        </Reveal>

        <ul className="mt-6 flex flex-wrap gap-2">
          {site.highlights.map((h) => (
            <li
              key={h}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`tel:${site.phoneTel}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 text-sm font-semibold text-slate-950 shadow-[0_4px_20px_rgba(249,115,22,0.3)] transition hover:brightness-105"
          >
            Call {site.phone}
          </a>
          <Link
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-to-r from-sky-400 via-cyan-500 to-teal-500 px-5 text-sm font-bold text-white shadow-[0_4px_20px_rgba(14,165,233,0.4)] ring-2 ring-sky-300/35 transition hover:brightness-110 active:scale-[0.98]"
          >
            Get directions
          </Link>
        </div>

        <StaggerRoot className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <MotionItem index={0} className="flex flex-col">
            <ContactForm />
          </MotionItem>

          <MotionItem index={1} className="flex flex-col">
            <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-elevated shadow-[0_12px_48px_rgba(0,0,0,0.35)] ring-1 ring-white/5 lg:min-h-[520px]">
              <div className="border-b border-white/10 px-5 py-4 sm:px-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Map</p>
                <p className="mt-1 font-semibold text-ink">Find us on State Road 535</p>
                <p className="mt-0.5 text-sm text-muted">~1 mile from Walt Disney World &amp; Disney Springs</p>
              </div>

              <div className="relative min-h-[280px] flex-1 bg-slate-950">
                <iframe
                  title="Map of Hawaiian Rumble Adventure Golf"
                  src={mapSrc}
                  className="contact-map-embed absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-surface-elevated/30 via-transparent to-surface-elevated/80"
                  aria-hidden
                />
                <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/15 bg-slate-950/85 px-3 py-2 shadow-lg backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-amber-300/90">You are here</p>
                  <p className="mt-0.5 text-xs font-semibold text-white">{site.shortName}</p>
                </div>
              </div>

              <a
                href={site.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 border-t border-white/10 bg-surface-muted/50 px-4 text-sm font-semibold text-sky-400 transition hover:bg-white/5"
              >
                Open in Google Maps
                <span aria-hidden>→</span>
              </a>
            </div>
          </MotionItem>
        </StaggerRoot>
      </>
    </TropicalFramedSection>
  );
}
