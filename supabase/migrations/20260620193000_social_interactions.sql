alter table public.posts
drop constraint if exists posts_body_check,
drop constraint if exists posts_body_or_image_check;

alter table public.posts
add constraint posts_body_or_image_check
check (
  char_length(trim(body)) between 1 and 2000
  or (
    char_length(trim(body)) = 0
    and image_path is not null
  )
);

alter table public.post_comments
add column if not exists parent_comment_id uuid references public.post_comments(id) on delete cascade,
add column if not exists deleted_at timestamptz,
add column if not exists deleted_by uuid references public.profiles(id) on delete set null;

create index if not exists post_comments_parent_created_at_idx
on public.post_comments (parent_comment_id, created_at asc);

create table if not exists public.comment_likes (
  comment_id uuid not null references public.post_comments(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

alter table public.comment_likes enable row level security;

create or replace function public.can_reply_to_comment(
  target_parent_comment_id uuid,
  target_post_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    target_parent_comment_id is null
    or exists (
      select 1
      from public.post_comments c
      where c.id = target_parent_comment_id
        and c.post_id = target_post_id
        and c.parent_comment_id is null
        and public.can_read_post(c.post_id)
    );
$$;

revoke all on function public.can_reply_to_comment(uuid, uuid) from public;
grant execute on function public.can_reply_to_comment(uuid, uuid) to authenticated;

drop policy if exists "Users comment on readable posts" on public.post_comments;
create policy "Users comment on readable posts"
on public.post_comments for insert
to authenticated
with check (
  author_id = auth.uid()
  and public.can_read_post(post_id)
  and public.can_reply_to_comment(parent_comment_id, post_id)
);

drop policy if exists "Comment likes readable on readable posts" on public.comment_likes;
create policy "Comment likes readable on readable posts"
on public.comment_likes for select
to authenticated
using (
  exists (
    select 1
    from public.post_comments c
    where c.id = comment_likes.comment_id
      and public.can_read_post(c.post_id)
  )
);

drop policy if exists "Users like readable comments once" on public.comment_likes;
create policy "Users like readable comments once"
on public.comment_likes for insert
to authenticated
with check (
  user_id = auth.uid()
  and exists (
    select 1
    from public.post_comments c
    where c.id = comment_likes.comment_id
      and c.deleted_at is null
      and public.can_read_post(c.post_id)
  )
);

drop policy if exists "Users remove own comment likes" on public.comment_likes;
create policy "Users remove own comment likes"
on public.comment_likes for delete
to authenticated
using (user_id = auth.uid());

create or replace function public.delete_post_comment(target_comment_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  reply_count integer;
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to delete comments.';
  end if;

  select count(*)
  into reply_count
  from public.post_comments c
  where c.parent_comment_id = target_comment_id;

  if reply_count > 0 then
    update public.post_comments
    set
      body = 'Comment deleted',
      deleted_at = now(),
      deleted_by = auth.uid()
    where id = target_comment_id
      and author_id = auth.uid()
      and deleted_at is null;

    if not found then
      raise exception 'Comment not found or cannot be deleted.';
    end if;

    delete from public.comment_likes
    where comment_likes.comment_id = target_comment_id;
  else
    delete from public.post_comments
    where id = target_comment_id
      and author_id = auth.uid();

    if not found then
      raise exception 'Comment not found or cannot be deleted.';
    end if;
  end if;
end;
$$;

revoke all on function public.delete_post_comment(uuid) from public;
grant execute on function public.delete_post_comment(uuid) to authenticated;

alter table public.direct_messages
add column if not exists read_at timestamptz;

create index if not exists direct_messages_recipient_unread_idx
on public.direct_messages (recipient_id, read_at, created_at desc)
where read_at is null and deleted_at is null;

create or replace function public.mark_conversation_read(friend_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    raise exception 'You must be signed in to read messages.';
  end if;

  if not public.are_accepted_friends(auth.uid(), friend_id) then
    raise exception 'Conversation not found.';
  end if;

  update public.direct_messages
  set read_at = now()
  where sender_id = friend_id
    and recipient_id = auth.uid()
    and read_at is null
    and deleted_at is null;
end;
$$;

revoke all on function public.mark_conversation_read(uuid) from public;
grant execute on function public.mark_conversation_read(uuid) to authenticated;
