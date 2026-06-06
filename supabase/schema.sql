create extension if not exists "pgcrypto";

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  duration_minutes integer not null
);

create table if not exists barbers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'activo'
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_phone text not null,
  service_id uuid references services(id),
  barber_id uuid references barbers(id),
  appointment_date timestamp not null,
  created_at timestamp not null default now()
);

alter table appointments enable row level security;