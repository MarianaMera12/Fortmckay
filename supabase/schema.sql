-- Fort McKay First Nation — Gym Management schema
create extension if not exists "pgcrypto";

-- MEMBERS ---------------------------------------------------------------
create table if not exists public.members (
  id                uuid primary key default gen_random_uuid(),
  first_name        text not null,
  last_name         text not null,
  phone             text not null,
  email             text,
  membership_status text not null default 'active'
                    check (membership_status in ('active','paused','inactive')),
  member_id         text unique,
  created_at        timestamptz not null default now()
);

create index if not exists members_first_name_idx on public.members (lower(first_name));
create index if not exists members_last_name_idx  on public.members (lower(last_name));
create index if not exists members_member_id_idx  on public.members (member_id);
create index if not exists members_phone_idx      on public.members (phone);

-- ATTENDANCE ------------------------------------------------------------
create table if not exists public.attendance (
  id        uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members (id) on delete cascade,
  check_in  timestamptz not null default now(),
  check_out timestamptz
);

create index if not exists attendance_member_idx   on public.attendance (member_id);
create index if not exists attendance_check_in_idx on public.attendance (check_in desc);
-- current occupancy = rows where check_out is null
create index if not exists attendance_open_idx on public.attendance (member_id)
  where check_out is null;
-- a member can only have one open session at a time
create unique index if not exists attendance_one_open_per_member
  on public.attendance (member_id) where check_out is null;

-- CLASSES ---------------------------------------------------------------
create table if not exists public.classes (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  instructor text not null,
  date       date not null,
  start_time time not null,
  end_time   time not null,
  capacity   int  not null check (capacity > 0),
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create index if not exists classes_date_idx on public.classes (date, start_time);

-- RESERVATIONS ----------------------------------------------------------
create table if not exists public.reservations (
  id         uuid primary key default gen_random_uuid(),
  class_id   uuid not null references public.classes (id) on delete cascade,
  name       text not null,
  phone      text not null,
  email      text not null,
  status     text not null default 'confirmed'
             check (status in ('confirmed','cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists reservations_class_idx on public.reservations (class_id);

-- CAPACITY-SAFE PUBLIC RESERVATION --------------------------------------
-- Locks the class row so two simultaneous requests cannot overbook.
create or replace function public.reserve_class(
  p_class_id uuid,
  p_name     text,
  p_phone    text,
  p_email    text
) returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity int;
  v_taken    int;
begin
  select capacity into v_capacity
    from classes where id = p_class_id for update;

  if v_capacity is null then
    raise exception 'CLASS_NOT_FOUND';
  end if;

  select count(*) into v_taken
    from reservations
   where class_id = p_class_id and status = 'confirmed';

  if v_taken >= v_capacity then
    raise exception 'CLASS_FULL';
  end if;

  insert into reservations (class_id, name, phone, email)
  values (p_class_id, p_name, p_phone, p_email);
end;
$$;

-- ROW LEVEL SECURITY ----------------------------------------------------
alter table public.members     enable row level security;
alter table public.attendance  enable row level security;
alter table public.classes     enable row level security;
alter table public.reservations enable row level security;

-- Staff (any authenticated user) manages everything.
create policy "staff manage members" on public.members
  for all to authenticated using (true) with check (true);

create policy "staff manage attendance" on public.attendance
  for all to authenticated using (true) with check (true);

create policy "staff manage classes" on public.classes
  for all to authenticated using (true) with check (true);

create policy "staff read reservations" on public.reservations
  for select to authenticated using (true);

create policy "staff manage reservations" on public.reservations
  for all to authenticated using (true) with check (true);

-- Public portal: read the schedule only. Reservations go through
-- reserve_class(), which is security definer, so no public insert policy.
create policy "public read classes" on public.classes
  for select to anon using (true);

grant execute on function public.reserve_class(uuid, text, text, text) to anon, authenticated;

-- Reservation counts are needed publicly for "spots left" without exposing
-- personal data — expose an aggregate view instead of the table.
create or replace view public.class_availability as
  select c.id as class_id,
         c.capacity,
         count(r.id) filter (where r.status = 'confirmed') as reserved
    from classes c
    left join reservations r on r.class_id = c.id
   group by c.id, c.capacity;

grant select on public.class_availability to anon, authenticated;

-- Realtime for live occupancy
alter publication supabase_realtime add table public.attendance;
