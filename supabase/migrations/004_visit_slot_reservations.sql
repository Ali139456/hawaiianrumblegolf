-- Arrival window capacity (guests per date + time slot).
create table if not exists public.visit_slot_reservations (
  id uuid primary key default gen_random_uuid(),
  visit_date date not null,
  visit_time text not null,
  players integer not null check (players > 0),
  stripe_session_id text not null unique,
  status text not null check (status in ('pending', 'confirmed', 'cancelled')),
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists visit_slot_reservations_slot_idx
  on public.visit_slot_reservations (visit_date, visit_time, status);

alter table public.visit_slot_reservations enable row level security;

create or replace function public.visit_slot_release_expired_pending()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.visit_slot_reservations
  set status = 'cancelled', expires_at = null
  where status = 'pending'
    and expires_at is not null
    and expires_at < now();
end;
$$;

create or replace function public.visit_slot_booked_count(
  p_visit_date date,
  p_visit_time text
)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  total integer;
begin
  perform public.visit_slot_release_expired_pending();
  select coalesce(sum(players), 0)::integer
  into total
  from public.visit_slot_reservations
  where visit_date = p_visit_date
    and visit_time = p_visit_time
    and (
      status = 'confirmed'
      or (status = 'pending' and expires_at is not null and expires_at > now())
    );
  return total;
end;
$$;

create or replace function public.visit_slot_try_reserve(
  p_visit_date date,
  p_visit_time text,
  p_players integer,
  p_stripe_session_id text,
  p_capacity integer,
  p_hold_minutes integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  booked integer;
  remaining integer;
begin
  perform public.visit_slot_release_expired_pending();
  booked := public.visit_slot_booked_count(p_visit_date, p_visit_time);
  remaining := p_capacity - booked;

  if p_players > remaining then
    return jsonb_build_object(
      'ok', false,
      'reason', 'full',
      'booked', booked,
      'capacity', p_capacity
    );
  end if;

  insert into public.visit_slot_reservations (
    visit_date,
    visit_time,
    players,
    stripe_session_id,
    status,
    expires_at
  ) values (
    p_visit_date,
    p_visit_time,
    p_players,
    p_stripe_session_id,
    'pending',
    now() + make_interval(mins => p_hold_minutes)
  );

  return jsonb_build_object('ok', true);
exception
  when unique_violation then
    return jsonb_build_object('ok', false, 'reason', 'unavailable');
end;
$$;
