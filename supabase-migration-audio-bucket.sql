-- Chạy trong Supabase SQL Editor
-- Trước tiên: tạo bucket "audio" (public) trong Storage > New bucket, rồi chạy:

create policy "Public can read audio"
  on storage.objects for select
  using (bucket_id = 'audio');

create policy "Public can upload audio"
  on storage.objects for insert
  with check (bucket_id = 'audio');
