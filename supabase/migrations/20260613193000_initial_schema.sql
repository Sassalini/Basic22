create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  username text unique not null check (username ~ '^[a-z0-9_]{3,24}$'),
  display_name text not null check (char_length(display_name) between 1 and 80),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_username text;
  safe_username text;
begin
  requested_username := lower(
    coalesce(
      new.raw_user_meta_data ->> 'username',
      split_part(new.email, '@', 1),
      'basic22'
    )
  );

  safe_username := regexp_replace(requested_username, '[^a-z0-9_]+', '_', 'g');

  if char_length(safe_username) < 3 then
    safe_username := 'user';
  end if;

  safe_username := substring(safe_username from 1 for 15) || '_' || substring(new.id::text from 1 for 8);

  insert into public.profiles (id, email, username, display_name)
  values (
    new.id,
    new.email,
    safe_username,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1), 'Basic22 user')
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles(id) on delete cascade,
  addressee_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (requester_id <> addressee_id)
);

create unique index if not exists friendships_active_pair_unique
on public.friendships (
  least(requester_id, addressee_id),
  greatest(requester_id, addressee_id)
)
where status in ('pending', 'accepted');

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  image_path text,
  created_at timestamptz not null default now()
);

create index if not exists posts_author_created_at_idx
on public.posts (author_id, created_at desc);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now()
);

create index if not exists post_comments_post_created_at_idx
on public.post_comments (post_id, created_at asc);

create table if not exists public.direct_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  check (sender_id <> recipient_id)
);

create index if not exists direct_messages_sender_recipient_created_at_idx
on public.direct_messages (sender_id, recipient_id, created_at asc);

create or replace function public.are_accepted_friends(user_a uuid, user_b uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.friendships f
    where f.status = 'accepted'
      and (
        (f.requester_id = user_a and f.addressee_id = user_b)
        or
        (f.requester_id = user_b and f.addressee_id = user_a)
      )
  );
$$;

create or replace function public.can_read_post(target_post_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.posts p
    where p.id = target_post_id
      and (
        p.author_id = auth.uid()
        or public.are_accepted_friends(auth.uid(), p.author_id)
      )
  );
$$;

alter table public.profiles enable row level security;
alter table public.friendships enable row level security;
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;
alter table public.direct_messages enable row level security;

drop policy if exists "Profiles readable by signed in users" on public.profiles;
create policy "Profiles readable by signed in users"
on public.profiles for select
to authenticated
using (true);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Friendships visible to involved users" on public.friendships;
create policy "Friendships visible to involved users"
on public.friendships for select
to authenticated
using (requester_id = auth.uid() or addressee_id = auth.uid());

drop policy if exists "Users create own friend requests" on public.friendships;
create policy "Users create own friend requests"
on public.friendships for insert
to authenticated
with check (requester_id = auth.uid() and addressee_id <> auth.uid());

drop policy if exists "Addressees respond to friend requests" on public.friendships;
create policy "Addressees respond to friend requests"
on public.friendships for update
to authenticated
using (addressee_id = auth.uid())
with check (addressee_id = auth.uid());

drop policy if exists "Requesters can delete pending requests" on public.friendships;
create policy "Requesters can delete pending requests"
on public.friendships for delete
to authenticated
using (requester_id = auth.uid() and status = 'pending');

drop policy if exists "Posts readable by authors and accepted friends" on public.posts;
create policy "Posts readable by authors and accepted friends"
on public.posts for select
to authenticated
using (
  author_id = auth.uid()
  or public.are_accepted_friends(auth.uid(), author_id)
);

drop policy if exists "Users create own posts" on public.posts;
create policy "Users create own posts"
on public.posts for insert
to authenticated
with check (author_id = auth.uid());

drop policy if exists "Users update own posts" on public.posts;
create policy "Users update own posts"
on public.posts for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "Users delete own posts" on public.posts;
create policy "Users delete own posts"
on public.posts for delete
to authenticated
using (author_id = auth.uid());

drop policy if exists "Likes readable on readable posts" on public.post_likes;
create policy "Likes readable on readable posts"
on public.post_likes for select
to authenticated
using (public.can_read_post(post_id));

drop policy if exists "Users like readable posts once" on public.post_likes;
create policy "Users like readable posts once"
on public.post_likes for insert
to authenticated
with check (user_id = auth.uid() and public.can_read_post(post_id));

drop policy if exists "Users remove own likes" on public.post_likes;
create policy "Users remove own likes"
on public.post_likes for delete
to authenticated
using (user_id = auth.uid());

drop policy if exists "Comments readable on readable posts" on public.post_comments;
create policy "Comments readable on readable posts"
on public.post_comments for select
to authenticated
using (public.can_read_post(post_id));

drop policy if exists "Users comment on readable posts" on public.post_comments;
create policy "Users comment on readable posts"
on public.post_comments for insert
to authenticated
with check (author_id = auth.uid() and public.can_read_post(post_id));

drop policy if exists "Users update own comments" on public.post_comments;
create policy "Users update own comments"
on public.post_comments for update
to authenticated
using (author_id = auth.uid())
with check (author_id = auth.uid());

drop policy if exists "Users delete own comments" on public.post_comments;
create policy "Users delete own comments"
on public.post_comments for delete
to authenticated
using (author_id = auth.uid());

drop policy if exists "Messages visible to sender and recipient" on public.direct_messages;
create policy "Messages visible to sender and recipient"
on public.direct_messages for select
to authenticated
using (sender_id = auth.uid() or recipient_id = auth.uid());

drop policy if exists "Users message accepted friends" on public.direct_messages;
create policy "Users message accepted friends"
on public.direct_messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and public.are_accepted_friends(sender_id, recipient_id)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-images',
  'post-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Post image uploads by owner" on storage.objects;
create policy "Post image uploads by owner"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Post image reads through readable posts" on storage.objects;
create policy "Post image reads through readable posts"
on storage.objects for select
to authenticated
using (
  bucket_id = 'post-images'
  and exists (
    select 1
    from public.posts p
    where p.image_path = storage.objects.name
      and (
        p.author_id = auth.uid()
        or public.are_accepted_friends(auth.uid(), p.author_id)
      )
  )
);

drop policy if exists "Post image deletes by owner" on storage.objects;
create policy "Post image deletes by owner"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'post-images'
  and (storage.foldername(name))[1] = auth.uid()::text
);
