-- Cached Google reviews (Places API returns max 5 per request; we keep history here).
create table if not exists public.google_reviews_cache (
  id text primary key,
  place_id text not null,
  author_name text not null,
  rating smallint not null default 5,
  text text not null default '',
  relative_time text not null default '',
  review_time bigint not null default 0,
  profile_photo_url text,
  updated_at timestamptz not null default now()
);

create index if not exists google_reviews_cache_place_time_idx
  on public.google_reviews_cache (place_id, review_time desc);

alter table public.google_reviews_cache enable row level security;
