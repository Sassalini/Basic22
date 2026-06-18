alter table public.direct_messages
add column if not exists deleted_at timestamptz,
add column if not exists deleted_by uuid references public.profiles(id) on delete set null;

create or replace function public.delete_direct_message(message_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to delete messages.';
  end if;

  update public.direct_messages
  set
    body = 'Message deleted',
    deleted_at = now(),
    deleted_by = auth.uid()
  where id = message_id
    and sender_id = auth.uid()
    and deleted_at is null;

  if not found then
    raise exception 'Message not found or cannot be deleted.';
  end if;
end;
$$;

revoke all on function public.delete_direct_message(uuid) from public;
grant execute on function public.delete_direct_message(uuid) to authenticated;

create table if not exists public.profile_gallery_images (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  image_path text not null unique,
  created_at timestamptz not null default now()
);

create index if not exists profile_gallery_images_owner_created_at_idx
on public.profile_gallery_images (owner_id, created_at desc);

alter table public.profile_gallery_images enable row level security;

drop policy if exists "Profile gallery readable by owner and accepted friends" on public.profile_gallery_images;
create policy "Profile gallery readable by owner and accepted friends"
on public.profile_gallery_images for select
to authenticated
using (
  owner_id = auth.uid()
  or public.are_accepted_friends(auth.uid(), owner_id)
);

drop policy if exists "Users add own profile gallery images" on public.profile_gallery_images;
create policy "Users add own profile gallery images"
on public.profile_gallery_images for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists "Users delete own profile gallery images" on public.profile_gallery_images;
create policy "Users delete own profile gallery images"
on public.profile_gallery_images for delete
to authenticated
using (owner_id = auth.uid());

create or replace function public.storage_owner_id(object_name text)
returns uuid
language plpgsql
stable
security definer
set search_path = public, storage
as $$
declare
  owner_text text;
begin
  owner_text := (storage.foldername(object_name))[1];

  if owner_text is null then
    return null;
  end if;

  return owner_text::uuid;
exception
  when invalid_text_representation then
    return null;
end;
$$;

revoke all on function public.storage_owner_id(text) from public;
grant execute on function public.storage_owner_id(text) to authenticated;

drop policy if exists "Profile image reads by signed in users" on storage.objects;
drop policy if exists "Profile image reads by owner and accepted friends" on storage.objects;
create policy "Profile image reads by owner and accepted friends"
on storage.objects for select
to authenticated
using (
  bucket_id = 'profile-images'
  and (
    public.storage_owner_id(storage.objects.name) = auth.uid()
    or public.are_accepted_friends(auth.uid(), public.storage_owner_id(storage.objects.name))
  )
);

drop policy if exists "Profiles readable by signed in users" on public.profiles;
drop policy if exists "Profiles readable by self and accepted friends" on public.profiles;
create policy "Profiles readable by self and accepted friends"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or public.are_accepted_friends(auth.uid(), id)
);

create or replace function public.friendship_profile_summaries()
returns table (
  id uuid,
  display_name text,
  username text,
  avatar_url text,
  about text,
  relationship_status text
)
language sql
stable
security definer
set search_path = public
as $$
  with related as (
    select
      f.*,
      case
        when f.requester_id = auth.uid() then f.addressee_id
        else f.requester_id
      end as profile_id,
      case f.status
        when 'accepted' then 1
        when 'pending' then 2
        else 3
      end as status_rank
    from public.friendships f
    where auth.uid() is not null
      and (f.requester_id = auth.uid() or f.addressee_id = auth.uid())
  )
  select distinct on (p.id)
    p.id,
    p.display_name,
    p.username,
    case
      when related.status = 'accepted' then p.avatar_url
      else null
    end as avatar_url,
    case
      when related.status = 'accepted' then p.about
      else null
    end as about,
    related.status as relationship_status
  from related
  join public.profiles p on p.id = related.profile_id
  order by p.id, related.status_rank, related.created_at desc;
$$;

revoke all on function public.friendship_profile_summaries() from public;
grant execute on function public.friendship_profile_summaries() to authenticated;

create or replace function public.search_profiles_for_friends(search_term text)
returns table (
  id uuid,
  display_name text,
  username text,
  avatar_url text,
  about text,
  relationship_status text
)
language sql
stable
security definer
set search_path = public
as $$
  with term as (
    select lower(trim(coalesce(search_term, ''))) as query
  )
  select
    p.id,
    p.display_name,
    p.username,
    case
      when coalesce(rel.status, 'none') = 'accepted' then p.avatar_url
      else null
    end as avatar_url,
    case
      when coalesce(rel.status, 'none') = 'accepted' then p.about
      else null
    end as about,
    coalesce(rel.status, 'none') as relationship_status
  from public.profiles p
  cross join term
  left join lateral (
    select f.status
    from public.friendships f
    where (f.requester_id = auth.uid() and f.addressee_id = p.id)
       or (f.requester_id = p.id and f.addressee_id = auth.uid())
    order by
      case f.status
        when 'accepted' then 1
        when 'pending' then 2
        else 3
      end,
      f.created_at desc
    limit 1
  ) rel on true
  where auth.uid() is not null
    and p.id <> auth.uid()
    and char_length(term.query) >= 3
    and (
      lower(p.username) like '%' || term.query || '%'
      or lower(p.display_name) like '%' || term.query || '%'
      or lower(coalesce(p.email, '')) like '%' || term.query || '%'
    )
  order by
    case when lower(p.username) = term.query then 0 else 1 end,
    p.username
  limit 8;
$$;

revoke all on function public.search_profiles_for_friends(text) from public;
grant execute on function public.search_profiles_for_friends(text) to authenticated;
