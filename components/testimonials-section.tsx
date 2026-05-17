import { siGoogle } from "simple-icons";
import Link from "next/link";
import { GoogleGLogo } from "@/components/icons/google-g-logo";
import { SimpleBrandIcon } from "@/components/icons/simple-brand-icon";
import { Reveal } from "@/components/motion/reveal";
import { TropicalFramedSection } from "@/components/tropical-framed-section";
import { TestimonialsReviewsBlock } from "@/components/testimonials-reviews-block";
import {
  DISPLAY_REVIEW_COUNT,
  getGoogleReviewData,
  googleWriteReviewUrl,
  selectReviewsForDisplay,
  type GoogleReviewCard,
} from "@/lib/google-reviews";
import { HOME_SECTIONS, homeHash } from "@/lib/site-paths";
import type { SiteConfig } from "@/lib/site";

export function TestimonialsSectionFallback() {
  return (
    <TropicalFramedSection id="testimonials" className="border-y border-white/5">
      <>
        <div className="mx-auto max-w-xl space-y-3 text-center lg:mx-0 lg:max-w-none lg:text-left">
          <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-gradient-to-r from-emerald-200/60 to-teal-200/50 lg:mx-0" />
          <div className="mx-auto h-10 max-w-sm animate-pulse rounded-xl bg-emerald-900/10 lg:mx-0" />
          <div className="mx-auto h-5 max-w-md animate-pulse rounded-lg bg-emerald-900/10 lg:mx-0" />
        </div>
        <div className="mt-10 md:mt-14 md:hidden">
          <div className="h-48 animate-pulse rounded-[1.05rem] bg-gradient-to-br from-white/80 via-emerald-50/40 to-teal-50/30 shadow-inner ring-1 ring-emerald-900/5" />
          <div className="mt-4 flex justify-between px-1">
            <div className="h-11 w-11 animate-pulse rounded-full bg-white/80 shadow ring-1 ring-emerald-900/5" />
            <div className="h-11 w-11 animate-pulse rounded-full bg-white/80 shadow ring-1 ring-emerald-900/5" />
          </div>
        </div>
        <div className="mt-10 hidden gap-7 md:mt-14 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-52 animate-pulse rounded-[1.35rem] bg-gradient-to-br from-white/80 via-emerald-50/40 to-teal-50/30 shadow-inner ring-1 ring-emerald-900/5"
            />
          ))}
        </div>
      </>
    </TropicalFramedSection>
  );
}

