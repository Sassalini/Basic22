import { HeartHandshake, ImagePlus, MessageCircle, Send, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { addComment, createPost, deletePost, toggleLike } from "@/app/home/actions";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { EmptyState } from "@/components/EmptyState";
import { SubmitButton } from "@/components/SubmitButton";
import { getProfileImageUrls } from "@/lib/profile-images";
import { createClient } from "@/lib/supabase/server";
import { formatRelativeTime } from "@/lib/utils";

type HomePageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

type PostRecord = {
  id: string;
  author_id: string;
  body: string;
  image_path: string | null;
  created_at: string;
};

type ProfileRecord = {
  about: string | null;
  avatar_url: string | null;
  id: string;
  display_name: string | null;
  username: string | null;
};

type LikeRecord = {
  post_id: string;
  user_id: string;
};

type CommentRecord = {
  id: string;
  post_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: postRecords } = await supabase
    .from("posts")
    .select("id, author_id, body, image_path, created_at")
    .order("created_at", { ascending: false })
    .limit(40);

  const posts = (postRecords ?? []) as PostRecord[];
  const postIds = posts.map((post) => post.id);
  const authorIds = new Set(posts.map((post) => post.author_id));
  let likes: LikeRecord[] = [];
  let comments: CommentRecord[] = [];

  if (postIds.length > 0) {
    const [{ data: likeRecords }, { data: commentRecords }] = await Promise.all([
      supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds),
      supabase
        .from("post_comments")
        .select("id, post_id, author_id, body, created_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    ]);

    likes = (likeRecords ?? []) as LikeRecord[];
    comments = (commentRecords ?? []) as CommentRecord[];
    comments.forEach((comment) => authorIds.add(comment.author_id));
  }

  const profileIds = Array.from(authorIds);
  let profiles = new Map<string, ProfileRecord>();

  if (profileIds.length > 0) {
    const { data: profileRecords } = await supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url, about")
      .in("id", profileIds);

    profiles = new Map(
      ((profileRecords ?? []) as ProfileRecord[]).map((profile) => [profile.id, profile])
    );
  }

  const profileImageUrls = await getProfileImageUrls(
    supabase,
    Array.from(profiles.values())
  );

  const likesByPost = new Map<string, LikeRecord[]>();
  likes.forEach((like) => {
    likesByPost.set(like.post_id, [...(likesByPost.get(like.post_id) ?? []), like]);
  });

  const commentsByPost = new Map<string, CommentRecord[]>();
  comments.forEach((comment) => {
    commentsByPost.set(comment.post_id, [
      ...(commentsByPost.get(comment.post_id) ?? []),
      comment
    ]);
  });

  const imageUrls = new Map<string, string>();
  await Promise.all(
    posts.map(async (post) => {
      if (!post.image_path) {
        return;
      }

      const { data } = await supabase.storage
        .from("post-images")
        .createSignedUrl(post.image_path, 60 * 10);

      if (data?.signedUrl) {
        imageUrls.set(post.id, data.signedUrl);
      }
    })
  );

  return (
    <AppShell title="Home">
      {params.message ? (
        <p className="mb-5 rounded-lg border border-[#0B7A46]/40 bg-[#0B7A46]/10 p-3 text-sm">
          {params.message}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <form
            action={createPost}
            encType="multipart/form-data"
            className="rounded-xl border border-[#124D33]/80 bg-[#06291B] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.30),0_0_36px_rgba(11,122,70,0.11)]"
          >
            <label className="sr-only" htmlFor="body">
              New post
            </label>
            <textarea
              id="body"
              name="body"
              required
              maxLength={2000}
              rows={4}
              placeholder="What would you like to share with friends?"
              className="w-full resize-none rounded-lg border border-[#124D33]/80 bg-[#021A12] p-3 text-sm leading-6 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#166B45]"
            />
            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-[#124D33]/80 px-3 text-sm text-brg-muted transition hover:border-[#166B45] hover:text-brg-text">
                <ImagePlus size={17} />
                Add image
                <input
                  name="image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                />
              </label>
              <SubmitButton pendingLabel="Posting...">Post</SubmitButton>
            </div>
          </form>

          {posts.length === 0 ? (
            <EmptyState
              title="No posts yet"
              body="Your feed will show your posts and posts from accepted friends, newest first."
            />
          ) : (
            posts.map((post) => {
              const profile = profiles.get(post.author_id);
              const postLikes = likesByPost.get(post.id) ?? [];
              const userLiked = postLikes.some((like) => like.user_id === user.id);
              const postComments = commentsByPost.get(post.id) ?? [];

              return (
                <article
                  key={post.id}
                  className="rounded-xl border border-[#124D33]/80 bg-[#07351F] p-4 shadow-[0_18px_55px_rgba(0,0,0,0.30),0_0_36px_rgba(11,122,70,0.12)]"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      imageUrl={profile ? profileImageUrls.get(profile.id) : null}
                      name={profile?.display_name ?? profile?.username}
                      size="lg"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <h2 className="font-semibold">
                          {profile?.display_name ?? "Basic22 user"}
                        </h2>
                        <p className="text-xs text-brg-muted">@{profile?.username ?? "user"}</p>
                        <p className="text-xs text-brg-muted">
                          {formatRelativeTime(post.created_at)}
                        </p>
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-brg-text">
                        {post.body}
                      </p>
                    </div>
                    {post.author_id === user.id ? (
                      <form action={deletePost} className="shrink-0">
                        <input type="hidden" name="post_id" value={post.id} />
                        <button
                          type="submit"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-brg-muted transition hover:bg-white/[0.04] hover:text-brg-text focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
                          aria-label="Delete post"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    ) : null}
                  </div>

                  {imageUrls.get(post.id) ? (
                    // Private signed Supabase URLs are short-lived, so this avoids remote image config.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageUrls.get(post.id)}
                      alt=""
                      className="mt-4 max-h-[520px] w-full rounded-xl border border-[#124D33]/80 object-cover"
                    />
                  ) : null}

                  <div className="mt-4 flex items-center gap-3 text-sm text-brg-muted">
                    <form action={toggleLike}>
                      <input type="hidden" name="post_id" value={post.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 transition hover:bg-white/[0.04] hover:text-brg-text"
                        aria-label={userLiked ? "Remove like" : "Like post"}
                      >
                        <HeartHandshake
                          size={17}
                          className={userLiked ? "text-[#0B7A46]" : ""}
                        />
                        {postLikes.length}
                      </button>
                    </form>
                    <span className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2">
                      <MessageCircle size={17} />
                      {postComments.length}
                    </span>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-[#124D33]/70 pt-4">
                    {postComments.map((comment) => {
                      const author = profiles.get(comment.author_id);
                      return (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar
                            className="bg-white/[0.05]"
                            imageUrl={author ? profileImageUrls.get(author.id) : null}
                            name={author?.display_name ?? author?.username}
                            size="sm"
                          />
                          <div className="min-w-0 rounded-lg border border-[#124D33]/45 bg-[#021A12]/75 px-3 py-2">
                            <p className="text-xs font-semibold">
                              {author?.display_name ?? "Basic22 user"}
                            </p>
                            <p className="mt-1 whitespace-pre-wrap text-sm leading-5">
                              {comment.body}
                            </p>
                          </div>
                        </div>
                      );
                    })}

                    <form action={addComment} className="flex gap-2">
                      <input type="hidden" name="post_id" value={post.id} />
                      <label className="sr-only" htmlFor={`comment-${post.id}`}>
                        Add comment
                      </label>
                      <input
                        id={`comment-${post.id}`}
                        name="body"
                        required
                        maxLength={1000}
                        placeholder="Write a comment"
                        className="min-h-11 flex-1 rounded-lg border border-[#124D33]/80 bg-[#021A12] px-3 text-sm outline-none transition placeholder:text-brg-muted focus:border-[#166B45]"
                      />
                      <button
                        type="submit"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brg-accent transition hover:bg-brg-accentHover"
                        aria-label="Send comment"
                      >
                        <Send size={17} />
                      </button>
                    </form>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="space-y-4">
          <div className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm">
            <h2 className="font-semibold">Feed rules</h2>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-brg-muted">
              <li>Only your posts and accepted friends appear here.</li>
              <li>Newest posts appear first.</li>
              <li>No recommendation algorithm or public discovery.</li>
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
