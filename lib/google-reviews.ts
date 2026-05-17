import { unstable_cache } from "next/cache";
import {
  loadGoogleReviewsFromCache,
  upsertGoogleReviewsCache,
} from "@/lib/google-reviews-cache";
import type { SiteConfig } from "@/lib/site";

/** Homepage testimonials grid — target count (Google returns max 5 per API call). */
export const DISPLAY_REVIEW_COUNT = 6;

export type GoogleReviewCard = {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  /** Unix seconds from Google — used to sort newest first. */
  reviewTime: number;
  profilePhotoUrl: string | null;
};

/** Newest reviews with text first, capped for the testimonials grid. */
export function selectReviewsForDisplay(reviews: GoogleReviewCard[]): GoogleReviewCard[] {
  return [...reviews]
    .filter((r) => r.text.length > 0)
    .sort((a, b) => b.reviewTime - a.reviewTime)
    .slice(0, DISPLAY_REVIEW_COUNT);
}

export type GoogleReviewsResult =
  | {
      status: "live";
      placeId: string;
      reviews: GoogleReviewCard[];
      rating: number | null;
      userRatingsTotal: number | null;
    }
  | { status: "unconfigured" }
  | { status: "error"; reason: string };

type PlaceDetailsReview = {
  author_name?: string;
  rating?: number;
  text?: string;
  time?: number;
  profile_photo_url?: string;
  relative_time_description?: string;
};

type PlaceDetailsResponse = {
  status: string;
  error_message?: string;
  result?: {
    reviews?: PlaceDetailsReview[];
    rating?: number;
    user_ratings_total?: number;
  };
};

type FindPlaceResponse = {
  status: string;
  candidates?: { place_id?: string }[];
  error_message?: string;
};

async function findPlaceId(
  apiKey: string,
  venue: Pick<SiteConfig, "name" | "addressLine" | "cityStateZip">,
): Promise<{ placeId: string | null; error: string | null }> {
  const input = `${venue.name}, ${venue.addressLine}, ${venue.cityStateZip}`;
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", input);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 86_400 } });
  if (!res.ok) return { placeId: null, error: `HTTP ${res.status}` };
  const data = (await res.json()) as FindPlaceResponse;
  if (data.status !== "OK" || !data.candidates?.length) {
    const err = data.error_message ?? `Find Place: ${data.status}`;
    if (process.env.NODE_ENV === "development") {
      console.warn("[google-reviews] findPlaceId:", err);
    }
    return { placeId: null, error: err };
  }
  return { placeId: data.candidates[0]?.place_id ?? null, error: null };
}

async function fetchPlaceDetails(
  placeId: string,
  apiKey: string,
  reviewsSort: "newest" | "most_relevant",
): Promise<{ result: PlaceDetailsResponse["result"] | null; error: string | null }> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "reviews,rating,user_ratings_total,name,place_id",
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("reviews_sort", reviewsSort);

  const res = await fetch(url.toString(), { next: { revalidate: 43_200 } });
  if (!res.ok) return { result: null, error: `HTTP ${res.status}` };
  const data = (await res.json()) as PlaceDetailsResponse;
  if (data.status !== "OK" || !data.result) {
    return {
      result: null,
      error: data.error_message ?? `Place Details: ${data.status}`,
    };
  }
  return { result: data.result, error: null };
}

function mergeReviewSets(...sets: GoogleReviewCard[]): GoogleReviewCard[] {
  const byId = new Map<string, GoogleReviewCard>();
  for (const review of sets) {
    byId.set(review.id, review);
  }
  return [...byId.values()];
}

/** Two sorts (newest + most relevant) — Google caps each response at 5; merge for more unique reviews. */
async function fetchMergedGoogleReviews(
  placeId: string,
  apiKey: string,
): Promise<{
  reviews: GoogleReviewCard[];
  rating: number | null;
  userRatingsTotal: number | null;
  error: string | null;
}> {
  const [newest, relevant] = await Promise.all([
    fetchPlaceDetails(placeId, apiKey, "newest"),
    fetchPlaceDetails(placeId, apiKey, "most_relevant"),
  ]);

  const primary = newest.result ?? relevant.result;
  if (!primary) {
    return {
      reviews: [],
      rating: null,
      userRatingsTotal: null,
      error: newest.error ?? relevant.error ?? "Google Places did not return review data.",
    };
  }

  const merged = mergeReviewSets(
    ...(newest.result ? mapReviews(newest.result) : []),
    ...(relevant.result ? mapReviews(relevant.result) : []),
  );

  return {
    reviews: merged,
    rating: primary.rating ?? null,
    userRatingsTotal: primary.user_ratings_total ?? null,
    error: null,
  };
}

function mapReviews(result: NonNullable<PlaceDetailsResponse["result"]>): GoogleReviewCard[] {
  const raw = result.reviews ?? [];
  return raw.map((r, i) => ({
    id: `g-${r.time ?? i}-${(r.author_name ?? "guest").slice(0, 24)}`,
    authorName: r.author_name ?? "Google user",
    rating: typeof r.rating === "number" ? r.rating : 0,
    text: (r.text ?? "").trim(),
    relativeTime: r.relative_time_description ?? "",
    reviewTime: typeof r.time === "number" ? r.time : 0,
    profilePhotoUrl: r.profile_photo_url ?? null,
  }));
}

async function loadGoogleReviews(site: SiteConfig): Promise<GoogleReviewsResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return { status: "unconfigured" };
  }

  const envPlaceId = process.env.GOOGLE_PLACE_ID?.trim();
  const sitePlaceId = site.googlePlaceId?.trim();
  let placeId = envPlaceId || sitePlaceId || null;
  if (!placeId) {
    const found = await findPlaceId(apiKey, site);
    placeId = found.placeId;
    if (!placeId) {
      return {
        status: "error",
        reason: found.error ?? "Could not find this business on Google Places.",
      };
    }
  }

  const { reviews: fetched, rating, userRatingsTotal, error } = await fetchMergedGoogleReviews(
    placeId,
    apiKey,
  );
  if (!fetched.length) {
    return {
      status: "error",
      reason: error ?? "Google Places did not return review data.",
    };
  }

  await upsertGoogleReviewsCache(placeId, fetched);
  const cached = await loadGoogleReviewsFromCache(placeId, 24);
  const pool =
    cached.length >= DISPLAY_REVIEW_COUNT
      ? cached
      : mergeReviewSets(...selectReviewsForDisplay(fetched), ...cached);
  const reviews = selectReviewsForDisplay(pool);

  return {
    status: "live",
    placeId,
    reviews,
    rating,
    userRatingsTotal,
  };
}

/** Cached server-side; requires GOOGLE_PLACES_API_KEY (and optionally GOOGLE_PLACE_ID). */
export async function getGoogleReviewData(site: SiteConfig): Promise<GoogleReviewsResult> {
  const keyParts = [
    "hawaiian-rumble-google-reviews-v5-cache-merge",
    process.env.GOOGLE_PLACES_API_KEY ? "key-set" : "key-missing",
    process.env.GOOGLE_PLACE_ID?.trim() ?? "",
    site.googlePlaceId ?? "",
    site.name,
    site.addressLine,
    site.cityStateZip,
  ];
  return unstable_cache(
    async () => loadGoogleReviews(site),
    keyParts,
    { revalidate: 43_200 },
  )();
}

export function googleWriteReviewUrl(placeId: string) {
  return `https://search.google.com/local/writereview?placeid=${encodeURIComponent(placeId)}`;
}
