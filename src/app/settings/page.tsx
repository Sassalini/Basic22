import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import { updateProfile } from "@/app/settings/actions";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { SubmitButton } from "@/components/SubmitButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { getProfileImageUrls } from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/server";

type SettingsPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

type ProfileRecord = {
  about: string | null;
  avatar_url: string | null;
  display_name: string | null;
  id: string;
  username: string | null;
  email: string | null;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, username, email, avatar_url, about")
    .eq("id", user.id)
    .maybeSingle();

  const profile = data as ProfileRecord | null;
  const profileImageUrls = await getProfileImageUrls(supabase, [
    { id: user.id, avatar_url: profile?.avatar_url ?? null }
  ]);
  const profileImageUrl = profileImageUrls.get(user.id);
  const displayName = profile?.display_name ?? user.email ?? "Basic22 user";

  return (
    <AppShell title="Settings">
      {params.message ? (
        <p className="mb-5 rounded-lg border border-[#0B7A46]/40 bg-[#0B7A46]/10 p-3 text-sm">
          {params.message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
          <h2 className="text-lg font-semibold">Profile settings</h2>
          <p className="mt-2 text-sm leading-6 text-brg-muted">
            These details are used inside friend search and private conversations.
          </p>

          <div className="mt-6 flex items-center gap-4 rounded-xl border border-brg-border bg-white/[0.03] p-4">
            <Avatar imageUrl={profileImageUrl} name={displayName} size="xl" />
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{displayName}</p>
              <p className="text-sm text-brg-muted">@{profile?.username ?? "basic22"}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-brg-muted">
                {profile?.about || "Add a short about section for friends to recognise you."}
              </p>
            </div>
          </div>

          <form action={updateProfile} encType="multipart/form-data" className="mt-6 grid gap-4">
            <label className="grid gap-2 text-sm">
              Profile photo
              <input
                name="avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 py-2 text-brg-muted file:mr-3 file:rounded-md file:border-0 file:bg-brg-accent file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brg-text"
              />
              <span className="text-xs text-brg-muted">JPG, PNG, WebP, or GIF up to 5MB.</span>
            </label>
            <label className="grid gap-2 text-sm">
              Display name
              <input
                required
                name="display_name"
                defaultValue={profile?.display_name ?? ""}
                className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Username
              <input
                required
                name="username"
                pattern="[a-zA-Z0-9_]{3,24}"
                defaultValue={profile?.username ?? ""}
                className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
              />
            </label>
            <label className="grid gap-2 text-sm">
              About
              <textarea
                name="about"
                maxLength={160}
                rows={4}
                defaultValue={profile?.about ?? ""}
                placeholder="A quiet note about you"
                className="resize-none rounded-lg border border-brg-border bg-black/10 px-3 py-2 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Email
              <input
                disabled
                value={profile?.email ?? user.email ?? ""}
                className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-muted outline-none"
              />
            </label>
            <SubmitButton pendingLabel="Saving...">Save settings</SubmitButton>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
            <h2 className="text-lg font-semibold">Theme</h2>
            <p className="mt-2 text-sm leading-6 text-brg-muted">
              Choose light mode or dark mode.
            </p>
            <div className="mt-4">
              <ThemeToggle />
            </div>
          </section>

          <section className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
            <h2 className="text-lg font-semibold">Session</h2>
            <p className="mt-2 text-sm leading-6 text-brg-muted">
              Sign out of this browser when you are finished.
            </p>
            <form action={signOut} className="mt-4">
              <button
                type="submit"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-brg-border px-4 text-sm font-semibold transition hover:border-[#0B7A46]/60"
              >
                Log out
              </button>
            </form>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
