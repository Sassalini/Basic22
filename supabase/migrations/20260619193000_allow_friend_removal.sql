drop policy if exists "Users delete accepted friendships" on public.friendships;
create policy "Users delete accepted friendships"
on public.friendships for delete
to authenticated
using (
  status = 'accepted'
  and (requester_id = auth.uid() or addressee_id = auth.uid())
);
