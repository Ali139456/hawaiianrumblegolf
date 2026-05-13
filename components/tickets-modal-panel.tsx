"use client";

import { useCallback, useEffect, useId, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function TicketsModalPanel({ open, onClose }: Props) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtnRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        aria-label="Close tickets"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-xl flex-col rounded-t-[1.75rem] border border-slate-200/90 bg-surface-elevated shadow-[0_-20px_60px_rgba(0,0,0,0.2)] sm:max-h-[min(90vh,56rem)] sm:rounded-3xl sm:shadow-2xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/80 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-800/90">Hawaiian Rumble</p>
            <h2 id={titleId} className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Buy tickets
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Reserve your round online. Secure checkout is almost ready.
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-7 sm:py-6">
          <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50/80 px-4 py-3.5 text-sm text-amber-950 sm:px-5">
            <p className="font-semibold">Stripe checkout — coming next</p>
            <p className="mt-1 text-sm leading-relaxed text-amber-950/85">
              You&apos;ll pay with card here soon. For now, call the clubhouse or walk in — we&apos;re happy to get you on the course.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Visit date</span>
              <input
                type="text"
                disabled
                placeholder="Date picker — after Stripe"
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Players</span>
              <select
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
                defaultValue=""
              >
                <option value="">Select number of tickets — after Stripe</option>
                <option value="2">2</option>
                <option value="4">4</option>
              </select>
            </label>
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Order summary</p>
              <p className="mt-2 text-sm text-muted">Pricing will reflect live rates, replay deals, and add-ons once checkout is connected.</p>
              <p className="mt-3 text-lg font-bold text-ink">Total — TBD</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/80 pt-6">
            <button
              type="button"
              disabled
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-slate-300 to-slate-400 px-6 text-sm font-bold text-slate-600 shadow-inner cursor-not-allowed"
            >
              Pay with card — coming soon
            </button>
            <p className="text-center text-xs text-muted">Apple Pay and Google Pay can ship with Stripe when you&apos;re ready.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
