import { HeartHandshake, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { deletePost, toggleLike } from "@/app/home/actions";
import { AppShell } from "@/components/AppShell";
import { Avatar } from "@/components/Avatar";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";
import { CreatePostForm } from "@/components/CreatePostForm";
import { EmptyState } from "@/components/EmptyState";
import { PostComments, type PostCommentView } from "@/components/PostComments";
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
  author_id: string;
  body: string;
  created_at: string;
  deleted_at: string | null;
  id: string;
  parent_comment_id: string | null;
  post_id: string;
};

type CommentLikeRecord = {
  comment_id: string;
  user_id: string;
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
  let commentLikes: CommentLikeRecord[] = [];

  if (postIds.length > 0) {
    const [{ data: likeRecords }, { data: commentRecords }] = await Promise.all([
      supabase.from("post_likes").select("post_id, user_id").in("post_id", postIds),
      supabase
        .from("post_comments")
        .select("id, post_id, parent_comment_id, author_id, body, created_at, deleted_at")
        .in("post_id", postIds)
        .order("created_at", { ascending: true })
    ]);

    likes = (likeRecords ?? []) as LikeRecord[];
    comments = (commentRecords ?? []) as CommentRecord[];
    const commentIds = comments.map((comment) => comment.id);

    if (commentIds.length > 0) {
      const { data } = await supabase
        .from("comment_likes")
        .select("comment_id, user_id")
        .in("comment_id", commentIds);

      commentLikes = (data ?? []) as CommentLikeRecord[];
    }

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

  const commentLikesByComment = new Map<string, CommentLikeRecord[]>();
  commentLikes.forEach((like) => {
    commentLikesByComment.set(like.comment_id, [
      ...(commentLikesByComment.get(like.comment_id) ?? []),
      like
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
          <CreatePostForm />

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
              const visibleCommentCount = postComments.filter(
                (comment) => !comment.deleted_at
              ).length;
              const commentViews: PostCommentView[] = postComments.map((comment) => {
                const author = profiles.get(comment.author_id);
                const commentLikeRows = commentLikesByComment.get(comment.id) ?? [];

                return {
                  author: author
                    ? {
                        displayName: author.display_name,
                        id: author.id,
                        imageUrl: profileImageUrls.get(author.id) ?? null,
                        username: author.username
                      }
                    : null,
                  authorId: comment.author_id,
                  body: comment.body,
                  createdAt: comment.created_at,
                  currentUserLiked: commentLikeRows.some(
                    (like) => like.user_id === user.id
                  ),
                  deletedAt: comment.deleted_at,
                  id: comment.id,
                  likeCount: commentLikeRows.length,
                  parentCommentId: comment.parent_comment_id,
                  postId: comment.post_id
                };
              });

              return (
                <article
                  key={post.id}
                  className="feed-card-surface rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    {profile ? (
                      <Link
                        href={`/friends/${profile.id}`}
                        className="rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
                        aria-label="Open profile"
                      >
                        <Avatar
                          imageUrl={profileImageUrls.get(profile.id)}
                          name={profile.display_name ?? profile.username}
                          size="lg"
                        />
                      </Link>
                    ) : (
                      <Avatar name="Basic22 user" size="lg" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        {profile ? (
                          <Link
                            href={`/friends/${profile.id}`}
                            className="font-semibold feed-body-text transition hover:text-[#9FE7BE]"
                          >
                            {profile.display_name ?? "Basic22 user"}
                          </Link>
                        ) : (
                          <h2 className="font-semibold feed-body-text">Basic22 user</h2>
                        )}
                        <p className="text-xs feed-muted-text">
                          {formatRelativeTime(post.created_at)}
                        </p>
                      </div>
                      {post.body ? (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 feed-body-text">
                          {post.body}
                        </p>
                      ) : null}
                    </div>
                    {post.author_id === user.id ? (
                      <form action={deletePost} className="shrink-0">
                        <input type="hidden" name="post_id" value={post.id} />
                        <ConfirmSubmitButton
                          confirmMessage="Are you sure you want to delete this post?"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg feed-muted-text transition hover:bg-white/[0.06] hover:text-brg-text focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
                          aria-label="Delete post"
                        >
                          <Trash2 size={16} />
                        </ConfirmSubmitButton>
                      </form>
                    ) : null}
                  </div>

                  {imageUrls.get(post.id) ? (
                    <div className="mt-4 overflow-hidden rounded-xl border border-[color:var(--feed-card-border)] bg-[color:var(--feed-inner)]">
                      {/* Private signed Supabase URLs are short-lived, so this avoids remote image config. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrls.get(post.id)}
                        alt=""
                        className="max-h-[520px] w-full object-contain"
                      />
                    </div>
                  ) : null}

                  <div className="mt-4 flex items-center gap-3 text-sm feed-muted-text">
                    <form action={toggleLike}>
                      <input type="hidden" name="post_id" value={post.id} />
                      <button
                        type="submit"
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2 transition hover:bg-white/[0.06] hover:text-brg-text"
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
                      {visibleCommentCount}
                    </span>
                  </div>

                  <PostComments
                    comments={commentViews}
                    currentUserId={user.id}
                    postId={post.id}
                  />
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
