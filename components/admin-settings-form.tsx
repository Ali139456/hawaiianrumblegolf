"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteConfig } from "@/lib/site";

type Props = { initialSite: SiteConfig };

type DealCardForm = {
  title: string;
  badge: string;
  body: string;
  price: string;
  compareAt: string;
  hint: string;
};

const EMPTY_DEAL_CARD: DealCardForm = {
  title: "",
  badge: "",
  body: "",
  price: "",
  compareAt: "",
  hint: "",
};

/** Upper bound so the JSON payload stays reasonable; raise if needed. */
const MAX_DEAL_CARDS = 24;

function cloneSite(s: SiteConfig): SiteConfig {
  return structuredClone(s);
}

function dealCardsFromBase(base: SiteConfig): DealCardForm[] {
  const raw: DealCardForm[] = base.dealsPage.cards.map((c) => ({
    title: c.title,
    badge: c.badge,
    body: c.body,
    price: c.price,
    compareAt: c.compareAt,
    hint: c.hint,
  }));
  if (raw.length === 0) {
    raw.push({ ...EMPTY_DEAL_CARD });
  }
  return raw;
}

export function AdminSettingsForm({ initialSite }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ ok?: boolean; text: string } | null>(null);

  const base = useMemo(() => cloneSite(initialSite), [initialSite]);

  const [tagline, setTagline] = useState<string>(base.tagline);
  const [description, setDescription] = useState<string>(base.description);
  const [name, setName] = useState<string>(base.name);
  const [shortName, setShortName] = useState<string>(base.shortName);
  const [phone, setPhone] = useState<string>(base.phone);
  const [phoneTel, setPhoneTel] = useState<string>(base.phoneTel);
  const [addressLine, setAddressLine] = useState<string>(base.addressLine);
  const [cityStateZip, setCityStateZip] = useState<string>(base.cityStateZip);
  const [mapsUrl, setMapsUrl] = useState<string>(base.mapsUrl);
  const [googleMapsReviewsUrl, setGoogleMapsReviewsUrl] = useState<string>(base.googleMapsReviewsUrl);
  const [facebookUrl, setFacebookUrl] = useState<string>(base.facebookUrl);
  const [yelpUrl, setYelpUrl] = useState<string>(base.yelpUrl);
  const [tripAdvisorUrl, setTripAdvisorUrl] = useState<string>(base.tripAdvisorUrl);
  const [googlePlaceId, setGooglePlaceId] = useState<string>(base.googlePlaceId);
  const [hoursWeek, setHoursWeek] = useState<string>(base.hours.week);
  const [hoursWeekend, setHoursWeekend] = useState<string>(base.hours.weekend);
  const [tickerText, setTickerText] = useState<string>([...base.tickerLines].join("\n"));

  const [ratesTitle, setRatesTitle] = useState<string>(base.rates.title);
  const [ratesLeftTitle, setRatesLeftTitle] = useState<string>(base.rates.leftColumnTitle);
  const [ratesRightTitle, setRatesRightTitle] = useState<string>(base.rates.rightColumnTitle);
  const [r0label, setR0label] = useState<string>(base.rates.leftColumn[0].label);
  const [r0detail, setR0detail] = useState<string>(base.rates.leftColumn[0].detail);
  const [r0price, setR0price] = useState<string>(base.rates.leftColumn[0].price);
  const [r1label, setR1label] = useState<string>(base.rates.leftColumn[1].label);
  const [r1detail, setR1detail] = useState<string>(base.rates.leftColumn[1].detail);
  const [r1price, setR1price] = useState<string>(base.rates.leftColumn[1].price);
  const [r1compare, setR1compare] = useState<string>(base.rates.leftColumn[1].compareAtPrice ?? "");
  const [gLabel, setGLabel] = useState<string>(base.rates.rightColumn[0].label);
  const [gDetail, setGDetail] = useState<string>(base.rates.rightColumn[0].detail);
  const [gPrice, setGPrice] = useState<string>(base.rates.rightColumn[0].price);
  const [footnotesText, setFootnotesText] = useState<string>([...base.rates.footnotes].join("\n"));

  const [dealsTitle, setDealsTitle] = useState<string>(base.dealsPage.title);
  const [dealsSubtitle, setDealsSubtitle] = useState<string>(base.dealsPage.subtitle);
  const [dealsFootnote, setDealsFootnote] = useState<string>(base.dealsPage.footnote);
  const [dealCards, setDealCards] = useState<DealCardForm[]>(() => dealCardsFromBase(base));

  function setDealCard(index: number, patch: Partial<DealCardForm>) {
    setDealCards((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  }

  function addDealCard() {
    setDealCards((prev) => (prev.length >= MAX_DEAL_CARDS ? prev : [...prev, { ...EMPTY_DEAL_CARD }]));
  }

  function removeDealCard(index: number) {
    setDealCards((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function buildPatch(): Record<string, unknown> {
    const rates = JSON.parse(JSON.stringify(base.rates)) as Record<string, unknown>;
    rates.title = ratesTitle;
    rates.leftColumnTitle = ratesLeftTitle;
    rates.rightColumnTitle = ratesRightTitle;
    rates.leftColumn = [
      { ...(rates.leftColumn as SiteConfig["rates"]["leftColumn"])[0], label: r0label, detail: r0detail, price: r0price },
      {
        ...(rates.leftColumn as SiteConfig["rates"]["leftColumn"])[1],
        label: r1label,
        detail: r1detail,
        price: r1price,
        ...(r1compare.trim() ? { compareAtPrice: r1compare.trim() } : {}),
      },
    ];
    rates.rightColumn = [
      { ...(rates.rightColumn as SiteConfig["rates"]["rightColumn"])[0], label: gLabel, detail: gDetail, price: gPrice },
    ];
    rates.footnotes = footnotesText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const tickerLines = tickerText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const cardsRaw = dealCards.map((c) => ({
      title: c.title.trim(),
      badge: c.badge.trim(),
      body: c.body.trim(),
      price: c.price.trim(),
      compareAt: c.compareAt.trim(),
      hint: c.hint.trim(),
    }));
    const cards = cardsRaw.filter(
      (c) => c.title || c.badge || c.body || c.price || c.compareAt || c.hint,
    );

    const dealsPage = {
      title: dealsTitle.trim(),
      subtitle: dealsSubtitle.trim(),
      footnote: dealsFootnote.trim(),
      cards,
    };

    return {
      tagline,
      description,
      name,
      shortName,
      phone,
      phoneTel,
      addressLine,
      cityStateZip,
      mapsUrl,
      googleMapsReviewsUrl,
      facebookUrl,
      yelpUrl,
      tripAdvisorUrl,
      googlePlaceId: googlePlaceId.trim(),
      hours: { week: hoursWeek, weekend: hoursWeekend },
      tickerLines,
      rates,
      dealsPage,
    };
  }

  function save() {
    setNotice(null);
    startTransition(async () => {
      try {
        const patch = buildPatch();
        const res = await fetch("/api/admin/settings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(patch),
        });
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) {
          setNotice({ ok: false, text: body.error ?? `Save failed (${res.status})` });
          return;
        }
        setNotice({ ok: true, text: "Saved. The live site will pick this up on the next refresh (cache ~1 min)." });
        router.refresh();
      } catch (e) {
        setNotice({ ok: false, text: e instanceof Error ? e.message : "Save failed" });
      }
    });
  }

  const label = "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/75";
  const input =
    "touch-manipulation min-h-[44px] w-full max-w-full rounded-xl border border-white/12 bg-slate-950/60 px-3.5 py-2.5 text-base leading-snug text-slate-100 placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] outline-none transition focus:border-amber-400/40 focus:ring-2 focus:ring-amber-400/15 sm:min-h-0 sm:text-sm";
  const ta = (min: string) => `${input} resize-y leading-relaxed ${min}`;
  const section =
    "rounded-2xl border border-white/[0.08] bg-gradient-to-br from-slate-900/80 to-slate-950/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-sm sm:p-6 sm:backdrop-blur-md";
  const sectionTitle = "text-base font-bold tracking-tight text-white sm:text-lg";
  const sectionHint = "mt-1 text-sm leading-relaxed text-slate-400";
  const dealShellStyles = [
    "border-emerald-500/25 bg-emerald-950/25",
    "border-amber-500/25 bg-amber-950/20",
    "border-sky-500/20 bg-sky-950/20",
    "border-fuchsia-500/20 bg-fuchsia-950/20",
  ] as const;
  const dealShell = (i: number) =>
    `rounded-xl border p-4 sm:p-5 ${dealShellStyles[i % dealShellStyles.length]}`;
  const actionBtn =
    "touch-manipulation inline-flex min-h-[44px] w-full flex-1 items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-100 transition active:bg-white/15 sm:min-h-0 sm:w-auto sm:flex-none sm:active:bg-white/10";

  return (
    <div className="space-y-5 sm:space-y-8">
      <div className="flex flex-col gap-4">
        <div className="min-w-0">
          <p className="break-words text-sm leading-relaxed text-slate-400">
            Changes merge with defaults in{" "}
            <code className="inline-block max-w-full break-all rounded-md bg-white/5 px-1.5 py-0.5 text-xs text-amber-200/90">
              lib/site.ts
            </code>{" "}
            and are stored in Supabase.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:gap-2">
          <Link href="/deals" className={`${actionBtn} hover:border-amber-400/35 hover:bg-white/10`}>
            Preview deals
          </Link>
          <Link href="/" className={`${actionBtn} hover:border-teal-400/35 hover:bg-white/10`}>
            View site
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="touch-manipulation inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-rose-500/30 bg-rose-950/40 px-4 py-2.5 text-sm font-semibold text-rose-100 transition hover:bg-rose-950/60 active:bg-rose-950/80 sm:min-h-0 sm:w-auto"
          >
            Sign out
          </button>
        </div>
      </div>

      {notice ? (
        <div
          className={`break-words rounded-xl border px-4 py-3.5 text-sm font-medium ${
            notice.ok
              ? "border-emerald-400/30 bg-emerald-950/50 text-emerald-100"
              : "border-rose-400/35 bg-rose-950/45 text-rose-100"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      <section className={section}>
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <span className="mt-0.5 h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2 className={sectionTitle}>General</h2>
            <p className={sectionHint}>Business name, tagline, and contact basics.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={label}>Business name</span>
            <input className={input} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Short name</span>
            <input className={input} value={shortName} onChange={(e) => setShortName(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Tagline (hero)</span>
            <input className={input} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Description (SEO)</span>
            <textarea className={ta("min-h-[88px]")} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Phone (display)</span>
            <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Phone (tel link)</span>
            <input className={input} value={phoneTel} onChange={(e) => setPhoneTel(e.target.value)} placeholder="+1407..." />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Street address</span>
            <input className={input} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>City, state, ZIP</span>
            <input className={input} value={cityStateZip} onChange={(e) => setCityStateZip(e.target.value)} />
          </label>
        </div>
      </section>

      <section className={section}>
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <span className="mt-0.5 h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-teal-400 to-emerald-500" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2 className={sectionTitle}>Hours &amp; ticker</h2>
            <p className={sectionHint}>Hours show in the info strip; ticker lines scroll in the header.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="block">
            <span className={label}>Week hours (one line)</span>
            <input className={input} value={hoursWeek} onChange={(e) => setHoursWeek(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Weekend hours (one line)</span>
            <input className={input} value={hoursWeekend} onChange={(e) => setHoursWeekend(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Ticker lines</span>
            <span className="mb-1.5 block text-xs text-slate-500">One message per line. Shorter lines read best on phones.</span>
            <textarea className={ta("min-h-[160px]")} value={tickerText} onChange={(e) => setTickerText(e.target.value)} />
          </label>
        </div>
      </section>

      <section className={section}>
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <span className="mt-0.5 h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-sky-400 to-indigo-500" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2 className={sectionTitle}>Links</h2>
            <p className={sectionHint}>Maps, reviews, and social profiles.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <label className="block sm:col-span-2">
            <span className={label}>Google Maps (place)</span>
            <input className={input} value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Google Maps (reviews)</span>
            <input className={input} value={googleMapsReviewsUrl} onChange={(e) => setGoogleMapsReviewsUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Google Place ID (optional)</span>
            <input className={input} value={googlePlaceId} onChange={(e) => setGooglePlaceId(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Facebook</span>
            <input className={input} value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>Yelp</span>
            <input className={input} value={yelpUrl} onChange={(e) => setYelpUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className={label}>TripAdvisor</span>
            <input className={input} value={tripAdvisorUrl} onChange={(e) => setTripAdvisorUrl(e.target.value)} />
          </label>
        </div>
      </section>

      <section className={section}>
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <span className="mt-0.5 h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-amber-400 to-rose-500" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2 className={sectionTitle}>Rates</h2>
            <p className={sectionHint}>Homepage rates section — single, replay, and group rows.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className={label}>Section title</span>
            <input className={input} value={ratesTitle} onChange={(e) => setRatesTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Left column title</span>
            <input className={input} value={ratesLeftTitle} onChange={(e) => setRatesLeftTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Right column title</span>
            <input className={input} value={ratesRightTitle} onChange={(e) => setRatesRightTitle(e.target.value)} />
          </label>
          <div className="sm:col-span-2 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-200/90">1st game</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className={label}>Label</span>
                <input className={input} value={r0label} onChange={(e) => setR0label(e.target.value)} />
              </label>
              <label className="block">
                <span className={label}>Price</span>
                <input className={input} value={r0price} onChange={(e) => setR0price(e.target.value)} />
              </label>
              <label className="block sm:col-span-3">
                <span className={label}>Detail</span>
                <input className={input} value={r0detail} onChange={(e) => setR0detail(e.target.value)} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-amber-400/20 bg-amber-950/15 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-amber-200/90">2nd game (replay)</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className={label}>Label</span>
                <input className={input} value={r1label} onChange={(e) => setR1label(e.target.value)} />
              </label>
              <label className="block">
                <span className={label}>Sale price</span>
                <input className={input} value={r1price} onChange={(e) => setR1price(e.target.value)} />
              </label>
              <label className="block">
                <span className={label}>Compare at (was)</span>
                <input className={input} value={r1compare} onChange={(e) => setR1compare(e.target.value)} />
              </label>
              <label className="block sm:col-span-3">
                <span className={label}>Detail</span>
                <input className={input} value={r1detail} onChange={(e) => setR1detail(e.target.value)} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Group rate</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className={label}>Label</span>
                <input className={input} value={gLabel} onChange={(e) => setGLabel(e.target.value)} />
              </label>
              <label className="block">
                <span className={label}>Price</span>
                <input className={input} value={gPrice} onChange={(e) => setGPrice(e.target.value)} />
              </label>
              <label className="block sm:col-span-3">
                <span className={label}>Detail</span>
                <input className={input} value={gDetail} onChange={(e) => setGDetail(e.target.value)} />
              </label>
            </div>
          </div>
          <label className="block sm:col-span-2">
            <span className={label}>Rate footnotes</span>
            <span className="mb-1.5 block text-xs text-slate-500">One line per footnote.</span>
            <textarea className={ta("min-h-[100px]")} value={footnotesText} onChange={(e) => setFootnotesText(e.target.value)} />
          </label>
        </div>
      </section>

      <section className={section}>
        <div className="flex min-w-0 items-start gap-3 sm:items-center">
          <span className="mt-0.5 h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-orange-400 to-pink-500" aria-hidden />
          <div className="min-w-0 flex-1">
            <h2 className={sectionTitle}>Deals page</h2>
            <p className={sectionHint}>
              Plain text for <span className="text-slate-200">/deals</span> — title, intro, footnote, and as many offer cards as you need (discounts, group deals, window rates, etc.).
            </p>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <label className="block">
            <span className={label}>Page title</span>
            <input className={input} value={dealsTitle} onChange={(e) => setDealsTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Subtitle</span>
            <textarea className={ta("min-h-[88px]")} value={dealsSubtitle} onChange={(e) => setDealsSubtitle(e.target.value)} />
          </label>
          <label className="block">
            <span className={label}>Footnote</span>
            <textarea className={ta("min-h-[72px]")} value={dealsFootnote} onChange={(e) => setDealsFootnote(e.target.value)} />
          </label>
        </div>

        <div className="mt-8 space-y-6">
          {dealCards.map((card, i) => (
            <div key={i} className={dealShell(i)}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Offer {i + 1}</p>
                {dealCards.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => removeDealCard(i)}
                    className="min-h-[40px] shrink-0 rounded-lg border border-white/12 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-rose-400/35 hover:bg-rose-950/40 hover:text-rose-100 active:bg-rose-950/60 sm:min-h-0 sm:py-1.5"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className={label}>Card title</span>
                  <input className={input} value={card.title} onChange={(e) => setDealCard(i, { title: e.target.value })} />
                </label>
                <label className="block">
                  <span className={label}>Badge</span>
                  <input className={input} value={card.badge} onChange={(e) => setDealCard(i, { badge: e.target.value })} />
                </label>
                <label className="block sm:col-span-2">
                  <span className={label}>Body copy</span>
                  <textarea
                    className={ta("min-h-[88px]")}
                    value={card.body}
                    onChange={(e) => setDealCard(i, { body: e.target.value })}
                  />
                </label>
                <label className="block">
                  <span className={label}>Price</span>
                  <input className={input} value={card.price} onChange={(e) => setDealCard(i, { price: e.target.value })} placeholder="$9.95" />
                </label>
                <label className="block">
                  <span className={label}>Compare at (optional)</span>
                  <input
                    className={input}
                    value={card.compareAt}
                    onChange={(e) => setDealCard(i, { compareAt: e.target.value })}
                    placeholder="$15.95"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={label}>Hint (small line under price)</span>
                  <input className={input} value={card.hint} onChange={(e) => setDealCard(i, { hint: e.target.value })} />
                </label>
              </div>
            </div>
          ))}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              type="button"
              onClick={() => addDealCard()}
              disabled={dealCards.length >= MAX_DEAL_CARDS}
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-dashed border-amber-400/35 bg-amber-500/5 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:border-amber-400/55 hover:bg-amber-500/10 disabled:cursor-not-allowed disabled:opacity-40 sm:min-h-0 sm:w-auto"
            >
              <span className="text-lg font-bold leading-none text-amber-300" aria-hidden>
                +
              </span>
              Add offer / special
            </button>
            {dealCards.length >= MAX_DEAL_CARDS ? (
              <span className="text-xs text-slate-500">Maximum {MAX_DEAL_CARDS} offers.</span>
            ) : null}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-slate-950/92 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg supports-[backdrop-filter]:bg-slate-950/88 sm:relative sm:inset-x-auto sm:bottom-auto sm:z-0 sm:mt-8 sm:border-0 sm:bg-transparent sm:p-0 sm:pb-0 sm:backdrop-blur-none">
        <div className="mx-auto flex max-w-4xl justify-stretch sm:justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={() => save()}
            className="touch-manipulation min-h-[48px] w-full rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-6 py-3.5 text-base font-bold text-slate-950 shadow-[0_12px_40px_rgba(249,115,22,0.35)] ring-2 ring-white/20 transition enabled:hover:brightness-110 enabled:active:scale-[0.98] disabled:opacity-45 sm:w-auto sm:min-h-0 sm:px-10 sm:text-sm"
          >
            {pending ? "Saving…" : "Save all changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
