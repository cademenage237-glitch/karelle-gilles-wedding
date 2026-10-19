-- Carelle & Gilles — schéma de gestion des invités (Supabase)
-- Ce schéma est déjà appliqué sur le projet tticaymgmdzrfkdfnlai.

create extension if not exists "pgcrypto";

create table if not exists guests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  slug text unique not null,
  confirmation_code text not null,
  party_size int not null default 1,
  table_number text,
  side text, -- 'Mme' ou 'M.' — pour distinguer les deux listes d'invités
  phone text,
  rsvp_status text not null default 'pending' check (rsvp_status in ('pending', 'confirmed', 'declined')),
  rsvp_party_size int,
  rsvp_message text,
  checked_in boolean not null default false,
  checked_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guests_slug_idx on guests (slug);
create index if not exists guests_rsvp_status_idx on guests (rsvp_status);
create index if not exists guests_table_number_idx on guests (table_number);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists guests_set_updated_at on guests;
create trigger guests_set_updated_at
before update on guests
for each row execute function set_updated_at();

alter table guests enable row level security;

create policy "public can read guests" on guests for select using (true);
create policy "public can update rsvp" on guests for update using (true) with check (true);
create policy "public can insert guests" on guests for insert with check (true);

-- Mur participatif (Album) : bucket de stockage pour les photos envoyées par les invités
insert into storage.buckets (id, name, public)
values ('guest-photos', 'guest-photos', true)
on conflict (id) do nothing;

create policy "public can view guest photos" on storage.objects for select using (bucket_id = 'guest-photos');
create policy "public can upload guest photos" on storage.objects for insert with check (bucket_id = 'guest-photos');
