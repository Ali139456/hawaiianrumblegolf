-- Run in Supabase SQL editor after project creation.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  message text not null
);

alter table public.contact_messages enable row level security;

-- No public policies: inserts go through the Next.js API route using the service role key.
