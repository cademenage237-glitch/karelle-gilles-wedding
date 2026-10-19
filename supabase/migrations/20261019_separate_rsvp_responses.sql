-- RSVP separation for Carelle & Gilles
-- Run once in Supabase SQL Editor. This preserves all current invitation rows.
create table if not exists public.rsvp_responses (
  id uuid primary key default gen_random_uuid(),
  response_type text not null check (response_type in ('traditional', 'general')),
  full_name text not null,
  attending boolean not null,
  party_size integer not null default 1 check (party_size >= 0),
  message text,
  response_key text not null unique,
  invite_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.rsvp_responses enable row level security;

drop policy if exists "public can read rsvp responses" on public.rsvp_responses;
create policy "public can read rsvp responses"
  on public.rsvp_responses for select to public using (true);

drop policy if exists "public can insert rsvp responses" on public.rsvp_responses;
create policy "public can insert rsvp responses"
  on public.rsvp_responses for insert to public with check (
    response_type in ('traditional', 'general')
    and length(trim(full_name)) > 0
    and party_size >= 0
    and length(trim(response_key)) > 0
  );

-- Copy existing traditional answers before clearing the old columns.
insert into public.rsvp_responses
  (response_type, full_name, attending, party_size, response_key, invite_slug, created_at, updated_at)
select
  'traditional',
  full_name,
  traditional_attending,
  coalesce(traditional_party_size, 0),
  'traditional:' || slug,
  slug,
  coalesce(traditional_responded_at, updated_at, now()),
  now()
from public.guests
where traditional_attending is not null
on conflict (response_key) do nothing;

-- Remove traditional-only data from the official invitation records.
update public.guests
set traditional_attending = null,
    traditional_party_size = null,
    traditional_responded_at = null,
    updated_at = now()
where traditional_attending is not null;

-- Verification
select response_type, count(*) as total
from public.rsvp_responses
group by response_type
order by response_type;

select count(*) as guests_with_legacy_traditional_data
from public.guests
where traditional_attending is not null;
