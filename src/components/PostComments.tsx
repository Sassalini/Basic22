"use client";

import { HeartHandshake, Reply, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  addComment,
  deleteComment,
  toggleCommentLike
} from "@/app/home/actions";
import { Avatar } from "@/components/Avatar";
import { classNames, formatRelativeTime } from "@/lib/utils";

export type PostCommentView = {
  author: {
    displayName: string | null;
    id: string;
    imageUrl: string | null;
    username: string | null;
  } | null;
  authorId: string;
  body: string;
  createdAt: string;
  currentUserLiked: boolean;
  deletedAt: string | null;
  id: string;
  likeCount: number;
  parentCommentId: string | null;
  postId: string;
};

type PostCommentsProps = {
  comments: PostCommentView[];
  currentUserId: string;
  postId: string;
};

type CommentFormProps = {
  autoFocus?: boolean;
  onCancel?: () => void;
  parentCommentId?: string;
  postId: string;
  placeholder: string;
};

function CommentForm({
  autoFocus = false,
  onCancel,
  parentCommentId,
  postId,
  placeholder
}: CommentFormProps) {
  return (
    <form action={addComment} autoComplete="off" className="flex gap-2">
      <input type="hidden" name="post_id" value={postId} />
      {parentCommentId ? (
        <input type="hidden" name="parent_comment_id" value={parentCommentId} />
      ) : null}
      <label className="sr-only" htmlFor={`basic22-comment-${parentCommentId ?? postId}`}>
        {placeholder}
      </label>
      <input
        id={`basic22-comment-${parentCommentId ?? postId}`}
        name="basic22_comment_body"
        required
        maxLength={1000}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="sentences"
        spellCheck={true}
        placeholder={placeholder}
        className="feed-inner-surface min-h-11 flex-1 rounded-lg px-3 text-sm outline-none transition placeholder:text-brg-muted focus:border-[#2C8B54]"
      />
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[color:var(--feed-card-border)] px-3 text-sm feed-muted-text transition hover:border-[#2C8B54] hover:text-brg-text"
        >
          Cancel
        </button>
      ) : null}
      <button
        type="submit"
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brg-accent transition hover:bg-brg-accentHover"
        aria-label={parentCommentId ? "Send reply" : "Send comment"}
      >
        <Send size={17} />
      </button>
    </form>
  );
}

function CommentItem({
  comment,
  currentUserId,
  onReply,
  replyOpen,
  replies
}: {
  comment: PostCommentView;
  currentUserId: string;
  onReply: (commentId: string | null) => void;
  replyOpen: boolean;
  replies: PostCommentView[];
}) {
  const deleted = Boolean(comment.deletedAt);
  const authorName =
    comment.author?.displayName ?? comment.author?.username ?? "Basic22 user";
  const isOwner = comment.authorId === currentUserId;

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {deleted ? (
          <Avatar className="bg-white/[0.05] opacity-45" name="Deleted comment" size="sm" />
        ) : comment.author ? (
          <Link
            href={`/friends/${comment.author.id}`}
            className="h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
            aria-label="Open profile"
          >
            <Avatar
              className="bg-white/[0.05]"
              imageUrl={comment.author.imageUrl}
              name={authorName}
              size="sm"
            />
          </Link>
        ) : (
          <Avatar className="bg-white/[0.05]" name="Basic22 user" size="sm" />
        )}

        <div className="min-w-0 flex-1">
          <div
            className={classNames(
              "feed-comment-surface rounded-lg px-3 py-2",
              deleted && "opacity-70"
            )}
          >
            {deleted ? (
              <p className="text-sm italic feed-muted-text">Comment deleted</p>
            ) : (
              <>
                {comment.author ? (
                  <Link
                    href={`/friends/${comment.author.id}`}
                    className="text-xs font-semibold feed-body-text transition hover:text-[#9FE7BE]"
                  >
                    {authorName}
                  </Link>
                ) : (
                  <p className="text-xs font-semibold feed-body-text">Basic22 user</p>
                )}
                <p className="mt-1 whitespace-pre-wrap text-sm leading-5 feed-body-text">
                  {comment.body}
                </p>
              </>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs feed-muted-text">
            <span>{formatRelativeTime(comment.createdAt)}</span>
            {!deleted ? (
              <>
                <form action={toggleCommentLike}>
                  <input type="hidden" name="comment_id" value={comment.id} />
                  <button
                    type="submit"
                    className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 transition hover:bg-white/[0.06] hover:text-brg-text"
                    aria-label={
                      comment.currentUserLiked ? "Unlike comment" : "Like comment"
                    }
                  >
                    <HeartHandshake
                      size={14}
                      className={comment.currentUserLiked ? "text-[#0B7A46]" : ""}
                    />
                    {comment.likeCount}
                  </button>
                </form>
                {!comment.parentCommentId ? (
                  <button
                    type="button"
                    onClick={() => onReply(replyOpen ? null : comment.id)}
                    className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 transition hover:bg-white/[0.06] hover:text-brg-text"
                  >
                    <Reply size={14} />
                    Reply
                  </button>
                ) : null}
                {isOwner ? (
                  <form action={deleteComment}>
                    <input type="hidden" name="comment_id" value={comment.id} />
                    <button
                      type="submit"
                      className="inline-flex min-h-8 items-center gap-1 rounded-md px-2 transition hover:bg-white/[0.06] hover:text-brg-text"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </form>
                ) : null}
              </>
            ) : null}
          </div>

          {replyOpen ? (
            <div className="mt-3">
              <CommentForm
                autoFocus
                onCancel={() => onReply(null)}
                parentCommentId={comment.id}
                postId={comment.postId}
                placeholder={`Reply to ${authorName}`}
              />
            </div>
          ) : null}
        </div>
      </div>

      {replies.length > 0 ? (
        <div className="ml-7 space-y-3 border-l border-[color:var(--feed-card-border)] pl-4 sm:ml-11">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUserId={currentUserId}
              onReply={onReply}
              replies={[]}
              replyOpen={false}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function PostComments({ comments, currentUserId, postId }: PostCommentsProps) {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const topLevelComments = comments.filter((comment) => !comment.parentCommentId);
  const repliesByParent = new Map<string, PostCommentView[]>();

  comments.forEach((comment) => {
    if (!comment.parentCommentId) {
      return;
    }

    repliesByParent.set(comment.parentCommentId, [
      ...(repliesByParent.get(comment.parentCommentId) ?? []),
      comment
    ]);
  });

  return (
    <div className="mt-4 space-y-3 border-t border-[color:var(--feed-card-border)] pt-4">
      {topLevelComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          onReply={setReplyingTo}
          replies={repliesByParent.get(comment.id) ?? []}
          replyOpen={replyingTo === comment.id}
        />
      ))}

      <CommentForm postId={postId} placeholder="Write a comment" />
    </div>
  );
}
