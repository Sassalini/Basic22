/* eslint-disable @next/next/no-img-element */
import { ArrowLeft, MessageCircle, Settings } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import {
  getProfileGalleryImageUrls,
  getProfileImageUrls
} from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";

type FriendProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ProfileRecord = {
  about: string | null;
  avatar_url: string | null;
  display_name: string | null;
  id: string;
  username: string | null;
};

type FriendshipRecord = {
  addressee_id: string;
  requester_id: string;
};

type GalleryImageRecord = {
  created_at: string;
  id: string;
  image_path: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export default async function FriendProfilePage({ params }: FriendProfilePageProps) {
  const { id } = await params;

  if (!isUuid(id)) {
    redirect("/friends?message=Profile not found.");
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  let canView = id === user.id;

  if (!canView) {
    const { data: friendshipRows } = await supabase
      .from("friendships")
      .select("requester_id, addressee_id")
      .eq("status", "accepted")
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const friendships = (friendshipRows ?? []) as FriendshipRecord[];
    canView = friendships.some(
      (friendship) =>
        (friendship.requester_id === user.id && friendship.addressee_id === id) ||
        (friendship.requester_id === id && friendship.addressee_id === user.id)
    );
  }

  if (!canView) {
    redirect("/friends?message=Friend profile not available.");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url, about")
    .eq("id", id)
    .maybeSingle();

  const profile = profileRow as ProfileRecord | null;

  if (!profile) {
    redirect("/friends?message=Profile not found.");
  }

  const [{ data: galleryRows }, profileImageUrls] = await Promise.all([
    supabase
      .from("profile_gallery_images")
      .select("id, image_path, created_at")
      .eq("owner_id", id)
      .order("created_at", { ascending: false }),
    getProfileImageUrls(supabase, [profile])
  ]);

  const galleryImages = (galleryRows ?? []) as GalleryImageRecord[];
  const galleryImageUrls = await getProfileGalleryImageUrls(supabase, galleryImages);
  const displayName = profile.display_name ?? profile.username ?? "Basic22 user";

  return (
    <AppShell title="Friend Profile">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Link
          href="/friends"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brg-border px-3 text-sm text-brg-muted transition hover:border-[#0B7A46]/60 hover:text-brg-text"
        >
          <ArrowLeft size={16} />
          Friends
        </Link>
        {id === user.id ? (
          <Link
            href="/settings"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brg-accent px-3 text-sm font-semibold transition hover:bg-brg-accentHover"
          >
            <Settings size={16} />
            Settings
          </Link>
        ) : (
          <Link
            href={`/messages?friend=${id}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brg-accent px-3 text-sm font-semibold transition hover:bg-brg-accentHover"
          >
            <MessageCircle size={16} />
            Message
          </Link>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <section className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
          <div className="flex items-center gap-4">
            <Avatar
              imageUrl={profileImageUrls.get(profile.id)}
              name={displayName}
              size="xl"
            />
            <div className="min-w-0">
              <h2 className="truncate text-xl font-semibold">{displayName}</h2>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-brg-border bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold">About</h3>
            <p className="mt-2 text-sm leading-6 text-brg-muted">
              {profile.about || "No about note yet."}
            </p>
          </div>
        </section>

        <section className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
          <h2 className="text-lg font-semibold">Profile images</h2>
          {galleryImages.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                title="No images shared"
                body={
                  id === user.id
                    ? "Add profile images from Settings."
                    : "This friend has not shared profile images yet."
                }
              />
            </div>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                    <figcaption className="px-3 py-2 text-xs text-brg-muted">
                      {formatRelativeTime(image.created_at)}
                    </figcaption>
                  </figure>
                ) : null;
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
