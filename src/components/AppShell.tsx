import { LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Avatar } from "@/components/Avatar";
import { Logo } from "@/components/Logo";
import { NavLinks } from "@/components/NavLinks";
import { PublicFooter } from "@/components/PublicFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getProfileImageUrls } from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/server";

type AppShellProps = {
  children: React.ReactNode;
  title: string;
};

export async function AppShell({ children, title }: AppShellProps) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.display_name ?? user.email ?? "Basic22";
  const profileImageUrls = await getProfileImageUrls(supabase, [
    { id: user.id, avatar_url: profile?.avatar_url ?? null }
  ]);
  const profileImageUrl = profileImageUrls.get(user.id);
  const [{ count: incomingFriendRequestCount }, { data: acceptedFriendshipRows }] =
    await Promise.all([
      supabase
        .from("friendships")
        .select("id", { count: "exact", head: true })
        .eq("addressee_id", user.id)
        .eq("status", "pending"),
      supabase
        .from("friendships")
        .select("requester_id, addressee_id")
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    ]);
  const acceptedFriendIds = (acceptedFriendshipRows ?? []).map((friendship) =>
    friendship.requester_id === user.id ? friendship.addressee_id : friendship.requester_id
  );
  const { count: unreadMessageCount } =
    acceptedFriendIds.length > 0
      ? await supabase
          .from("direct_messages")
          .select("id", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .in("sender_id", acceptedFriendIds)
          .is("read_at", null)
          .is("deleted_at", null)
      : { count: 0 };
  const navBadges = {
    friends: incomingFriendRequestCount ?? 0,
    messages: unreadMessageCount ?? 0
  };

  return (
    <div className="min-h-screen bg-brg-bg text-brg-text">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="flex flex-col border-b border-brg-border bg-black/10 p-5 lg:sticky lg:top-0 lg:max-h-screen lg:min-h-screen lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between lg:block">
            <Logo href="/home" />
            <div className="lg:hidden">
              <Link
                href={`/friends/${user.id}`}
                className="block rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
                aria-label="Open your profile"
              >
                <Avatar
                  className="border border-brg-border bg-brg-panel"
                  imageUrl={profileImageUrl}
                  name={displayName}
                  size="md"
                />
              </Link>
            </div>
          </div>

          <div className="mt-7 hidden lg:block">
            <NavLinks badges={navBadges} />
          </div>

          <div className="mt-6 overflow-x-auto pb-1 lg:hidden [&>nav]:auto-cols-max [&>nav]:grid-flow-col">
            <NavLinks badges={navBadges} />
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-brg-border pt-4 sm:flex-row lg:mt-auto lg:flex-col lg:pt-5">
            <div className="sm:flex-1 lg:flex-none [&>button]:w-full">
              <ThemeToggle />
            </div>
            <form action={signOut} className="sm:flex-1 lg:flex-none">
              <button
                type="submit"
                className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-brg-muted transition hover:bg-white/[0.04] hover:text-brg-text"
              >
                <LogOut size={18} />
                Log out
              </button>
            </form>
          </div>
        </aside>

        <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl">
            <header className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-normal sm:text-3xl">
                  {title}
                </h1>
              </div>
              <Link
                href={`/friends/${user.id}`}
                className="hidden items-center gap-3 rounded-full border border-brg-border bg-brg-panel/70 px-3 py-2 transition hover:border-[#0B7A46]/60 lg:flex"
              >
                <Avatar imageUrl={profileImageUrl} name={displayName} size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{displayName}</p>
                  <p className="truncate text-xs text-brg-muted">View profile</p>
                </div>
              </Link>
            </header>

            {children}

            <PublicFooter variant="app" />
          </div>
        </main>
      </div>
    </div>
  );
}
