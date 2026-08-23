-- Chạy trong Supabase SQL Editor sau khi tạo project

create table profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  display_name text not null,
  bio_text text default '',
  song_title text default '',
  location text default '',
  view_count integer default 0,
  avatar_url text default '',
  video_url text default '',
  audio_url text default '',
  social_links jsonb default '[]',
  friends jsonb default '[]',
  status text not null default 'pending', -- 'pending' | 'approved'
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Ai cũng đọc được, nhưng chỉ trang bio public mới lọc status='approved' ở phía client.
-- Trang admin (có mật khẩu ở tầng UI) đọc cả pending lẫn approved qua policy select này.
create policy "Public can read profiles"
  on profiles for select
  using (true);

create policy "Public can insert profiles"
  on profiles for insert
  with check (status = 'pending');

-- Cho phép update để trang admin duyệt/từ chối (chỉ được đổi status, ràng buộc ở UI + policy dưới).
create policy "Public can update status"
  on profiles for update
  using (true)
  with check (status in ('pending', 'approved', 'rejected'));

-- Tạo bucket "avatars" (public) trong Storage > New bucket, rồi chạy:
create policy "Public can read avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Public can upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars');

-- Tạo thêm bucket "videos" (public) trong Storage > New bucket, rồi chạy:
create policy "Public can read videos"
  on storage.objects for select
  using (bucket_id = 'videos');

create policy "Public can upload videos"
  on storage.objects for insert
  with check (bucket_id = 'videos');

-- Tạo thêm bucket "audio" (public) trong Storage > New bucket, rồi chạy:
create policy "Public can read audio"
  on storage.objects for select
  using (bucket_id = 'audio');

create policy "Public can upload audio"
  on storage.objects for insert
  with check (bucket_id = 'audio');
