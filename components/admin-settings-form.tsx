"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { createClient } from "@/lib/supabase/client";
import type { SiteConfig } from "@/lib/site";

type Props = { initialSite: SiteConfig };

function cloneSite(s: SiteConfig): SiteConfig {
  return JSON.parse(JSON.stringify(s)) as SiteConfig;
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

  const [dealsJson, setDealsJson] = useState<string>(JSON.stringify(base.dealsPage, null, 2));

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  function buildPatch(): Record<string, unknown> {
    let dealsPage: unknown;
    try {
      dealsPage = JSON.parse(dealsJson) as unknown;
    } catch {
      throw new Error("Deals & specials JSON is invalid. Fix JSON before saving.");
    }
    if (!dealsPage || typeof dealsPage !== "object" || Array.isArray(dealsPage)) {
      throw new Error("Deals & specials must be a JSON object.");
    }

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
        setNotice({ ok: true, text: "Saved. Public pages refresh within a minute (or redeploy)." });
        router.refresh();
      } catch (e) {
        setNotice({ ok: false, text: e instanceof Error ? e.message : "Save failed" });
      }
    });
  }

  const field =
    "mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/20";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">
          Edits merge with defaults in <code className="rounded bg-slate-100 px-1 text-xs">lib/site.ts</code> and are stored in Supabase.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
          >
            View site
          </Link>
          <button
            type="button"
            onClick={() => void logout()}
            className="rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Sign out
          </button>
        </div>
      </div>

      {notice ? (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            notice.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {notice.text}
        </div>
      ) : null}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">General</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Business name</span>
            <input className={field} value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Short name</span>
            <input className={field} value={shortName} onChange={(e) => setShortName(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tagline (hero)</span>
            <input className={field} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description (SEO / meta)</span>
            <textarea className={`${field} min-h-[88px]`} value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone (display)</span>
            <input className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone (tel link, E.164)</span>
            <input className={field} value={phoneTel} onChange={(e) => setPhoneTel(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Street address</span>
            <input className={field} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">City, state, ZIP</span>
            <input className={field} value={cityStateZip} onChange={(e) => setCityStateZip(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Hours & ticker</h2>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Week hours line</span>
            <input className={field} value={hoursWeek} onChange={(e) => setHoursWeek(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Weekend hours line</span>
            <input className={field} value={hoursWeekend} onChange={(e) => setHoursWeekend(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ticker lines (one per line)</span>
            <textarea className={`${field} min-h-[160px] font-mono text-[13px]`} value={tickerText} onChange={(e) => setTickerText(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Links</h2>
        <div className="mt-4 grid gap-4">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Google Maps (place)</span>
            <input className={field} value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Google Maps (reviews tab)</span>
            <input className={field} value={googleMapsReviewsUrl} onChange={(e) => setGoogleMapsReviewsUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Google Place ID (optional; env wins)</span>
            <input className={field} value={googlePlaceId} onChange={(e) => setGooglePlaceId(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Facebook URL</span>
            <input className={field} value={facebookUrl} onChange={(e) => setFacebookUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Yelp URL</span>
            <input className={field} value={yelpUrl} onChange={(e) => setYelpUrl(e.target.value)} />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">TripAdvisor URL</span>
            <input className={field} value={tripAdvisorUrl} onChange={(e) => setTripAdvisorUrl(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Rates (sales)</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Section title</span>
            <input className={field} value={ratesTitle} onChange={(e) => setRatesTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Left column title</span>
            <input className={field} value={ratesLeftTitle} onChange={(e) => setRatesLeftTitle(e.target.value)} />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Right column title</span>
            <input className={field} value={ratesRightTitle} onChange={(e) => setRatesRightTitle(e.target.value)} />
          </label>
          <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">1st game</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="text-[11px] text-slate-500">Label</span>
                <input className={field} value={r0label} onChange={(e) => setR0label(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[11px] text-slate-500">Price (digits)</span>
                <input className={field} value={r0price} onChange={(e) => setR0price(e.target.value)} />
              </label>
              <label className="block sm:col-span-3">
                <span className="text-[11px] text-slate-500">Detail</span>
                <input className={field} value={r0detail} onChange={(e) => setR0detail(e.target.value)} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-amber-100 bg-amber-50/40 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-amber-900/80">2nd game (replay)</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="text-[11px] text-slate-500">Label</span>
                <input className={field} value={r1label} onChange={(e) => setR1label(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[11px] text-slate-500">Sale price</span>
                <input className={field} value={r1price} onChange={(e) => setR1price(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[11px] text-slate-500">Compare-at (was)</span>
                <input className={field} value={r1compare} onChange={(e) => setR1compare(e.target.value)} />
              </label>
              <label className="block sm:col-span-3">
                <span className="text-[11px] text-slate-500">Detail</span>
                <input className={field} value={r1detail} onChange={(e) => setR1detail(e.target.value)} />
              </label>
            </div>
          </div>
          <div className="sm:col-span-2 rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Group rate</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-3">
              <label className="block">
                <span className="text-[11px] text-slate-500">Label</span>
                <input className={field} value={gLabel} onChange={(e) => setGLabel(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[11px] text-slate-500">Price</span>
                <input className={field} value={gPrice} onChange={(e) => setGPrice(e.target.value)} />
              </label>
              <label className="block sm:col-span-3">
                <span className="text-[11px] text-slate-500">Detail</span>
                <input className={field} value={gDetail} onChange={(e) => setGDetail(e.target.value)} />
              </label>
            </div>
          </div>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Rate footnotes (one per line)</span>
            <textarea className={`${field} min-h-[100px]`} value={footnotesText} onChange={(e) => setFootnotesText(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Deals page (`/deals`)</h2>
        <p className="mt-1 text-xs text-slate-500">Valid JSON object matching <code className="rounded bg-slate-100 px-1">dealsPage</code> in code.</p>
        <textarea
          className={`${field} mt-3 min-h-[220px] font-mono text-[12px]`}
          value={dealsJson}
          onChange={(e) => setDealsJson(e.target.value)}
        />
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={pending}
          onClick={() => save()}
          className="rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition enabled:hover:brightness-110 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
