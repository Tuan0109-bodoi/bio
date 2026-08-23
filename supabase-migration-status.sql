-- Chạy trong Supabase SQL Editor (bảng profiles đã tồn tại sẵn)

alter table profiles add column if not exists status text not null default 'pending';

-- Xoá policy insert cũ (cho phép insert bất kỳ status nào) và tạo lại chặt hơn
drop policy if exists "Public can insert profiles" on profiles;

create policy "Public can insert profiles"
  on profiles for insert
  with check (status = 'pending');

-- Cho phép update để trang admin duyệt/từ chối
drop policy if exists "Public can update status" on profiles;

create policy "Public can update status"
  on profiles for update
  using (true)
  with check (status in ('pending', 'approved', 'rejected'));

-- Các profile đã có từ trước migration này mặc định coi là đã duyệt, tránh biến mất khỏi trang bio
update profiles set status = 'approved' where status = 'pending';
