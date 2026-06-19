import { Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deleteDirectMessage, sendDirectMessage } from "@/app/messages/actions";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { MessageScroller } from "@/components/MessageScroller";
import { getProfileImageUrls } from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/server";
import { classNames, formatDateTime } from "@/lib/utils";

type MessagesPageProps = {
  searchParams: Promise<{
    friend?: string;
    message?: string;
  }>;
};

type FriendshipRecord = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "rejected";
};

type ProfileRecord = {
  about: string | null;
  avatar_url: string | null;
  id: string;
  display_name: string | null;
  username: string | null;
};

type MessageRecord = {
  deleted_at: string | null;
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
};

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: friendshipRows } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status")
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  const friendships = (friendshipRows ?? []) as FriendshipRecord[];
  const friendIds = friendships.map((friendship) =>
    friendship.requester_id === user.id ? friendship.addressee_id : friendship.requester_id
  );

  let friends = new Map<string, ProfileRecord>();
  if (friendIds.length > 0) {
    const { data: profileRows } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, about")
      .in("id", friendIds);

    friends = new Map(
      ((profileRows ?? []) as ProfileRecord[]).map((profile) => [profile.id, profile])
    );
  }

  const profileImageUrls = await getProfileImageUrls(supabase, Array.from(friends.values()));

  const selectedFriendId = friendIds.includes(params.friend ?? "")
    ? params.friend ?? null
    : friendIds[0] ?? null;

  let messages: MessageRecord[] = [];
  if (selectedFriendId) {
    const { data: messageRows } = await supabase
      .from("direct_messages")
      .select("id, sender_id, recipient_id, body, created_at, deleted_at")
      .or(`sender_id.eq.${selectedFriendId},recipient_id.eq.${selectedFriendId}`)
      .order("created_at", { ascending: true })
      .limit(100);

    messages = (messageRows ?? []) as MessageRecord[];
  }

  const selectedFriend = selectedFriendId ? friends.get(selectedFriendId) : null;

  return (
    <AppShell title="Messages">
      {params.message ? (
        <p className="mb-5 rounded-lg border border-[#0B7A46]/40 bg-[#0B7A46]/10 p-3 text-sm">
          {params.message}
        </p>
      ) : null}

      <div className="grid h-[calc(100svh-12rem)] min-h-[520px] overflow-hidden rounded-xl border border-brg-border bg-brg-panel/80 shadow-calm lg:h-[calc(100svh-8rem)] lg:min-h-[560px] lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="min-h-0 border-b border-brg-border p-4 lg:border-b-0 lg:border-r">
          <h2 className="font-semibold">Accepted friends</h2>
          <div className="calm-scrollbar mt-4 max-h-40 space-y-2 overflow-y-auto pr-1 lg:max-h-none">
            {friendIds.length === 0 ? (
              <p className="text-sm text-brg-muted">
                Add an accepted friend before starting a message.
              </p>
            ) : (
              friendIds.map((friendId) => {
                const friend = friends.get(friendId);
                const active = friendId === selectedFriendId;
                return (
                  <Link
                    key={friendId}
                    href={`/messages?friend=${friendId}`}
                    className={classNames(
                      "flex items-center gap-3 rounded-lg border border-transparent p-3 text-sm transition hover:bg-white/[0.04]",
                      active && "border-brg-border bg-white/[0.05]"
                    )}
                  >
                    <Avatar
                      imageUrl={friend ? profileImageUrls.get(friend.id) : null}
                      name={friend?.display_name ?? friend?.username}
                      size="md"
                    />
                    <div>
                      <p className="font-semibold text-brg-text">
                        {friend?.display_name ?? "Basic22 user"}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </aside>

        <section className="flex min-h-0 flex-col">
          {selectedFriendId ? (
            <>
              <header className="border-b border-brg-border p-4">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/friends/${selectedFriendId}`}
                    className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
                    aria-label="Open friend profile"
                  >
                    <Avatar
                      imageUrl={
                        selectedFriend ? profileImageUrls.get(selectedFriend.id) : null
                      }
                      name={selectedFriend?.display_name ?? selectedFriend?.username}
                      size="md"
                    />
                  </Link>
                  <div>
                    <p className="text-sm text-brg-muted">Conversation with</p>
                    <Link
                      href={`/friends/${selectedFriendId}`}
                      className="text-lg font-semibold transition hover:text-[#9FE7BE]"
                    >
                      {selectedFriend?.display_name ??
                        selectedFriend?.username ??
                        "Basic22 user"}
                    </Link>
                    {selectedFriend?.about ? (
                      <p className="mt-1 text-sm leading-6 text-brg-muted">
                        {selectedFriend.about}
                      </p>
                    ) : null}
                  </div>
                </div>
              </header>

              <MessageScroller className="calm-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
                {messages.length === 0 ? (
                  <EmptyState
                    title="No messages yet"
                    body="Send the first quiet note. Messages are only between accepted friends."
                  />
                ) : (
                  messages.map((message) => {
                    const mine = message.sender_id === user.id;
                    const deleted = Boolean(message.deleted_at);
                    return (
                      <div
                        key={message.id}
                        className={classNames("flex", mine ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={classNames(
                            "max-w-[84%] rounded-2xl border px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.18)] sm:max-w-[76%]",
                            deleted
                              ? "message-bubble-deleted"
                              : mine
                              ? "message-bubble-sent"
                              : "message-bubble-received"
                          )}
                        >
                          <p
                            className={classNames(
                              "whitespace-pre-wrap text-sm leading-6",
                              deleted && "italic"
                            )}
                          >
                            {deleted ? "Message deleted" : message.body}
                          </p>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <p className="text-xs message-timestamp">
                              {formatDateTime(message.created_at)}
                            </p>
                            {mine && !deleted ? (
                              <form action={deleteDirectMessage}>
                                <input type="hidden" name="message_id" value={message.id} />
                                <input
                                  type="hidden"
                                  name="friend_id"
                                  value={selectedFriendId}
                                />
                                <button
                                  type="submit"
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md opacity-75 transition hover:bg-white/[0.08] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
                                  aria-label="Delete message"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </form>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </MessageScroller>

              <form action={sendDirectMessage} className="flex gap-2 border-t border-brg-border p-4">
                <input type="hidden" name="recipient_id" value={selectedFriendId} />
                <label className="sr-only" htmlFor="body">
                  Message
                </label>
                <input
                  id="body"
                  name="body"
                  required
                  maxLength={2000}
                  placeholder="Type a message"
                  className="feed-inner-surface min-h-11 flex-1 rounded-lg px-3 text-sm outline-none transition placeholder:text-brg-muted focus:border-[#2C8B54]"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brg-accent transition hover:bg-brg-accentHover"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-6">
              <EmptyState
                title="No conversations"
                body="Messages unlock after a friend request is accepted."
              />
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
