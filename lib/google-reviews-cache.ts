import type { GoogleReviewCard } from "@/lib/google-reviews";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type CacheRow = {
  id: string;
  place_id: string;
  author_name: string;
  rating: number;
  text: string;
  relative_time: string;
  review_time: number;
  profile_photo_url: string | null;
};

function rowToCard(row: CacheRow): GoogleReviewCard {
  return {
    id: row.id,
    authorName: row.author_name,
    rating: row.rating,
    text: row.text,
    relativeTime: row.relative_time,
    reviewTime: row.review_time,
    profilePhotoUrl: row.profile_photo_url,
  };
}

export async function upsertGoogleReviewsCache(
  placeId: string,
  reviews: GoogleReviewCard[],
): Promise<void> {
  const admin = getSupabaseAdmin();
  if (!admin || reviews.length === 0) return;

  const rows = reviews.map((r) => ({
    id: r.id,
    place_id: placeId,
    author_name: r.authorName,
    rating: r.rating,
    text: r.text,
    relative_time: r.relativeTime,
    review_time: r.reviewTime,
    profile_photo_url: r.profilePhotoUrl,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await admin.from("google_reviews_cache").upsert(rows, { onConflict: "id" });
  if (error && process.env.NODE_ENV === "development") {
    console.warn("[google-reviews-cache] upsert:", error.message);
  }
}

export async function loadGoogleReviewsFromCache(
  placeId: string,
  limit: number,
): Promise<GoogleReviewCard[]> {
  const admin = getSupabaseAdmin();
  if (!admin) return [];

  const { data, error } = await admin
    .from("google_reviews_cache")
    .select(
      "id, place_id, author_name, rating, text, relative_time, review_time, profile_photo_url",
    )
    .eq("place_id", placeId)
    .neq("text", "")
    .order("review_time", { ascending: false })
    .limit(limit);

  if (error || !data?.length) {
    if (error && process.env.NODE_ENV === "development") {
      console.warn("[google-reviews-cache] load:", error.message);
    }
    return [];
  }

  return (data as CacheRow[]).map(rowToCard);
}