export async function TestimonialsSection({ site }: { site: SiteConfig }) {
  const data = await getGoogleReviewData(site);

  const googleCards =
    data.status === "live" ? selectReviewsForDisplay(data.reviews) : [];

  const useGoogle = googleCards.length > 0;

  const featured = site.featuredTestimonials.slice(0, DISPLAY_REVIEW_COUNT).map((t, i) => ({
    id: `f-${i}`,
    authorName: t.name,
    rating: t.rating,
    text: t.quote,
    relativeTime: "",
    reviewTime: 0,
    profilePhotoUrl: null as string | null,
  }));

  const cards: GoogleReviewCard[] = useGoogle ? googleCards : featured;

  const reviewHref =
    data.status === "live" ? googleWriteReviewUrl(data.placeId) : site.googleMapsReviewsUrl;

  const summary =
    data.status === "live" && (data.rating != null || data.userRatingsTotal != null) ? (
      <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-2xl border border-emerald-500/20 bg-surface-elevated/80 px-4 py-2.5 shadow-sm backdrop-blur-sm">
        {data.rating != null ? (
          <span className="text-sm text-slate-700">
            <span className="text-lg font-bold tabular-nums text-emerald-800">{data.rating.toFixed(1)}</span>
            <span className="ml-1 font-medium text-slate-600">on Google</span>
          </span>
        ) : null}
        {data.rating != null && data.userRatingsTotal != null ? (
          <span className="hidden sm:inline text-slate-300" aria-hidden>
            |
          </span>
        ) : null}
        {data.userRatingsTotal != null ? (
          <span className="text-sm font-medium text-slate-600">
            {data.userRatingsTotal.toLocaleString()} reviews
          </span>
        ) : null}
      </div>
    ) : null;

  return (
    <TropicalFramedSection id="testimonials" className="border-y border-white/5">
      <>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <Reveal className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-teal-400/90 sm:text-xs">
              Voices from the course
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-[2.15rem] sm:leading-tight">
                Guest reviews
              </h2>
              {useGoogle ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-gradient-to-r from-surface-elevated to-emerald-950/40 px-3 py-1.5 text-xs font-semibold text-slate-300 shadow-sm ring-1 ring-white/10">
                  <span style={{ color: `#${siGoogle.hex}` }} className="inline-flex">
                    <SimpleBrandIcon icon={siGoogle} className="h-3.5 w-3.5" />
                  </span>
                  Live from Google
                </span>
              ) : null}
            </div>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-teal-500 shadow-sm" />
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {useGoogle
                ? "Fresh feedback from Google. Thank you for spending your evening with us under the lights."
                : data.status === "unconfigured"
                  ? "Showing featured quotes. Add GOOGLE_PLACES_API_KEY in .env.local (local) or Vercel env vars (live site), then restart or redeploy."
                  : "Kind words from families, locals, and vacationers."}
            </p>
            {summary}
          </Reveal>

          <Reveal
            className="flex w-full flex-col gap-3 rounded-3xl border border-white/10 bg-gradient-to-br from-surface-elevated via-surface-muted to-emerald-950/30 p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md sm:flex-row sm:p-4 lg:w-auto lg:min-w-[260px] lg:flex-col lg:p-5"
            y={10}
          >
            <Link
              href={homeHash(HOME_SECTIONS.contact)}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/35 ring-2 ring-amber-300/40 transition hover:brightness-110 hover:shadow-orange-500/50 active:scale-[0.98]"
            >
              Give us feedback
            </Link>
            <a
              href={reviewHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-900 shadow-lg shadow-black/20 ring-2 ring-blue-200/80 transition hover:bg-slate-50 hover:shadow-xl active:scale-[0.98]"
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200/80">
                <GoogleGLogo className="h-[18px] w-[18px]" />
              </span>
              Review on Google
            </a>
            <a
              href={site.googleMapsReviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 text-center text-sm font-semibold text-teal-300 underline decoration-teal-400/50 underline-offset-[5px] transition hover:text-teal-200 hover:decoration-teal-300 sm:justify-start"
            >
              <GoogleGLogo className="h-4 w-4 shrink-0" />
              Read all reviews on Google →
            </a>
          </Reveal>
        </div>

        {data.status === "error" ? (
          <p className="mt-8 rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50/95 to-orange-50/80 px-4 py-3 text-sm text-amber-950 shadow-sm backdrop-blur-sm">
            Live Google reviews could not be loaded
            {data.reason ? ` (${data.reason})` : ""}. Check your API key, billing, and that{" "}
            <strong>Places API</strong> (classic) is enabled — not only Places API (New). Showing featured
            quotes instead.
          </p>
        ) : data.status === "unconfigured" ? (
          <p className="mt-8 rounded-2xl border border-white/10 bg-surface-muted/60 px-4 py-3 text-xs leading-relaxed text-muted backdrop-blur-sm">
            Set <span className="font-semibold text-slate-300">GOOGLE_PLACES_API_KEY</span> in Vercel →
            Environment Variables, then redeploy. Local dev: add the same to{" "}
            <span className="font-semibold text-slate-300">.env.local</span> and restart{" "}
            <span className="font-semibold text-slate-300">npm run dev</span>.
          </p>
        ) : null}

        <TestimonialsReviewsBlock cards={cards} useGoogle={useGoogle} />
      </>
    </TropicalFramedSection>
  );
}
