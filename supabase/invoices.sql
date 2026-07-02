create extension if not exists pgcrypto;

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  share_id text not null,
  invoice_number text not null,
  invoice_date date not null,
  period text not null default '',
  irpf_rate numeric(6, 2) not null default 15,
  status text not null default 'borrador' check (status in ('borrador', 'enviada', 'pagada')),
  issuer jsonb not null default '{}'::jsonb,
  client jsonb not null default '{}'::jsonb,
  lines jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, invoice_number)
);

create index if not exists idx_invoices_user_id on public.invoices(user_id);
create index if not exists idx_invoices_invoice_date on public.invoices(user_id, invoice_date desc);
create index if not exists idx_invoices_invoice_number on public.invoices(user_id, invoice_number);
create index if not exists idx_invoices_share_id on public.invoices(share_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_invoices_updated_at on public.invoices;
create trigger set_invoices_updated_at
before update on public.invoices
for each row
execute function public.set_updated_at();

alter table public.invoices enable row level security;

drop policy if exists "Invoices are viewable by owner" on public.invoices;
drop policy if exists "Invoices are insertable by owner" on public.invoices;
drop policy if exists "Invoices are updatable by owner" on public.invoices;
drop policy if exists "Invoices are deletable by owner" on public.invoices;

create policy "Invoices are viewable by owner"
on public.invoices for select
using (user_id = auth.uid());

create policy "Invoices are insertable by owner"
on public.invoices for insert
with check (user_id = auth.uid());

create policy "Invoices are updatable by owner"
on public.invoices for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Invoices are deletable by owner"
on public.invoices for delete
using (user_id = auth.uid());
