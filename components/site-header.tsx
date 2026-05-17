"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BuyTicketsButton } from "@/components/buy-tickets-button";
import { HOME_SECTIONS, homeHash } from "@/lib/site-paths";

type NavItem = { href: string; label: string };

const nav: NavItem[] = [
  { href: homeHash(HOME_SECTIONS.rates), label: "Rates" },
  { href: "/deals", label: "Deals" },
  { href: homeHash(HOME_SECTIONS.gallery), label: "Gallery" },
  { href: homeHash(HOME_SECTIONS.testimonials), label: "Reviews" },
  { href: homeHash(HOME_SECTIONS.texasMovieShop), label: "Texas Movie Shop" },
  { href: homeHash(HOME_SECTIONS.contact), label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header-enter relative z-10 border-b border-white/10 bg-slate-950/70 shadow-[0_4px_30px_rgba(0,0,0,0.45)] backdrop-blur-2xl backdrop-saturate-150">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/35 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-sky-500/20 via-amber-400/25 to-orange-500/20"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-3 py-3 pl-2 pr-4 sm:gap-4 sm:py-4 sm:pl-3 sm:pr-6 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4 md:pl-4">
        <div className="shrink-0 justify-self-start -ml-0.5 sm:-ml-1 md:-ml-2">
          <div className="transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98]">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 rounded-xl ring-white/0 transition hover:ring-2 hover:ring-amber-400/20"
              onClick={() => setOpen(false)}
            >
              <Image
                src="/logo.png"
                alt="Hawaiian Rumble Adventure Golf"
                width={280}
                height={72}
                className="h-12 w-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:h-14 md:h-16"
                priority
              />
            </Link>
          </div>
        </div>

        <nav className="hidden items-center justify-self-center md:flex" aria-label="Primary">
          <div className="flex items-center rounded-full border border-white/10 bg-slate-900/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] ring-1 ring-black/40">
            {nav.map((item) => {
              const active = item.href === "/deals" && pathname === "/deals";
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors sm:px-4 ${
                    active
                      ? "text-white ring-1 ring-white/40 ring-inset bg-white/[0.12]"
                      : "text-slate-200 hover:text-white"
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span
                    className="absolute inset-0 rounded-full bg-white/0 transition-colors duration-200 group-hover:bg-white/[0.08]"
                    aria-hidden
                  />
                  {!active ? (
                    <span
                      className="pointer-events-none absolute bottom-1 left-1/2 h-0.5 w-8 origin-center -translate-x-1/2 scale-x-0 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-transform duration-300 ease-out group-hover:scale-x-100"
                      aria-hidden
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-end justify-self-end gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 md:flex">
            <BuyTicketsButton variant="header" />
            <div className="transition-transform duration-200 ease-out hover:-translate-y-px active:scale-[0.97]">
              <Link
                href={homeHash(HOME_SECTIONS.rates)}
                className="group/cta relative inline-flex overflow-hidden rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_4px_20px_rgba(249,115,22,0.35)] ring-1 ring-white/25 transition-[filter] hover:brightness-110"
                aria-label="Come join us: see rates and plan your visit"
              >
                <span
                  className="cta-shine-sweep pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 ease-out group-hover/cta:translate-x-full"
                  aria-hidden
                />
                <span className="relative z-10">Come join us</span>
              </Link>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-b from-white/[0.12] to-white/[0.04] p-2.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ring-1 ring-white/10 transition active:scale-95 hover:border-amber-400/40 hover:from-white/[0.16] md:hidden"
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
        <div className="border-t border-white/10 bg-slate-950/95 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 md:hidden">
          <div className="mx-3 rounded-3xl border border-white/12 bg-gradient-to-b from-white/[0.09] via-white/[0.04] to-transparent p-4 shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.32em] text-amber-300/90">
              Explore
            </p>
            <p className="mt-1 text-center text-xs text-slate-400">Mini golf near Disney · Orlando</p>
            <div className="mt-4 flex flex-col gap-2">
              {nav.map((item) => {
                const active = item.href === "/deals" && pathname === "/deals";
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex min-h-[3.25rem] items-center justify-between rounded-2xl border px-4 py-3 text-[15px] font-semibold tracking-tight transition active:scale-[0.99] ${
                      active
                        ? "border-amber-400/50 bg-gradient-to-r from-amber-400/20 to-orange-500/15 text-white shadow-inner shadow-amber-900/20"
                        : "border-white/8 bg-white/[0.05] text-slate-100 hover:border-amber-400/25 hover:bg-white/[0.1]"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                        active ? "bg-amber-400/25 text-amber-200" : "bg-white/10 text-amber-300/90"
                      }`}
                      aria-hidden
                    >
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
            <BuyTicketsButton variant="navMobile" onNavigate={() => setOpen(false)} />
            <Link
              href={homeHash(HOME_SECTIONS.rates)}
              className="mt-2 flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 text-base font-bold text-slate-950 shadow-lg shadow-orange-500/35 ring-2 ring-white/25 transition active:scale-[0.98] hover:brightness-105"
              onClick={() => setOpen(false)}
            >
              Come join us
            </Link>
            <p className="mt-3 text-center text-[11px] text-slate-500">Tap a link above or see rates &amp; deals</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
