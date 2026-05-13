import { unstable_cache } from "next/cache";
import type { SiteConfig } from "@/lib/site";

export type GoogleReviewCard = {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  relativeTime: string;
  profilePhotoUrl: string | null;
};

export type GoogleReviewsResult =
  | {
      status: "live";
      placeId: string;
      reviews: GoogleReviewCard[];
      rating: number | null;
      userRatingsTotal: number | null;
    }
  | { status: "unconfigured" }
  | { status: "error" };

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
): Promise<string | null> {
  const input = `${venue.name}, ${venue.addressLine}, ${venue.cityStateZip}`;
  const url = new URL("https://maps.googleapis.com/maps/api/place/findplacefromtext/json");
  url.searchParams.set("input", input);
  url.searchParams.set("inputtype", "textquery");
  url.searchParams.set("fields", "place_id");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 86_400 } });
  if (!res.ok) return null;
  const data = (await res.json()) as FindPlaceResponse;
  if (data.status !== "OK" || !data.candidates?.length) return null;
  return data.candidates[0]?.place_id ?? null;
}

async function fetchPlaceDetails(
  placeId: string,
  apiKey: string,
): Promise<PlaceDetailsResponse["result"] | null> {
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set(
    "fields",
    "reviews,rating,user_ratings_total,name,place_id",
  );
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 43_200 } });
  if (!res.ok) return null;
  const data = (await res.json()) as PlaceDetailsResponse;
  if (data.status !== "OK" || !data.result) {
    return null;
  }
  return data.result;
}

function mapReviews(result: NonNullable<PlaceDetailsResponse["result"]>): GoogleReviewCard[] {
  const raw = result.reviews ?? [];
  return raw.map((r, i) => ({
    id: `g-${r.time ?? i}-${(r.author_name ?? "guest").slice(0, 24)}`,
    authorName: r.author_name ?? "Google user",
    rating: typeof r.rating === "number" ? r.rating : 0,
    text: (r.text ?? "").trim(),
    relativeTime: r.relative_time_description ?? "",
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
    placeId = await findPlaceId(apiKey, site);
  }
  if (!placeId) {
    return { status: "error" };
  }

  const result = await fetchPlaceDetails(placeId, apiKey);
  if (!result) {
    return { status: "error" };
  }

  return {
    status: "live",
    placeId,
    reviews: mapReviews(result),
    rating: result.rating ?? null,
    userRatingsTotal: result.user_ratings_total ?? null,
  };
}

/** Cached server-side; requires GOOGLE_PLACES_API_KEY (and optionally GOOGLE_PLACE_ID). */
export async function getGoogleReviewData(site: SiteConfig): Promise<GoogleReviewsResult> {
  const keyParts = [
    "hawaiian-rumble-google-reviews-v2",
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
