-- ============================================================
--  Barber Gang MX · Supabase Schema
--  Paste this entire file into:
--  Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ── appointments ────────────────────────────────────────────
create table if not exists appointments (
  id               uuid        primary key default gen_random_uuid(),
  created_at       timestamptz not null    default now(),
  client_name      text        not null,
  client_phone     text        not null,
  appointment_date timestamptz not null,
  service_id       text,          -- stores the service name (e.g. "Corte y Diseño de Cabello")
  barber_id        text,          -- stores the barber name  (e.g. "Mauricio")
  status           text        not null    default 'pending'
                               check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show'))
);

-- Prevent double bookings for the same barber at the same time
create unique index if not exists unique_barber_time 
  on appointments (barber_id, appointment_date) 
  where status != 'cancelled';

-- ── Row Level Security ───────────────────────────────────────
alter table appointments enable row level security;

-- Anyone can book (insert) — the public booking form
create policy "public_insert" on appointments
  for insert to anon with check (true);

-- Anyone can read — needed for /agenda and the realtime feed
create policy "public_select" on appointments
  for select to anon using (true);

-- Anyone can update status — needed for confirm/cancel in /agenda
create policy "public_update" on appointments
  for update to anon using (true);

-- ── Realtime ─────────────────────────────────────────────────
-- Enables the live feed on /agenda (the "ding" when a new booking arrives)
alter publication supabase_realtime add table appointments;
