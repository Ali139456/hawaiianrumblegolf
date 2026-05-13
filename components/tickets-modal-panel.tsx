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
  /** Per-person amount in USD for estimates */
  unitUsd: number;
  /** For group rate: minimum head count for the posted price */
  minGuests?: number;
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
  const [checkoutHint, setCheckoutHint] = useState(false);

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
      setCheckoutHint(false);
    }
  }, [open]);

  function toggleOffering(id: PricedOfferingId) {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
    setFieldError(null);
    setCheckoutHint(false);
  }

  function handlePay() {
    setFieldError(null);
    setCheckoutHint(false);
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
        className="relative flex max-h-[92dvh] w-full max-w-xl flex-col rounded-t-[1.75rem] border border-slate-200/90 bg-surface-elevated shadow-[0_-20px_60px_rgba(0,0,0,0.2)] sm:max-h-[min(92vh,720px)] sm:max-w-2xl sm:rounded-3xl sm:shadow-2xl lg:max-w-3xl"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/80 px-5 pb-4 pt-5 sm:px-7 sm:pb-5 sm:pt-6">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-teal-800/90">Hawaiian Rumble</p>
            <h2 id={titleId} className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Buy tickets
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Pick <span className="font-semibold text-slate-800">everything</span> you need—ticket types stack
              together (first round + same-day replay + group blocks). Then set your date and party size. Checkout
              runs on <span className="font-semibold text-slate-800">Stripe</span>.
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
            <p className="font-semibold">Stripe · cards, Apple Pay &amp; Google Pay</p>
            <p className="mt-1 text-sm leading-relaxed text-teal-950/90">
              Your selections below map to line items in checkout. Connect Stripe when you&apos;re ready—the flow
              here mirrors how multi-option booking widgets work elsewhere.
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">What are you booking?</p>
            <p className="mt-1 text-sm text-muted">Tap to include or remove an option. You can select more than one.</p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {offerings.map((o) => {
                const on = selected[o.id];
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => toggleOffering(o.id)}
                    aria-pressed={on}
                    className={`relative flex min-h-[148px] flex-col rounded-2xl border-2 p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 ${
                      on
                        ? "border-teal-500 bg-gradient-to-br from-teal-50 to-emerald-50/90 shadow-md ring-1 ring-teal-400/30"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                        on ? "bg-teal-600 text-white" : "border border-slate-200 bg-slate-50 text-slate-400"
                      }`}
                      aria-hidden
                    >
                      {on ? "✓" : ""}
                    </span>
                    <span className="pr-10 text-[10px] font-bold uppercase tracking-[0.2em] text-teal-800/85">
                      {o.id === "first" ? "Single" : o.id === "replay" ? "Replay" : "Group"}
                    </span>
                    <span className="mt-2 text-base font-bold leading-snug text-ink">{o.title}</span>
                    <span className="mt-1 text-xs font-medium text-muted">{o.tagline}</span>
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600">{o.detail}</p>
                    <p className="mt-3 text-sm font-bold text-amber-700">{o.priceLine}</p>
                    {o.minGuests ? (
                      <p className="mt-1 text-[11px] text-muted">Min. {o.minGuests} guests for posted rate</p>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
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
                <option value="">How many guests?</option>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={String(n)}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/90 bg-slate-50/80 px-4 py-3 sm:px-5">
            <p className="text-xs font-semibold text-slate-700">Large parties &amp; buyouts</p>
            <p className="mt-1 text-sm text-muted">
              Need a custom package or invoice?{" "}
              <Link href="/#contact" className="font-semibold text-teal-800 underline-offset-2 hover:underline" onClick={onClose}>
                Contact us
              </Link>{" "}
              — we&apos;ll fold that into Stripe or a contract, same as a &quot;View&quot; path on other booking
              sites.
            </p>
          </div>

          {fieldError ? (
            <p className="mt-4 text-sm font-medium text-rose-700" role="status">
              {fieldError}
            </p>
          ) : null}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Order summary</p>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              <li>
                <span className="font-medium text-ink">Visit: </span>
                {visitDate ? formatVisitDate(visitDate) : "—"}
              </li>
              <li>
                <span className="font-medium text-ink">Guests: </span>
                {players ? `${players} ${players === "1" ? "guest" : "guests"}` : "—"}
              </li>
              <li>
                <span className="font-medium text-ink">Includes: </span>
                {!hasPricedSelection
                  ? "—"
                  : [
                      selected.first ? site.rates.leftColumn[0].label : null,
                      selected.replay ? site.rates.leftColumn[1].label : null,
                      selected.group ? site.rates.rightColumn[0].label : null,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
              </li>
            </ul>
            {lineItems.length > 0 ? (
              <ul className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
                {lineItems.map((row) => (
                  <li key={row.label} className="flex flex-col gap-0.5 text-muted">
                    <span className="text-ink">{row.label}</span>
                    {row.note ? <span className="text-xs text-amber-800/90">{row.note}</span> : null}
                    <span className="font-semibold text-ink">${row.amount.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-muted">
                Select ticket types and guest count to see line-by-line estimates.
              </p>
            )}
            <p className="mt-4 text-lg font-bold text-ink">
              {subtotal ? `About $${subtotal} combined` : "Estimated total at checkout"}
            </p>
            <p className="mt-1 text-xs text-muted">
              Ballpark only—window discounts, IDs, and promos finalize in Stripe. Replay requires a paid first round the
              same day.
            </p>
          </div>

          {checkoutHint ? (
            <div
              className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/90 px-4 py-3.5 text-sm text-emerald-950 sm:px-5"
              role="status"
            >
              <p className="font-semibold">Selection saved for checkout</p>
              <p className="mt-1 leading-relaxed text-emerald-950/90">
                {formatVisitDate(visitDate)} · {players} guests ·{" "}
                {[selected.first && "1st", selected.replay && "replay", selected.group && "group"].filter(Boolean).join(" + ")}.
                When Stripe Checkout is live, this bundle maps to your session. Questions?{" "}
                <a href={`tel:${site.phoneTel}`} className="font-semibold text-emerald-900 underline-offset-2 hover:underline">
                  {site.phone}
                </a>
                .
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
              Apple Pay and Google Pay work through Stripe on supported phones and browsers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
