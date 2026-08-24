-- Chạy trong Supabase SQL Editor để tạo function tăng view_count an toàn (atomic)

create or replace function increment_view_count(p_username text)
returns int
language sql
security definer
set search_path = public
as $$
  update profiles
  set view_count = view_count + 1
  where username = p_username and status = 'approved'
  returning view_count;
$$;

grant execute on function increment_view_count(text) to anon, authenticated;
