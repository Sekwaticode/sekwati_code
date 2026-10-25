-- Phase 1: Client and lead CRM
-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

-- Staff: people allowed into /admin. Client logins (Phase 2) will NOT be in this table,
-- so they can never read CRM data.
create table if not exists public.staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.staff where user_id = auth.uid());
$$;

-- Contacts: leads and clients live in one table. Converting a lead to a client
-- just flips `kind`, so history (notes, activities) carries over.
create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'lead' check (kind in ('lead', 'client')),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'active', 'inactive')),
  name text not null check (char_length(name) between 1 and 200),
  company text,
  email text,
  phone text,
  source text, -- e.g. website, whatsapp, referral
  service_interest text, -- e.g. landing page, e-commerce
  estimated_value numeric(12, 2),
  notes text,
  created_by uuid references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_kind_status_idx on public.contacts (kind, status);
create index if not exists contacts_created_at_idx on public.contacts (created_at desc);

-- Activity log per contact: calls, emails, meetings, WhatsApp messages, notes.
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  type text not null default 'note' check (type in ('note', 'call', 'email', 'meeting', 'whatsapp')),
  body text not null check (char_length(body) between 1 and 5000),
  created_by uuid references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists activities_contact_idx on public.activities (contact_id, created_at desc);

-- Keep updated_at current
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists contacts_touch_updated_at on public.contacts;
create trigger contacts_touch_updated_at
  before update on public.contacts
  for each row execute function public.touch_updated_at();

-- Row level security: staff only
alter table public.staff enable row level security;
alter table public.contacts enable row level security;
alter table public.activities enable row level security;

drop policy if exists "staff can read staff" on public.staff;
create policy "staff can read staff" on public.staff
  for select to authenticated using (public.is_staff());

drop policy if exists "staff manage contacts" on public.contacts;
create policy "staff manage contacts" on public.contacts
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff manage activities" on public.activities;
create policy "staff manage activities" on public.activities
  for all to authenticated using (public.is_staff()) with check (public.is_staff());
