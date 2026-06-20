/* eslint-disable @next/next/no-img-element */
import { ImagePlus, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "@/app/auth/actions";
import {
  deleteProfileGalleryImage,
  updateEmail,
  updateProfile,
  uploadProfileGalleryImage
} from "@/app/settings/actions";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { SubmitButton } from "@/components/SubmitButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  getProfileGalleryImageUrls,
  getProfileImageUrls
} from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";

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

type GalleryImageRecord = {
  created_at: string;
  id: string;
  image_path: string;
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
  const [{ data: galleryRows }, profileImageUrls] = await Promise.all([
    supabase
      .from("profile_gallery_images")
      .select("id, image_path, created_at")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false }),
    getProfileImageUrls(supabase, [
      { id: user.id, avatar_url: profile?.avatar_url ?? null }
    ])
  ]);
  const galleryImages = (galleryRows ?? []) as GalleryImageRecord[];
  const galleryImageUrls = await getProfileGalleryImageUrls(supabase, galleryImages);
  const profileImageUrl = profileImageUrls.get(user.id);
  const displayName = profile?.display_name ?? user.email ?? "Basic22 user";
  const currentEmail = user.email ?? profile?.email ?? "";

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
                value={currentEmail}
                className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-muted outline-none"
              />
            </label>
            <SubmitButton pendingLabel="Saving...">Save settings</SubmitButton>
          </form>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
            <h2 className="text-lg font-semibold">Account email</h2>
            <p className="mt-2 text-sm leading-6 text-brg-muted">
              Change the email you use to sign in. Basic22 keeps your current email until
              Supabase confirms the change.
            </p>
            <div className="mt-4 rounded-lg border border-brg-border bg-white/[0.03] p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-brg-muted">
                Current email
              </p>
              <p className="mt-1 break-all text-sm font-semibold text-brg-text">
                {currentEmail || "No email available"}
              </p>
            </div>
            <form action={updateEmail} className="mt-4 grid gap-3">
              <label className="grid gap-2 text-sm">
                New email
                <input
                  required
                  name="new_email"
                  type="email"
                  autoComplete="email"
                  className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
                  placeholder="new@example.com"
                />
                <span className="text-xs leading-5 text-brg-muted">
                  Check your new inbox after saving. Secure email change may require
                  confirmation from both old and new email addresses.
                </span>
              </label>
              <SubmitButton pendingLabel="Updating email...">Save email</SubmitButton>
            </form>
          </section>

          <section className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
            <h2 className="text-lg font-semibold">Profile images</h2>
            <form
              action={uploadProfileGalleryImage}
              encType="multipart/form-data"
              className="mt-4 grid gap-3"
            >
              <label className="grid gap-2 text-sm">
                Add image
                <input
                  name="gallery_image"
                  type="file"
                  required
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 py-2 text-brg-muted file:mr-3 file:rounded-md file:border-0 file:bg-brg-accent file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-brg-text"
                />
                <span className="text-xs text-brg-muted">
                  Shared only with accepted friends. JPG, PNG, WebP, or GIF up to 5MB.
                </span>
              </label>
              <SubmitButton pendingLabel="Uploading..." className="gap-2">
                <ImagePlus size={16} />
                Add image
              </SubmitButton>
            </form>

            {galleryImages.length > 0 ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {galleryImages.map((image) => {
                  const imageUrl = galleryImageUrls.get(image.id);

                  return imageUrl ? (
                    <figure
                      key={image.id}
                      className="overflow-hidden rounded-lg border border-brg-border bg-black/10"
                    >
                      <img
                        src={imageUrl}
                        alt=""
                        className="aspect-square w-full object-cover"
                      />
                      <figcaption className="flex items-center justify-between gap-2 px-2 py-2 text-xs text-brg-muted">
                        <span>{formatRelativeTime(image.created_at)}</span>
                        <form action={deleteProfileGalleryImage}>
                          <input type="hidden" name="image_id" value={image.id} />
                          <button
                            type="submit"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-white/[0.06] hover:text-brg-text focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
                            aria-label="Delete profile image"
                          >
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </figcaption>
                    </figure>
                  ) : null;
                })}
              </div>
            ) : null}
          </section>

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
