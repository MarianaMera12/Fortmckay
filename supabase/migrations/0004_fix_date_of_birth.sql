-- Fix two issues left by 0002/0003:
-- 1. date_of_birth was never actually added to members (the table was
--    recreated without it), so the app was silently failing to save/read it.
-- 2. `create policy if not exists` in 0003 is invalid Postgres syntax
--    (CREATE POLICY has no IF NOT EXISTS form), so that statement likely
--    errored out and the "staff manage consents" policy may not exist.
--    drop+create is idempotent and safe to run regardless of current state.

alter table public.members
  add column if not exists date_of_birth date;

drop policy if exists "staff manage consents" on public.consents;
create policy "staff manage consents" on public.consents
  for all to authenticated using (true) with check (true);
