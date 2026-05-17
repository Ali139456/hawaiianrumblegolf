"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { site } from "@/lib/site";

type Props = {
  open: boolean;
  onClose: () => void;
};

type PricedOfferingId = "first" | "replay" | "group";

type OfferingDef = {
  id: PricedOfferingId;
  title: string;
  tagline: string;
  detail: string;
  priceLine: string;
  unitUsd: number;
  minGuests?: number;
};

const CARD_IDLE: Record<PricedOfferingId, string> = {
  first:
    "border-white/10 bg-gradient-to-br from-sky-950/50 via-surface-elevated to-cyan-950/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-sky-500/40 hover:shadow-md",
  replay:
    "border-white/10 bg-gradient-to-br from-amber-950/40 via-surface-elevated to-orange-950/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-amber-500/40 hover:shadow-md",
  group:
    "border-white/10 bg-gradient-to-br from-violet-950/40 via-surface-elevated to-fuchsia-950/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-violet-500/40 hover:shadow-md",
};

const CARD_ON: Record<PricedOfferingId, string> = {
  first:
    "border-sky-500 bg-gradient-to-br from-sky-900/80 to-cyan-900/60 shadow-[0_12px_40px_rgba(14,165,233,0.25)] ring-2 ring-sky-400/50",
  replay:
    "border-amber-500 bg-gradient-to-br from-amber-900/80 to-orange-900/60 shadow-[0_12px_40px_rgba(251,191,36,0.2)] ring-2 ring-amber-400/55",
  group:
    "border-violet-500 bg-gradient-to-br from-violet-900/80 to-fuchsia-900/60 shadow-[0_12px_40px_rgba(139,92,246,0.22)] ring-2 ring-violet-400/45",
};

