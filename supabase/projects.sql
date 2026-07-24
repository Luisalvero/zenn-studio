-- Zenn Studio — projects table + media storage
-- Run once in Supabase → SQL Editor. ALSO create a PUBLIC Storage bucket named
-- 'project-media' (Storage → New bucket → name it project-media → toggle Public).

create table if not exists public.projects (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  slug              text unique not null,
  title             text not null,
  summary           text not null default '',
  kind              text not null default '',
  year              text not null default '',
  categories        text[] not null default '{}',
  orientation       text not null default 'landscape',
  video_provider    text,
  video_id          text,
  thumbnail         text,
  preview_video     text,
  collaborator_name text,
  collaborator_url  text,
  overview          text,
  featured          boolean not null default false,
  sort_order        integer not null default 0
);

alter table public.projects enable row level security;

create policy "anyone reads projects"
  on public.projects for select to anon, authenticated using (true);
create policy "owner inserts projects"
  on public.projects for insert to authenticated
  with check ((auth.jwt() ->> 'email') = 'luis@empcnet.com');
create policy "owner updates projects"
  on public.projects for update to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com')
  with check ((auth.jwt() ->> 'email') = 'luis@empcnet.com');
create policy "owner deletes projects"
  on public.projects for delete to authenticated
  using ((auth.jwt() ->> 'email') = 'luis@empcnet.com');

-- Seed the two existing projects (media stays as static files in the repo).
insert into public.projects
  (slug, title, summary, kind, year, categories, orientation, video_provider, video_id,
   thumbnail, preview_video, collaborator_name, collaborator_url, overview, featured, sort_order)
values
  ('xlnt-bjj-documentary-teaser', 'BJJ Documentary Teaser',
   'A high-energy teaser reel cut to tease a Brazilian Jiu-Jitsu documentary for XLNT Visual Studio.',
   'Documentary teaser · made for XLNT Visual Studio', '2026',
   array['Trailer','Documentary','Motion Graphics'], 'portrait', 'drive', '1MaH2g5v3BsvZPVjcIOHWn3qUJ77k40MF',
   '/images/projects/xlnt-bjj-documentary-teaser/thumb.jpg', '/images/projects/xlnt-bjj-documentary-teaser/preview.mp4',
   'XLNT Visual Studio', 'https://www.instagram.com/xlnt_visuals/',
   'A fast-cut teaser reel edited to build anticipation for a Brazilian Jiu-Jitsu documentary by XLNT Visual Studio. The goal was pure energy and momentum — punchy, rhythmic editing that grabs attention and teases the story without giving it away.',
   true, 1),
  ('vfx-demo-reel', 'VFX Demo Reel',
   'A demo reel showcasing visual effects and motion work — compositing, animation, and cinematic finishing.',
   'VFX / motion demo reel', '2026',
   array['VFX','Motion Graphics'], 'landscape', 'drive', '1wDNFH8LioMaFqeXL4zfAP_3vZ5wS8fm2',
   '/images/projects/vfx-demo-reel/thumb.jpg', '/images/projects/vfx-demo-reel/preview.mp4',
   null, null, null, true, 2)
on conflict (slug) do nothing;

-- Storage policies for the 'project-media' bucket (public read + owner writes).
create policy "public reads project-media"
  on storage.objects for select using (bucket_id = 'project-media');
create policy "owner uploads project-media"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'project-media' and (auth.jwt() ->> 'email') = 'luis@empcnet.com');
create policy "owner updates project-media"
  on storage.objects for update to authenticated
  using (bucket_id = 'project-media' and (auth.jwt() ->> 'email') = 'luis@empcnet.com');
create policy "owner deletes project-media"
  on storage.objects for delete to authenticated
  using (bucket_id = 'project-media' and (auth.jwt() ->> 'email') = 'luis@empcnet.com');
