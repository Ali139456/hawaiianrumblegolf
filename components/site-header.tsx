"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "#rates", label: "Rates" },
  { href: "#experience", label: "Experience" },
  { href: "#gallery", label: "Gallery" },
  { href: "#gift-shop", label: "Gift shop" },
  { href: "#contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header-enter sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 shadow-[0_4px_30px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-sky-500/20 via-amber-400/25 to-orange-500/20"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        <div className="shrink-0 justify-self-start">
          <div className="transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-xl ring-white/0 transition hover:ring-2 hover:ring-amber-400/20"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Hawaiian Rumble Adventure Golf"
                width={220}
                height={56}
                className="h-10 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:h-12"
                priority
              />
            </Link>
          </div>
        </div>

        <nav className="hidden items-center justify-self-center md:flex" aria-label="Primary">
          <div className="flex items-center rounded-full border border-white/10 bg-slate-900/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-black/40">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-full px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:text-white sm:px-4"
              >
                <span className="relative z-10">{item.label}</span>
                <span
                  className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-200 group-hover:bg-white/[0.08]"
                  aria-hidden
                />
                <span
                  className="pointer-events-none absolute bottom-1 left-1/2 h-0.5 w-8 origin-center -translate-x-1/2 scale-x-0 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-end justify-self-end gap-3">
          <div className="hidden transition-transform duration-200 ease-out hover:-translate-y-px active:scale-[0.97] md:block">
            <Link
              href={siteHref("rates")}
              className="group/cta relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_4px_20px_rgba(249,115,22,0.35)] ring-1 ring-white/25 transition-[filter] hover:brightness-110"
            >
              <span
                className="cta-shine-sweep pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 ease-out group-hover/cta:translate-x-full"
                aria-hidden
              />
              <span className="relative z-10">Book a visit</span>
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.07] p-2.5 text-white shadow-inner shadow-white/5 ring-1 ring-white/10 transition hover:border-amber-400/30 hover:bg-white/10 md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            {open ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-gradient-to-b from-slate-950/98 to-slate-950 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1.5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.04] px-4 py-3 text-base font-medium text-slate-100 transition hover:border-amber-400/20 hover:bg-white/[0.08]"
                onClick={() => setOpen(false)}
              >
                {item.label}
                <span className="text-amber-400/80" aria-hidden>
                  →
                </span>
              </Link>
            ))}
            <Link
              href={siteHref("rates")}
              className="mt-1 block rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-3.5 text-center text-base font-semibold text-slate-950 shadow-lg shadow-orange-500/25 ring-1 ring-white/20"
              onClick={() => setOpen(false)}
            >
              View rates
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function siteHref(hash: string) {
  return `/#${hash}`;
}
