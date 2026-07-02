create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  tax_id text,
  address text,
  city_postal text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.clients add column if not exists tax_id text;
alter table public.clients add column if not exists address text;
alter table public.clients add column if not exists city_postal text;
alter table public.clients add column if not exists email text;
alter table public.clients add column if not exists created_at timestamptz not null default now();
alter table public.clients add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_clients_user_id on public.clients(user_id);
create index if not exists idx_clients_user_name on public.clients(user_id, name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_clients_updated_at on public.clients;
create trigger set_clients_updated_at
before update on public.clients
for each row
execute function public.set_updated_at();

alter table public.clients enable row level security;

drop policy if exists "Clients are viewable by owner" on public.clients;
drop policy if exists "Clients are insertable by owner" on public.clients;
drop policy if exists "Clients are updatable by owner" on public.clients;
drop policy if exists "Clients are deletable by owner" on public.clients;

create policy "Clients are viewable by owner"
on public.clients for select
using (user_id = auth.uid());

create policy "Clients are insertable by owner"
on public.clients for insert
with check (user_id = auth.uid());

create policy "Clients are updatable by owner"
on public.clients for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Clients are deletable by owner"
on public.clients for delete
using (user_id = auth.uid());
