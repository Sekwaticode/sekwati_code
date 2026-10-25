-- Phase 2: Client portal, projects, milestones, files, requests, contracts
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run. Safe to re-run.
-- Requires 0001_crm.sql to have been run first.

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Client logins: links a Supabase auth user to a client contact.
-- ---------------------------------------------------------------------------
create table if not exists public.client_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  contact_id uuid not null references public.contacts (id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);
create index if not exists client_users_contact_idx on public.client_users (contact_id);

create or replace function public.is_client_of(p_contact uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.client_users where user_id = auth.uid() and contact_id = p_contact
  );
$$;

create or replace function public.is_client()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.client_users where user_id = auth.uid());
$$;

-- ---------------------------------------------------------------------------
-- Projects and milestones
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete restrict,
  name text not null check (char_length(name) between 1 and 200),
  description text,
  status text not null default 'planning'
    check (status in ('planning', 'in_progress', 'review', 'completed', 'on_hold')),
  start_date date,
  due_date date,
  created_by uuid references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_contact_idx on public.projects (contact_id);

drop trigger if exists projects_touch_updated_at on public.projects;
create trigger projects_touch_updated_at before update on public.projects
  for each row execute function public.touch_updated_at();

create or replace function public.client_can_see_project(p_project uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.projects p
    join public.client_users cu on cu.contact_id = p.contact_id
    where p.id = p_project and cu.user_id = auth.uid()
  );
$$;

create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 200),
  description text,
  position int not null default 0,
  due_date date,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'awaiting_approval', 'approved', 'changes_requested')),
  client_feedback text,
  responded_at timestamptz,
  responded_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);
create index if not exists milestones_project_idx on public.milestones (project_id, position);

