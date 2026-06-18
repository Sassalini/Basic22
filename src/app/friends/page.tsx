import { Check, Search, UserPlus, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  respondToFriendRequest,
  sendFriendRequest
} from "@/app/friends/actions";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { getProfileImageUrls } from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/server";
import { cleanSearchTerm, formatRelativeTime } from "@/lib/utils";

type FriendsPageProps = {
  searchParams: Promise<{
    q?: string;
    message?: string;
  }>;
};

type ProfileRecord = {
  about: string | null;
  avatar_url: string | null;
  id: string;
  display_name: string | null;
  username: string | null;
  relationship_status?: "pending" | "accepted" | "rejected" | "none";
};

type FriendshipRecord = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
};

export default async function FriendsPage({ searchParams }: FriendsPageProps) {
  const params = await searchParams;
  const query = cleanSearchTerm(params.q ?? "");
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: friendshipRows } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status, created_at")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const friendships = (friendshipRows ?? []) as FriendshipRecord[];
  const accepted = friendships.filter((friendship) => friendship.status === "accepted");
  const incoming = friendships.filter(
    (friendship) => friendship.status === "pending" && friendship.addressee_id === user.id
  );
  const outgoing = friendships.filter(
    (friendship) => friendship.status === "pending" && friendship.requester_id === user.id
  );

  let profiles = new Map<string, ProfileRecord>();
  const { data: profileRows } = await supabase.rpc("friendship_profile_summaries");
  profiles = new Map(
    ((profileRows ?? []) as ProfileRecord[]).map((profile) => [profile.id, profile])
  );

  let searchResults: ProfileRecord[] = [];
  if (query) {
    const { data } = await supabase.rpc("search_profiles_for_friends", {
      search_term: query
    });

    searchResults = (data ?? []) as ProfileRecord[];
  }

  const profileImageUrls = await getProfileImageUrls(supabase, [
    ...Array.from(profiles.values()),
    ...searchResults
  ]);

  function relationshipStatus(
    profileId: string,
    profileStatus?: ProfileRecord["relationship_status"]
  ) {
    if (profileStatus) {
      return profileStatus;
    }

    const existing = friendships.find(
      (friendship) =>
        friendship.requester_id === profileId || friendship.addressee_id === profileId
    );

    return existing?.status ?? "none";
  }

  return (
    <AppShell title="Friends">
      {params.message ? (
        <p className="mb-5 rounded-lg border border-[#0B7A46]/40 bg-[#0B7A46]/10 p-3 text-sm">
          {params.message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <form className="rounded-xl border border-brg-border bg-brg-panel/80 p-4 shadow-calm">
            <label htmlFor="q" className="text-sm font-semibold">
              Search by username, display name, or email
            </label>
            <div className="mt-3 flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brg-muted"
                />
                <input
                  id="q"
                  name="q"
                  defaultValue={query}
                  placeholder="maya@example.com or maya"
                  className="min-h-11 w-full rounded-lg border border-brg-border bg-black/10 pl-10 pr-3 text-sm outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-lg bg-brg-accent px-5 text-sm font-semibold transition hover:bg-brg-accentHover"
              >
                Search
              </button>
            </div>
          </form>

          {query ? (
            <div className="rounded-xl border border-brg-border bg-brg-panel/80 p-4 shadow-calm">
              <h2 className="font-semibold">Search results</h2>
              <div className="mt-4 space-y-3">
                {searchResults.length === 0 ? (
                  <p className="text-sm text-brg-muted">No people found for that search.</p>
                ) : (
                  searchResults.map((profile) => {
                    const status = relationshipStatus(profile.id, profile.relationship_status);
                    const canOpenProfile = status === "accepted";
                    return (
                      <div
                        key={profile.id}
                        className="flex flex-col gap-3 rounded-lg border border-brg-border bg-white/[0.03] p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        {canOpenProfile ? (
                          <Link
                            href={`/friends/${profile.id}`}
                            className="flex items-center gap-3 rounded-lg transition hover:bg-white/[0.04]"
                          >
                            <Avatar
                              imageUrl={profileImageUrls.get(profile.id)}
                              name={profile.display_name ?? profile.username}
                              size="md"
                            />
                            <div>
                              <p className="font-semibold">
                                {profile.display_name ?? profile.username ?? "Basic22 user"}
                              </p>
                              <p className="text-xs text-brg-muted">
                                @{profile.username ?? "user"}
                              </p>
                              {profile.about ? (
                                <p className="mt-1 text-xs leading-5 text-brg-muted">
                                  {profile.about}
                                </p>
                              ) : null}
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3">
                            <Avatar
                              imageUrl={profileImageUrls.get(profile.id)}
                              name={profile.display_name ?? profile.username}
                              size="md"
                            />
                            <div>
                              <p className="font-semibold">
                                {profile.display_name ?? profile.username ?? "Basic22 user"}
                              </p>
                              <p className="text-xs text-brg-muted">
                                @{profile.username ?? "user"}
                              </p>
                            </div>
                          </div>
                        )}
                        {status === "none" ? (
                          <form action={sendFriendRequest}>
                            <input type="hidden" name="addressee_id" value={profile.id} />
                            <button
                              type="submit"
                              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-brg-accent px-4 text-sm font-semibold transition hover:bg-brg-accentHover"
                            >
                              <UserPlus size={16} />
                              Add
                            </button>
                          </form>
                        ) : (
                          <span className="rounded-full border border-brg-border px-3 py-1 text-xs text-brg-muted">
                            {status}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : null}

          <div className="rounded-xl border border-brg-border bg-brg-panel/80 p-4 shadow-calm">
            <h2 className="font-semibold">Friend requests</h2>
            <div className="mt-4 space-y-3">
              {incoming.length === 0 ? (
                <p className="text-sm text-brg-muted">No incoming requests.</p>
              ) : (
                incoming.map((friendship) => {
                  const requester = profiles.get(friendship.requester_id);
                  return (
                    <div
                      key={friendship.id}
                      className="flex flex-col gap-3 rounded-lg border border-brg-border bg-white/[0.03] p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          imageUrl={requester ? profileImageUrls.get(requester.id) : null}
                          name={requester?.display_name ?? requester?.username}
                          size="md"
                        />
                        <div>
                          <p className="font-semibold">
                            {requester?.display_name ?? "Basic22 user"}
                          </p>
                          <p className="text-xs text-brg-muted">
                            @{requester?.username ?? "user"} -{" "}
                            {formatRelativeTime(friendship.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <form action={respondToFriendRequest}>
                          <input type="hidden" name="friendship_id" value={friendship.id} />
                          <input type="hidden" name="response" value="accepted" />
                          <button
                            type="submit"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brg-accent transition hover:bg-brg-accentHover"
                            aria-label="Accept friend request"
                          >
                            <Check size={17} />
                          </button>
                        </form>
                        <form action={respondToFriendRequest}>
                          <input type="hidden" name="friendship_id" value={friendship.id} />
                          <input type="hidden" name="response" value="rejected" />
                          <button
                            type="submit"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brg-border transition hover:border-[#0B7A46]/60"
                            aria-label="Reject friend request"
                          >
                            <X size={17} />
                          </button>
                        </form>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-xl border border-brg-border bg-brg-panel/80 p-4 shadow-calm">
            <h2 className="font-semibold">Accepted friends</h2>
            <div className="mt-4 space-y-3">
              {accepted.length === 0 ? (
                <EmptyState
                  title="No friends yet"
                  body="Search for someone you know, then send a request."
                />
              ) : (
                accepted.map((friendship) => {
                  const friendId =
                    friendship.requester_id === user.id
                      ? friendship.addressee_id
                      : friendship.requester_id;
                  const friend = profiles.get(friendId);
                  return (
                    <Link
                      key={friendship.id}
                      href={`/friends/${friendId}`}
                      className="flex items-center gap-3 rounded-lg border border-brg-border bg-white/[0.03] p-3"
                    >
                      <Avatar
                        imageUrl={friend ? profileImageUrls.get(friend.id) : null}
                        name={friend?.display_name ?? friend?.username}
                        size="md"
                      />
                      <div>
                        <p className="font-semibold">
                          {friend?.display_name ?? "Basic22 user"}
                        </p>
                        <p className="text-xs text-brg-muted">@{friend?.username ?? "user"}</p>
                        {friend?.about ? (
                          <p className="mt-1 text-xs leading-5 text-brg-muted">{friend.about}</p>
                        ) : null}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {outgoing.length > 0 ? (
            <div className="rounded-xl border border-brg-border bg-brg-panel/80 p-4 shadow-calm">
              <h2 className="font-semibold">Sent requests</h2>
              <div className="mt-4 space-y-3 text-sm text-brg-muted">
                {outgoing.map((friendship) => {
                  const addressee = profiles.get(friendship.addressee_id);
                  return (
                    <p key={friendship.id}>
                      @{addressee?.username ?? "user"} -{" "}
                      {formatRelativeTime(friendship.created_at)}
                    </p>
                  );
                })}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </AppShell>
  );
}
