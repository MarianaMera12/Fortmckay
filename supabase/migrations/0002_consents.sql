-- Consent / waiver tracking ----------------------------------------------
-- Run this once in the Supabase SQL Editor (Database > SQL Editor).

alter table public.members
  add column if not exists date_of_birth date,
  add column if not exists address text,
  add column if not exists medical_info text;

create table if not exists public.consents (
  id             uuid primary key default gen_random_uuid(),
  member_id      uuid not null references public.members (id) on delete cascade,
  full_name      text not null,
  email          text,
  phone          text not null,
  date_of_birth  date,
  address        text,
  medical_info   text,
  waiver_version text not null,
  accepted_at    timestamptz not null default now()
);

create index if not exists consents_member_idx on public.consents (member_id);

alter table public.consents enable row level security;

create policy "staff manage consents" on public.consents
  for all to authenticated using (true) with check (true);
