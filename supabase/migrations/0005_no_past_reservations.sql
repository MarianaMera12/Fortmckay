-- Reject reservations on classes whose date/time has already passed.
-- Enforced inside the security-definer function so it can't be bypassed
-- by calling the RPC directly (client-side checks alone can always be
-- skipped by anyone hitting the REST API themselves).
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
  v_date     date;
  v_start    time;
  v_taken    int;
begin
  select capacity, date, start_time into v_capacity, v_date, v_start
    from classes where id = p_class_id for update;

  if v_capacity is null then
    raise exception 'CLASS_NOT_FOUND';
  end if;

  if (v_date + v_start) < now() then
    raise exception 'CLASS_PAST';
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
