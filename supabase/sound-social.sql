-- Zenn Studio — sound likes + song-use requests
-- Run once in Supabase → SQL Editor. Powers the ❤ likes and "Request to use"
-- flow on /sound, plus the admin Requests tab. Public writes are allowed
-- (visitors like / request without logging in); only the owner reads requests.

-- ── Likes ────────────────────────────────────────────────────────────────
create table if not exists public.sound_likes (
  track_id   text not null,
  voter      text not null,             -- anonymous per-browser id
  created_at timestamptz not null default now(),
  primary key (track_id, voter)
);

alter table public.sound_likes enable row level security;

create policy "anyone reads likes"
  on public.sound_likes for select to anon, authenticated using (true);
create policy "anyone adds a like"
  on public.sound_likes for insert to anon, authenticated with check (true);
create policy "anyone removes their like"
  on public.sound_likes for delete to anon, authenticated using (true);

-- Public per-track like counts (runs with the caller's rights → RLS applies).
create or replace view public.sound_like_counts as
  select track_id, count(*)::int as likes
  from public.sound_likes
  group by track_id;

grant select on public.sound_like_counts to anon, authenticated;

-- ── Song-use requests ────────────────────────────────────────────────────
create table if not exists public.song_requests (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  track_id    text not null,
  track_title text not null default '',
  name        text not null default '',
  email       text not null default '',
  project     text,
  message     text,
  status      text not null default 'new'   -- new | approved | handled | archived
);

alter table public.song_requests enable row level security;

-- Visitors can submit a request, but only the owner can read them (they
-- contain the requester's email) or change their status.
create policy "anyone submits a request"
  on public.song_requests for insert to anon, authenticated with check (true);
create policy "owner reads requests"
  on public.song_requests for select to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com');
create policy "owner updates requests"
  on public.song_requests for update to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com')
  with check ((auth.jwt() ->> 'email') = 'luis@empcnet.com');
create policy "owner deletes requests"
  on public.song_requests for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com');