const CATEGORY_TONE: Record<PricedOfferingId, string> = {
  first: "bg-sky-600/15 text-sky-900 ring-1 ring-sky-500/25",
  replay: "bg-amber-500/15 text-amber-950 ring-1 ring-amber-500/30",
  group: "bg-violet-600/15 text-violet-950 ring-1 ring-violet-500/25",
};

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseUsd(s: string) {
  const n = Number.parseFloat(String(s).replace(/[^0-9.]/g, ""));
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

function buildOfferings(): OfferingDef[] {
  const r = site.rates;
  const first = r.leftColumn[0];
  const replay = r.leftColumn[1];
  const group = r.rightColumn[0];
  return [
    {
      id: "first",
      title: `${first.label} · 18 holes`,
      tagline: "Per person · your first round of the day",
      detail: first.detail,
      priceLine: `From $${first.price}`,
      unitUsd: parseUsd(first.price),
    },
    {
      id: "replay",
      title: `${replay.label} · same-day replay`,
      tagline: "Per person · after a paid first round",
      detail: replay.detail,
      priceLine: `From $${replay.price}`,
      unitUsd: parseUsd(replay.price),
    },
    {
      id: "group",
      title: `${group.label}`,
      tagline: "Per person · parties & outings",
      detail: group.detail,
      priceLine: `From $${group.price}`,
      unitUsd: parseUsd(group.price),
      minGuests: 20,
    },
  ];
}

function categoryLabel(id: PricedOfferingId) {
  if (id === "first") return "Single";
  if (id === "replay") return "Replay";
  return "Group";
}

export function TicketsModalPanel({ open, onClose }: Props) {
  const titleId = useId();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const minDate = useMemo(() => todayIsoDate(), []);
  const offerings = useMemo(() => buildOfferings(), []);

  const [visitDate, setVisitDate] = useState("");
  const [players, setPlayers] = useState("");
  const [selected, setSelected] = useState<Record<PricedOfferingId, boolean>>({
    first: false,
    replay: false,
    group: false,
  });
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [checkoutPending, setCheckoutPending] = useState(false);

  const playersNum = players ? Number.parseInt(players, 10) : 0;

  const lineItems = useMemo(() => {
    const rows: { label: string; amount: number; note?: string }[] = [];
    if (!playersNum) return rows;

    if (selected.first) {
      rows.push({
        label: `${site.rates.leftColumn[0].label} × ${playersNum} @ $${site.rates.leftColumn[0].price}`,
        amount: playersNum * parseUsd(site.rates.leftColumn[0].price),
      });
    }
    if (selected.replay) {
      rows.push({
        label: `${site.rates.leftColumn[1].label} × ${playersNum} @ $${site.rates.leftColumn[1].price}`,
        amount: playersNum * parseUsd(site.rates.leftColumn[1].price),
      });
    }
    if (selected.group) {
      const minG = 20;
      const head = Math.max(playersNum, minG);
      rows.push({
        label: `${site.rates.rightColumn[0].label} × ${head} @ $${site.rates.rightColumn[0].price}`,
        amount: head * parseUsd(site.rates.rightColumn[0].price),
        note:
          playersNum < minG
            ? `Group rate assumes at least ${minG} guests for this estimate.`
            : undefined,
      });
    }
    return rows;
  }, [playersNum, selected.first, selected.replay, selected.group]);

  const subtotal = useMemo(() => {
    const n = lineItems.reduce((s, r) => s + r.amount, 0);
    return n > 0 ? n.toFixed(2) : null;
  }, [lineItems]);

  const hasPricedSelection = selected.first || selected.replay || selected.group;

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
      setSelected({ first: false, replay: false, group: false });
      setFieldError(null);
      setCheckoutPending(false);
    }
  }, [open]);

  function toggleOffering(id: PricedOfferingId) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
    setFieldError(null);
  }

  async function handlePay() {
    setFieldError(null);
    if (!hasPricedSelection) {
      setFieldError("Select at least one ticket type (you can choose several).");
      return;
    }
    if (!visitDate) {
      setFieldError("Choose a visit date.");
      return;
    }
    if (!players) {
      setFieldError("Select how many players.");
      return;
    }

    setCheckoutPending(true);
    try {
      const res = await fetch("/api/stripe/checkout-tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitDate,
          players: playersNum,
          first: selected.first,
          replay: selected.replay,
          group: selected.group,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setFieldError(data.error ?? "Checkout could not start. Try again or call us.");
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      setFieldError("Checkout did not return a link. Try again.");
    } catch {
      setFieldError("Network error. Check your connection and try again.");
    } finally {
      setCheckoutPending(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-surface-muted px-4 py-3.5 text-sm text-ink outline-none transition focus:border-teal-500/50 focus:ring-2 focus:ring-teal-400/25";

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity motion-safe:duration-200"
        aria-label="Close tickets"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-[1.85rem] border border-white/15 bg-gradient-to-b from-surface-elevated via-surface to-slate-950 shadow-[0_-24px_80px_rgba(0,0,0,0.55)] motion-safe:duration-200 sm:max-h-[min(92vh,760px)] sm:max-w-2xl sm:rounded-3xl sm:shadow-[0_32px_100px_rgba(0,0,0,0.5)] lg:max-w-3xl"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-teal-400 via-amber-400 to-orange-400"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-1 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" aria-hidden />

        <div className="relative flex shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-surface-muted/80 px-5 pb-5 pt-7 backdrop-blur-sm sm:px-8 sm:pb-6 sm:pt-8">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="h-8 w-1 rounded-full bg-gradient-to-b from-teal-500 to-emerald-600 shadow-sm" aria-hidden />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400/90">Hawaiian Rumble</p>
            </div>
            <h2 id={titleId} className="mt-2 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Buy tickets
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              Stack <span className="font-semibold text-slate-200">ticket types</span>, then set your{" "}
              <span className="font-semibold text-slate-200">date</span> and{" "}
              <span className="font-semibold text-slate-200">guests</span>. Pay securely on{" "}
              <span className="font-semibold text-slate-200">Stripe Checkout</span> (cards, Apple Pay, Google Pay).
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="touch-manipulation inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-slate-300 shadow-sm transition hover:border-amber-400/40 hover:bg-white/15 hover:text-white hover:shadow-md"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-7">
          <div className="relative overflow-hidden rounded-2xl border border-teal-500/25 bg-gradient-to-br from-teal-950/50 via-surface-muted to-sky-950/40 px-4 py-4 shadow-sm sm:px-5 sm:py-4">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-teal-400/15 blur-2xl"
              aria-hidden
            />
            <p className="relative text-sm font-bold text-teal-200">Stripe · cards, Apple Pay &amp; Google Pay</p>
            <p className="relative mt-1.5 text-sm leading-relaxed text-teal-100/80">
              Each option below becomes a line item. Your guests get the same polished checkout experience they expect
              from modern booking sites.
            </p>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Step 1</p>
                <p className="text-base font-bold text-ink">What are you booking?</p>
              </div>
            </div>
            <p className="mt-2 pl-4 text-sm text-muted sm:pl-5">
              Tap cards to add or remove — combine first round, replay, and group in one basket.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((o) => {
                const on = selected[o.id];
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleOffering(o.id)}
                    aria-pressed={on}
                    className={`touch-manipulation group relative flex min-h-[158px] flex-col rounded-2xl border-2 p-4 text-left transition motion-safe:duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.99] ${
                      on ? CARD_ON[o.id] : CARD_IDLE[o.id]
                    }`}
                  >
                    <span
                      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
                        on
                          ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
                          : "border-2 border-dashed border-slate-600/80 bg-white/5 text-transparent group-hover:border-teal-400/50"
                      }`}
                      aria-hidden
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span
                      className={`inline-flex w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] ${CATEGORY_TONE[o.id]}`}
                    >
                      {categoryLabel(o.id)}
                    </span>
                    <span className="mt-3 pr-10 text-base font-bold leading-snug text-ink">{o.title}</span>
                    <span className="mt-1 text-xs font-medium text-slate-600">{o.tagline}</span>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600">{o.detail}</p>
                    <p className="mt-3 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-lg font-extrabold tracking-tight text-transparent">
                      {o.priceLine}
                    </p>
                    {o.minGuests ? (
                      <p className="mt-1 text-[11px] font-medium text-slate-500">Min. {o.minGuests} guests for posted rate</p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-gradient-to-b from-sky-500 to-teal-600" aria-hidden />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Step 2</p>
                <p className="text-base font-bold text-ink">When &amp; how many?</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-surface-muted/60 p-4 shadow-inner sm:grid-cols-2 sm:p-5">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Visit date</span>
                <input
                  type="date"
                  min={minDate}
                  value={visitDate}
                  onChange={(e) => {
                    setVisitDate(e.target.value);
                    setFieldError(null);
                  }}
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted">Guests</span>
                <select
                  value={players}
                  onChange={(e) => {
                    setPlayers(e.target.value);
                    setFieldError(null);
                  }}
                  className={inputClass}
                >
                  <option value="">How many guests?</option>
                  {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={String(n)}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-violet-500/25 bg-gradient-to-br from-violet-950/40 via-surface-muted to-fuchsia-950/30 p-4 shadow-sm sm:p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-violet-300/90">Buyouts &amp; custom events</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Need a tailored package or invoice?{" "}
              <Link
                href="/#contact"
                className="font-semibold text-violet-300 underline decoration-violet-400/40 underline-offset-2 transition hover:text-violet-200"
                onClick={onClose}
              >
                Contact us
              </Link>{" "}
              — we&apos;ll align billing in Stripe or on contract.
            </p>
          </div>

          {fieldError ? (
            <p
              className="mt-5 rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-3 text-sm font-medium text-rose-200"
              role="status"
            >
              {fieldError}
            </p>
          ) : null}

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-surface-muted shadow-[0_8px_40px_rgba(0,0,0,0.25)]">
            <div className="border-b border-white/10 bg-gradient-to-r from-slate-900/80 to-teal-950/40 px-4 py-3.5 sm:px-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Order summary</p>
            </div>
            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <ul className="space-y-2.5 text-sm text-muted">
                <li className="flex flex-wrap gap-x-2">
                  <span className="font-semibold text-ink">Visit</span>
                  <span className="text-slate-400">{visitDate ? formatVisitDate(visitDate) : "—"}</span>
                </li>
                <li className="flex flex-wrap gap-x-2">
                  <span className="font-semibold text-ink">Guests</span>
                  <span className="text-slate-400">
                    {players ? `${players} ${players === "1" ? "guest" : "guests"}` : "—"}
                  </span>
                </li>
                <li className="flex flex-wrap gap-x-2">
                  <span className="font-semibold text-ink">Includes</span>
                  <span className="text-slate-400">
                    {!hasPricedSelection
                      ? "—"
                      : [
                          selected.first ? site.rates.leftColumn[0].label : null,
                          selected.replay ? site.rates.leftColumn[1].label : null,
                          selected.group ? site.rates.rightColumn[0].label : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                  </span>
                </li>
              </ul>

              {lineItems.length > 0 ? (
                <ul className="mt-5 space-y-3 border-t border-dashed border-white/10 pt-5">
                  {lineItems.map((row) => (
                    <li key={row.label} className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium leading-snug text-ink">{row.label}</p>
                        {row.note ? <p className="mt-1 text-xs text-amber-300/90">{row.note}</p> : null}
                      </div>
                      <p className="shrink-0 text-base font-bold tabular-nums text-ink sm:text-right">${row.amount.toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-5 border-t border-dashed border-white/10 pt-5 text-sm text-muted">
                  Select ticket types and guest count for a line-by-line estimate.
                </p>
              )}

              <div className="mt-6 rounded-xl bg-gradient-to-r from-teal-950/50 to-emerald-950/40 px-4 py-3.5 ring-1 ring-teal-500/25">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-300/90">Estimated combined</p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-ink">
                  {subtotal ? (
                    <span className="bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                      About ${subtotal}
                    </span>
                  ) : (
                    <span className="text-slate-500">Add selections above</span>
                  )}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  Ballpark only — window specials and IDs finalize in Stripe. Replay needs a paid first round the same
                  day.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-6">
            <button
              type="button"
              onClick={() => void handlePay()}
              disabled={checkoutPending}
              className="group/pay touch-manipulation relative inline-flex min-h-[3.25rem] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-6 text-sm font-bold text-slate-950 shadow-[0_10px_36px_rgba(249,115,22,0.38)] ring-2 ring-white/30 transition hover:brightness-[1.03] motion-safe:active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
            >
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/45 to-transparent opacity-0 transition duration-500 group-hover/pay:translate-x-full group-hover/pay:opacity-100"
                aria-hidden
              />
              <span className="relative">
                {checkoutPending ? "Opening Stripe Checkout…" : "Pay with card"}
              </span>
            </button>
            {checkoutPending ? (
              <p className="text-center text-xs text-muted" role="status">
                Secure payment on Stripe — you&apos;ll return here if you cancel.
              </p>
            ) : null}
            <p className="text-center text-xs leading-relaxed text-muted">
              Apple Pay and Google Pay run through Stripe on supported phones and browsers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
