-- Ensure the consent table exists in Supabase even if the earlier migration was not applied.
create table if not exists public.consents (
  id          uuid primary key default gen_random_uuid(),
  member_id   uuid not null references public.members (id) on delete cascade,
  accepted_at timestamptz not null default now()
);

create index if not exists consents_member_idx on public.consents (member_id);

alter table public.consents enable row level security;

create policy if not exists "staff manage consents" on public.consents
  for all to authenticated using (true) with check (true);
