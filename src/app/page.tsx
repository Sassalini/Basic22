import {
  HeartHandshake,
  ImagePlus,
  LockKeyhole,
  MessageCircle,
  Sparkles,
  Users
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PublicFooter } from "@/components/PublicFooter";

const values = [
  {
    icon: Users,
    title: "Friends only",
    body: "Share with people you have accepted, not the whole web."
  },
  {
    icon: Sparkles,
    title: "No algorithm",
    body: "Your feed is chronological, newest first, with no recommendations."
  }
];

const previewPosts = [
  {
    comments: "2",
    likes: "4",
    name: "Maya Patel",
    text: "Quiet coffee and a clear morning. Exactly enough.",
    time: "12 minutes ago",
    username: "maya"
  },
  {
    comments: "1",
    likes: "2",
    name: "Sam Green",
    text: "Walked the long way home and caught up with Jay. The best decision of the day.",
    time: "28 minutes ago",
    username: "sam"
  }
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-brg-bg text-brg-text">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/sign-in"
            className="rounded-lg px-4 py-2 text-brg-muted transition hover:text-brg-text"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-lg bg-brg-accent px-4 py-2 font-semibold text-brg-text transition hover:bg-brg-accentHover"
          >
            Create account
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:pt-16">
        <div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-normal sm:text-6xl">
            Reconnect with your private social circle without distraction.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-brg-muted">
            A bare-bones social platform focused on reconnecting with your circle without
            the distractions of media and news.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brg-accent px-6 text-sm font-semibold text-brg-text transition hover:bg-brg-accentHover"
            >
              Create account
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-brg-border px-6 text-sm font-semibold text-brg-text transition hover:border-[#0B7A46]/60"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="rounded-2xl border border-brg-border bg-brg-panel/80 p-4 shadow-calm">
          <div className="rounded-xl border border-brg-border bg-black/10 p-4">
            <div className="flex items-center justify-between border-b border-brg-border pb-4">
              <div>
                <h2 className="text-xl font-semibold">Home</h2>
              </div>
              <LockKeyhole size={20} className="text-[#0B7A46]" />
            </div>

            <div className="mt-4 feed-card-surface rounded-xl p-4">
              <label className="sr-only" htmlFor="landing-post-preview">
                Demo new post
              </label>
              <textarea
                id="landing-post-preview"
                readOnly
                rows={3}
                placeholder="What would you like to share with friends?"
                className="feed-inner-surface w-full resize-none rounded-lg p-3 text-sm leading-6 text-brg-text outline-none placeholder:text-brg-muted"
              />
              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  aria-disabled="true"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[color:var(--feed-card-border)] px-3 text-sm feed-muted-text"
                >
                  <ImagePlus size={17} />
                  Add image
                </button>
                <button
                  type="button"
                  aria-disabled="true"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brg-accent px-5 py-2 text-sm font-semibold text-brg-text"
                >
                  Post
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {previewPosts.map((post) => (
                <article
                  key={post.name}
                  className="feed-card-surface rounded-xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0B7A46]/20 text-sm font-semibold text-brg-text">
                      {post.name[0]}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <p className="font-semibold feed-body-text">{post.name}</p>
                        <p className="text-xs feed-muted-text">@{post.username}</p>
                      </div>
                      <p className="text-xs feed-muted-text">{post.time}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 feed-body-text">{post.text}</p>
                  <div className="mt-4 flex items-center gap-3 text-sm feed-muted-text">
                    <span className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2">
                      <HeartHandshake size={17} />
                      {post.likes}
                    </span>
                    <span className="inline-flex min-h-9 items-center gap-2 rounded-lg px-2">
                      <MessageCircle size={17} />
                      {post.comments}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-4xl gap-4 px-5 pb-16 sm:px-8 md:grid-cols-2">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <article
              key={value.title}
              className="rounded-xl border border-brg-border bg-brg-panel/70 p-5"
            >
              <Icon size={24} className="text-[#0B7A46]" />
              <h2 className="mt-4 font-semibold">{value.title}</h2>
              <p className="mt-2 text-sm leading-6 text-brg-muted">{value.body}</p>
            </article>
          );
        })}
      </section>

      <PublicFooter />
    </main>
  );
}
