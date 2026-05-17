"use client";

import { useTicketsOptional } from "@/components/tickets-provider";

type Variant = "hero" | "header" | "navMobile" | "ratesPrimary";

type Props = {
  variant: Variant;
  /** e.g. close mobile nav before opening the modal */
  onNavigate?: () => void;
};

export function BuyTicketsButton({ variant, onNavigate }: Props) {
  const tickets = useTicketsOptional();
  if (!tickets) return null;

  const { openTickets } = tickets;

  function handleClick() {
    onNavigate?.();
    openTickets();
  }

  if (variant === "navMobile") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="mt-1 flex min-h-[3.25rem] w-full items-center justify-between rounded-2xl border border-teal-400/35 bg-gradient-to-r from-teal-500/20 to-emerald-600/15 px-4 py-3 text-[15px] font-bold tracking-tight text-white shadow-inner shadow-teal-900/20 transition active:scale-[0.99] hover:border-teal-300/45"
      >
        <span>Buy tickets</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-sm text-teal-100" aria-hidden>
          →
        </span>
      </button>
    );
  }

  if (variant === "hero") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border-2 border-amber-200/80 bg-gradient-to-r from-amber-400 to-orange-500 px-5 text-sm font-bold text-slate-950 shadow-[0_8px_28px_rgba(249,115,22,0.4)] ring-1 ring-white/25 transition hover:brightness-105 active:scale-[0.98] sm:min-h-12 sm:w-auto sm:rounded-full sm:px-6"
      >
        Buy tickets
      </button>
    );
  }

  if (variant === "ratesPrimary") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2.5 text-sm font-bold text-slate-950 shadow-[0_6px_24px_rgba(249,115,22,0.35)] ring-2 ring-white/20 transition hover:brightness-105 active:scale-[0.98]"
      >
        Buy tickets
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md transition hover:border-amber-400/45 hover:bg-white/15 active:scale-[0.97] sm:px-5"
    >
      Buy tickets
    </button>
  );
}
