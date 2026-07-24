-- Zenn Studio — leads table (contact-form inquiries)
-- Run this once in Supabase → SQL Editor → New query → Run.

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null,
  email        text not null,
  project_type text,
  message      text not null,
  status       text not null default 'new'  -- 'new' | 'handled' | 'archived'
);

alter table public.leads enable row level security;

-- Only the owner account can read / update / delete rows.
-- Inserts come from the contact Worker using the service_role key, which
-- bypasses RLS — so there is intentionally NO insert policy here.

create policy "owner reads leads"
  on public.leads for select
  to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com');

create policy "owner updates leads"
  on public.leads for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com')
  with check ((auth.jwt() ->> 'email') = 'luis@empcnet.com');

create policy "owner deletes leads"
  on public.leads for delete
  to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com');
