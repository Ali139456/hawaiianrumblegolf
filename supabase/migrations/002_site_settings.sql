-- Editable site copy (merged in app with defaults in lib/site.ts). Admin updates via /api/admin/settings.
create table if not exists public.site_settings (
  id int primary key check (id = 1),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

-- Public site reads merged settings server-side with service role; optional anon read if you add client fetch later.
create policy "site_settings_select_anon" on public.site_settings
  for select
  to anon, authenticated
  using (true);

-- Writes go through Next.js API using the service role key (bypasses RLS). No insert/update policies for anon.