-- ---------------------------------------------------------------------------
-- Documents (files live in the private 'project-files' storage bucket)
-- ---------------------------------------------------------------------------
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  file_path text not null unique,
  file_name text not null,
  size_bytes bigint,
  mime_type text,
  category text not null default 'content'
    check (category in ('content', 'brand', 'design', 'contract', 'other')),
  uploaded_by uuid references auth.users (id),
  uploaded_by_staff boolean not null default false,
  created_at timestamptz not null default now(),
  check (file_path like project_id::text || '/%')
);
create index if not exists documents_project_idx on public.documents (project_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Revision and support requests, with a comment thread
-- ---------------------------------------------------------------------------
create table if not exists public.requests (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  type text not null default 'support' check (type in ('revision', 'support')),
  title text not null check (char_length(title) between 1 and 200),
  description text not null check (char_length(description) between 1 and 5000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'closed')),
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  created_by uuid references auth.users (id),
  created_by_staff boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists requests_contact_idx on public.requests (contact_id, created_at desc);
create index if not exists requests_status_idx on public.requests (status);

drop trigger if exists requests_touch_updated_at on public.requests;
create trigger requests_touch_updated_at before update on public.requests
  for each row execute function public.touch_updated_at();

create table if not exists public.request_comments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  author_id uuid references auth.users (id),
  author_is_staff boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists request_comments_request_idx on public.request_comments (request_id, created_at);

-- ---------------------------------------------------------------------------
-- Contracts and acceptance records
-- ---------------------------------------------------------------------------
create table if not exists public.contracts (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid not null references public.contacts (id) on delete restrict,
  project_id uuid references public.projects (id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  body text not null check (char_length(body) between 1 and 100000),
  status text not null default 'draft' check (status in ('draft', 'sent', 'accepted')),
  sent_at timestamptz,
  accepted_at timestamptz,
  accepted_by uuid references auth.users (id),
  signer_name text,
  signer_ip text,
  signer_user_agent text,
  body_sha256 text,
  created_by uuid references auth.users (id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists contracts_contact_idx on public.contracts (contact_id);

drop trigger if exists contracts_touch_updated_at on public.contracts;
create trigger contracts_touch_updated_at before update on public.contracts
  for each row execute function public.touch_updated_at();

-- Sent contracts can't be edited (withdraw to draft first); accepted ones are locked for good.
create or replace function public.protect_contracts()
returns trigger language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    if old.status = 'accepted' then
      raise exception 'Accepted contracts cannot be deleted.';
    end if;
    return old;
  end if;

  if old.status = 'accepted' then
    raise exception 'Accepted contracts cannot be changed.';
  end if;

  if old.status = 'sent' and new.status <> 'accepted'
     and (new.body is distinct from old.body or new.title is distinct from old.title) then
    raise exception 'Withdraw the contract to draft before editing it.';
  end if;

  -- Acceptance fields may only be set by accept_contract()
  if new.status = 'accepted' and current_setting('app.accepting_contract', true) is distinct from 'on' then
    raise exception 'Contracts can only be accepted by the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists contracts_protect on public.contracts;
create trigger contracts_protect before update or delete on public.contracts
  for each row execute function public.protect_contracts();

-- ---------------------------------------------------------------------------
-- Author stamping: who created a row, and whether they're staff, is set by the
-- database, not trusted from the browser.
-- ---------------------------------------------------------------------------
create or replace function public.stamp_document()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.uploaded_by := auth.uid();
  new.uploaded_by_staff := public.is_staff();
  return new;
end;
$$;
drop trigger if exists documents_stamp on public.documents;
create trigger documents_stamp before insert on public.documents
  for each row execute function public.stamp_document();

create or replace function public.stamp_request()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.created_by := auth.uid();
  new.created_by_staff := public.is_staff();
  return new;
end;
$$;
drop trigger if exists requests_stamp on public.requests;
create trigger requests_stamp before insert on public.requests
  for each row execute function public.stamp_request();

create or replace function public.stamp_request_comment()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.author_id := auth.uid();
  new.author_is_staff := public.is_staff();
  return new;
end;
$$;
drop trigger if exists request_comments_stamp on public.request_comments;
create trigger request_comments_stamp before insert on public.request_comments
  for each row execute function public.stamp_request_comment();

-- A client reply on a resolved request reopens it so staff notice.
create or replace function public.reopen_on_client_reply()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not new.author_is_staff then
    update public.requests set status = 'open'
      where id = new.request_id and status = 'resolved';
  end if;
  return new;
end;
$$;
drop trigger if exists request_comments_reopen on public.request_comments;
create trigger request_comments_reopen after insert on public.request_comments
  for each row execute function public.reopen_on_client_reply();

-- ---------------------------------------------------------------------------
-- Client actions (run with elevated rights, but check ownership themselves)
-- ---------------------------------------------------------------------------
create or replace function public.respond_to_milestone(p_milestone uuid, p_approve boolean, p_feedback text)
returns void language plpgsql security definer set search_path = public as $$
declare
  m record;
begin
  select ms.id, ms.title, ms.status, p.name as project_name, p.contact_id
    into m
    from public.milestones ms join public.projects p on p.id = ms.project_id
    where ms.id = p_milestone;

  if not found or not public.is_client_of(m.contact_id) then
    raise exception 'Milestone not found.';
  end if;
  if m.status <> 'awaiting_approval' then
    raise exception 'This milestone is not waiting for your approval.';
  end if;
  if not p_approve and coalesce(trim(p_feedback), '') = '' then
    raise exception 'Please describe the changes you need.';
  end if;

  update public.milestones
    set status = case when p_approve then 'approved' else 'changes_requested' end,
        client_feedback = nullif(trim(p_feedback), ''),
        responded_at = now(),
        responded_by = auth.uid()
    where id = p_milestone;

  insert into public.activities (contact_id, type, body, created_by)
  values (
    m.contact_id, 'note',
    case when p_approve
      then format('Client approved milestone "%s" on %s.', m.title, m.project_name)
      else format('Client requested changes on milestone "%s" (%s): %s', m.title, m.project_name, trim(p_feedback))
    end,
    auth.uid()
  );
end;
$$;

create or replace function public.accept_contract(
  p_contract uuid, p_signer_name text, p_ip text, p_user_agent text
)
returns void language plpgsql security definer set search_path = public, extensions as $$
declare
  c record;
begin
  select id, contact_id, status, title into c from public.contracts where id = p_contract;

  if not found or not public.is_client_of(c.contact_id) then
    raise exception 'Contract not found.';
  end if;
  if c.status <> 'sent' then
    raise exception 'This contract is not open for acceptance.';
  end if;
  if char_length(coalesce(trim(p_signer_name), '')) < 2 then
    raise exception 'Type your full name to accept.';
  end if;

  perform set_config('app.accepting_contract', 'on', true);

  update public.contracts
    set status = 'accepted',
        accepted_at = now(),
        accepted_by = auth.uid(),
        signer_name = left(trim(p_signer_name), 200),
        signer_ip = left(p_ip, 100),
        signer_user_agent = left(p_user_agent, 500),
        body_sha256 = encode(extensions.digest(body, 'sha256'), 'hex')
    where id = p_contract;

  perform set_config('app.accepting_contract', 'off', true);

  insert into public.activities (contact_id, type, body, created_by)
  values (c.contact_id, 'note', format('Client accepted contract "%s" (signed as %s).', c.title, trim(p_signer_name)), auth.uid());
end;
$$;

-- Staff helper: link an existing auth user to a client contact (never a staff member).
drop function if exists public.link_client_user(uuid, uuid);
create or replace function public.link_client_user(p_contact uuid, p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_staff() then
    raise exception 'Only staff can do this.';
  end if;
  if exists (select 1 from public.staff where user_id = p_user) then
    raise exception 'That login belongs to a staff member.';
  end if;
  insert into public.client_users (user_id, contact_id, email)
  values (p_user, p_contact, (select email from auth.users where id = p_user))
  on conflict (user_id) do update set contact_id = excluded.contact_id, email = excluded.email;
end;
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.client_users enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.documents enable row level security;
alter table public.requests enable row level security;
alter table public.request_comments enable row level security;
alter table public.contracts enable row level security;

-- Staff: full access everywhere
do $$
declare t text;
begin
  foreach t in array array['client_users','projects','milestones','documents','requests','request_comments','contracts']
  loop
    execute format('drop policy if exists "staff manage %1$s" on public.%1$I', t);
    execute format(
      'create policy "staff manage %1$s" on public.%1$I for all to authenticated using (public.is_staff()) with check (public.is_staff())',
      t
    );
  end loop;
end $$;

-- Clients: read-only on their own records, plus a few narrow inserts
drop policy if exists "client reads own link" on public.client_users;
create policy "client reads own link" on public.client_users
  for select to authenticated using (user_id = auth.uid());

-- Clients don't read the contacts table directly (it holds internal notes and deal values).
-- They get just their name and company through this function.
create or replace function public.my_client_profile()
returns table (contact_id uuid, name text, company text)
language sql stable security definer set search_path = public as $$
  select c.id, c.name, c.company
  from public.client_users cu join public.contacts c on c.id = cu.contact_id
  where cu.user_id = auth.uid()
  limit 1;
$$;

drop policy if exists "client reads own projects" on public.projects;
create policy "client reads own projects" on public.projects
  for select to authenticated using (public.is_client_of(contact_id));

drop policy if exists "client reads own milestones" on public.milestones;
create policy "client reads own milestones" on public.milestones
  for select to authenticated using (public.client_can_see_project(project_id));

drop policy if exists "client reads own documents" on public.documents;
create policy "client reads own documents" on public.documents
  for select to authenticated using (public.client_can_see_project(project_id));

drop policy if exists "client uploads documents" on public.documents;
create policy "client uploads documents" on public.documents
  for insert to authenticated with check (public.client_can_see_project(project_id));

drop policy if exists "client reads own requests" on public.requests;
create policy "client reads own requests" on public.requests
  for select to authenticated using (public.is_client_of(contact_id));

drop policy if exists "client creates requests" on public.requests;
create policy "client creates requests" on public.requests
  for insert to authenticated with check (
    public.is_client_of(contact_id)
    and status = 'open'
    and (project_id is null or public.client_can_see_project(project_id))
  );

drop policy if exists "client reads own request comments" on public.request_comments;
create policy "client reads own request comments" on public.request_comments
  for select to authenticated using (
    exists (select 1 from public.requests r where r.id = request_id and public.is_client_of(r.contact_id))
  );

drop policy if exists "client comments on own requests" on public.request_comments;
create policy "client comments on own requests" on public.request_comments
  for insert to authenticated with check (
    exists (select 1 from public.requests r where r.id = request_id and public.is_client_of(r.contact_id))
  );

drop policy if exists "client reads sent contracts" on public.contracts;
create policy "client reads sent contracts" on public.contracts
  for select to authenticated using (public.is_client_of(contact_id) and status <> 'draft');

-- ---------------------------------------------------------------------------
-- Storage: private bucket, files stored as <project_id>/<random>-<name>
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('project-files', 'project-files', false, 52428800) -- 50 MB per file
on conflict (id) do nothing;

create or replace function public.client_can_see_file(p_name text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.projects p
    join public.client_users cu on cu.contact_id = p.contact_id
    where p.id::text = split_part(p_name, '/', 1) and cu.user_id = auth.uid()
  );
$$;

drop policy if exists "staff manage project files" on storage.objects;
create policy "staff manage project files" on storage.objects
  for all to authenticated
  using (bucket_id = 'project-files' and public.is_staff())
  with check (bucket_id = 'project-files' and public.is_staff());

drop policy if exists "clients read project files" on storage.objects;
create policy "clients read project files" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-files' and public.client_can_see_file(name));

drop policy if exists "clients upload project files" on storage.objects;
create policy "clients upload project files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-files' and public.client_can_see_file(name));
