import { LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { Avatar } from "@/components/Avatar";
import { Logo } from "@/components/Logo";
import { NavLinks } from "@/components/NavLinks";
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

  return (
    <div className="min-h-screen bg-brg-bg text-brg-text">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-brg-border bg-black/10 p-5 lg:border-b-0 lg:border-r lg:p-6">
          <div className="flex items-center justify-between lg:block">
            <Logo />
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
            <NavLinks />
          </div>

          <div className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
            <NavLinks />
          </div>

          <div className="mt-10 hidden space-y-3 lg:block">
            <ThemeToggle />
            <form action={signOut}>
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
                  <p className="truncate text-xs text-brg-muted">@{profile?.username ?? "basic22"}</p>
                </div>
              </Link>
            </header>

            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
