create extension if not exists pgcrypto;

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  company text,
  chat_link text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_statuses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique(user_id, name)
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,
  client_name text not null,
  chat_link text,
  task_description text not null,
  details text,
  estimated_time text not null,
  status text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.handled_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contact_name text not null,
  chat_link text,
  platform text,
  handled_at timestamptz not null default now(),
  notes text,
  handled_by text,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.internal_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text,
  priority text,
  status text not null,
  assignee text,
  due_date date,
  notes text,
  related_link text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_clients_user_id on public.clients(user_id);
create index if not exists idx_clients_name on public.clients(user_id, name);
create index if not exists idx_tasks_user_id on public.tasks(user_id);
create index if not exists idx_tasks_status on public.tasks(user_id, status);
create index if not exists idx_task_statuses_user_id on public.task_statuses(user_id);
create index if not exists idx_handled_chats_user_id on public.handled_chats(user_id);
create index if not exists idx_handled_chats_handled_at on public.handled_chats(user_id, handled_at desc);
create index if not exists idx_handled_chats_platform on public.handled_chats(user_id, platform);
create index if not exists idx_internal_tasks_user_id on public.internal_tasks(user_id);
create index if not exists idx_internal_tasks_status on public.internal_tasks(user_id, status);
create index if not exists idx_internal_tasks_priority on public.internal_tasks(user_id, priority);
create index if not exists idx_internal_tasks_due_date on public.internal_tasks(user_id, due_date);
create index if not exists idx_internal_tasks_category on public.internal_tasks(user_id, category);

alter table public.clients enable row level security;
alter table public.tasks enable row level security;
alter table public.task_statuses enable row level security;
alter table public.handled_chats enable row level security;
alter table public.internal_tasks enable row level security;

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

create policy "Tasks are viewable by owner"
on public.tasks for select
using (user_id = auth.uid());

create policy "Tasks are insertable by owner"
on public.tasks for insert
with check (user_id = auth.uid());

create policy "Tasks are updatable by owner"
on public.tasks for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Tasks are deletable by owner"
on public.tasks for delete
using (user_id = auth.uid());

create policy "Task statuses are viewable by owner"
on public.task_statuses for select
using (user_id = auth.uid());

create policy "Task statuses are insertable by owner"
on public.task_statuses for insert
with check (user_id = auth.uid());

create policy "Task statuses are updatable by owner"
on public.task_statuses for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Task statuses are deletable by owner"
on public.task_statuses for delete
using (user_id = auth.uid());

create policy "Handled chats are viewable by owner"
on public.handled_chats for select
using (user_id = auth.uid());

create policy "Handled chats are insertable by owner"
on public.handled_chats for insert
with check (user_id = auth.uid());

create policy "Handled chats are updatable by owner"
on public.handled_chats for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Handled chats are deletable by owner"
on public.handled_chats for delete
using (user_id = auth.uid());

create policy "Internal tasks are viewable by owner"
on public.internal_tasks for select
using (user_id = auth.uid());

create policy "Internal tasks are insertable by owner"
on public.internal_tasks for insert
with check (user_id = auth.uid());

create policy "Internal tasks are updatable by owner"
on public.internal_tasks for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Internal tasks are deletable by owner"
on public.internal_tasks for delete
using (user_id = auth.uid());

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
