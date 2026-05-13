"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";

type Props = {
  open: boolean;
  onClose: () => void;
};

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseUsd(s: string) {
  const n = Number.parseFloat(s.replace(/[^0-9.]/g, ""));
  return Number.isNaN(n) ? 0 : n;
}

function formatVisitDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TicketsModalPanel({ open, onClose }: Props) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const minDate = useMemo(() => todayIsoDate(), []);

  const [visitDate, setVisitDate] = useState("");
  const [players, setPlayers] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [checkoutHint, setCheckoutHint] = useState(false);

  const firstRoundLabel = site.rates.leftColumn[0].label;
  const firstRoundPrice = site.rates.leftColumn[0].price;
  const unit = parseUsd(firstRoundPrice);

  const playersNum = players ? Number.parseInt(players, 10) : 0;
  const estimate =
    playersNum > 0 && unit > 0 ? (playersNum * unit).toFixed(2) : null;

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

  useEffect(() => {
    if (!open) {
      setVisitDate("");
      setPlayers("");
      setFieldError(null);
      setCheckoutHint(false);
    }
  }, [open]);

  function handlePay() {
    setFieldError(null);
    setCheckoutHint(false);
    if (!visitDate) {
      setFieldError("Choose a visit date.");
      return;
    }
    if (!players) {
      setFieldError("Select how many players.");
      return;
    }
    setCheckoutHint(true);
  }

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
              Pick your visit and head count. Card payments run on{" "}
              <span className="font-semibold text-slate-800">Stripe</span> from this screen once checkout is wired
              to your keys.
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
          <div className="rounded-2xl border border-teal-200/90 bg-gradient-to-br from-teal-50 to-sky-50/90 px-4 py-3.5 text-sm text-teal-950 sm:px-5">
            <p className="font-semibold">Stripe · secure card payments</p>
            <p className="mt-1 text-sm leading-relaxed text-teal-950/90">
              Guests pay with major cards (and can use Apple Pay / Google Pay through Stripe). Use the fields below
              to plan your group; the last step opens your live checkout session after you connect Stripe to this app.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Visit date</span>
              <input
                type="date"
                min={minDate}
                value={visitDate}
                onChange={(e) => {
                  setVisitDate(e.target.value);
                  setFieldError(null);
                  setCheckoutHint(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Players</span>
              <select
                value={players}
                onChange={(e) => {
                  setPlayers(e.target.value);
                  setFieldError(null);
                  setCheckoutHint(false);
                }}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-ink shadow-sm outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              >
                <option value="">How many tickets?</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>
                    {n} {n === 1 ? "player" : "players"}
                  </option>
                ))}
              </select>
            </label>

            {fieldError ? (
              <p className="text-sm font-medium text-rose-700" role="status">
                {fieldError}
              </p>
            ) : null}

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Order summary</p>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                <li>
                  <span className="font-medium text-ink">Visit: </span>
                  {visitDate ? formatVisitDate(visitDate) : "—"}
                </li>
                <li>
                  <span className="font-medium text-ink">Tickets: </span>
                  {players ? `${players} ${players === "1" ? "player" : "players"}` : "—"}
                </li>
                <li>
                  <span className="font-medium text-ink">Basis: </span>
                  {firstRoundLabel} at posted {firstRoundPrice} per person (replay and group rules still apply at
                  checkout).
                </li>
              </ul>
              <p className="mt-4 text-lg font-bold text-ink">
                {estimate ? `About $${estimate} subtotal` : "Estimated total at checkout"}
              </p>
              {estimate ? (
                <p className="mt-1 text-xs text-muted">
                  Ballpark for first round only; replay same-day and window discounts finalize in Stripe.
                </p>
              ) : (
                <p className="mt-1 text-xs text-muted">Select date and players to see a rough subtotal.</p>
              )}
            </div>
          </div>

          {checkoutHint ? (
            <div
              className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3.5 text-sm text-emerald-950 sm:px-5"
              role="status"
            >
              <p className="font-semibold">You&apos;re ready on our side</p>
              <p className="mt-1 leading-relaxed text-emerald-950/90">
                {formatVisitDate(visitDate)} · {players} {players === "1" ? "player" : "players"}. When Stripe
                Checkout is hooked to this button, paying here takes a few seconds. Until then, call{" "}
                <a href={`tel:${site.phoneTel}`} className="font-semibold text-emerald-900 underline-offset-2 hover:underline">
                  {site.phone}
                </a>{" "}
                or walk in — we&apos;ll get you on the course.
              </p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-200/80 pt-6">
            <button
              type="button"
              onClick={handlePay}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-6 text-sm font-bold text-slate-950 shadow-[0_6px_24px_rgba(249,115,22,0.35)] ring-2 ring-white/25 transition hover:brightness-105 active:scale-[0.99]"
            >
              Pay with card
            </button>
            <p className="text-center text-xs text-muted">
              Apple Pay and Google Pay are available through Stripe on supported devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
