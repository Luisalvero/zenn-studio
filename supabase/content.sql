-- Zenn Studio — editable site content (key/value)
-- Run once in Supabase → SQL Editor → New query → Run.

create table if not exists public.site_content (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Public site content: anyone may read it.
create policy "anyone reads content"
  on public.site_content for select
  to anon, authenticated
  using (true);

-- Only the owner may write it.
create policy "owner inserts content"
  on public.site_content for insert
  to authenticated
  with check ((auth.jwt() ->> 'email') = 'luis@empcnet.com');

create policy "owner updates content"
  on public.site_content for update
  to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com')
  with check ((auth.jwt() ->> 'email') = 'luis@empcnet.com');
