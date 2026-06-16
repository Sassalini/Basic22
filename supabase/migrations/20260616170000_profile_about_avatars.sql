alter table public.profiles
add column if not exists about text not null default '' check (char_length(about) <= 160);

insert into public.profiles (id, email, username, display_name)
select
  users.id,
  users.email,
  substring(
    regexp_replace(
      lower(coalesce(users.raw_user_meta_data ->> 'username', split_part(users.email, '@', 1), 'user')),
      '[^a-z0-9_]+',
      '_',
      'g'
    )
    from 1 for 15
  ) || '_' || substring(users.id::text from 1 for 8),
  coalesce(users.raw_user_meta_data ->> 'display_name', split_part(users.email, '@', 1), 'Basic22 user')
from auth.users
where not exists (
  select 1
  from public.profiles
  where profiles.id = users.id
);

drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profile-images',
  'profile-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Profile image uploads by owner" on storage.objects;
create policy "Profile image uploads by owner"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Profile image reads by signed in users" on storage.objects;
create policy "Profile image reads by signed in users"
on storage.objects for select
to authenticated
using (bucket_id = 'profile-images');

drop policy if exists "Profile image deletes by owner" on storage.objects;
create policy "Profile image deletes by owner"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'profile-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
