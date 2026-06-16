import {
  HeartHandshake,
  LockKeyhole,
  MessageCircle,
  Sparkles,
  Users
} from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

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
    name: "Maya",
    text: "Quiet coffee and a clear morning. Exactly enough.",
    count: "4"
  },
  {
    name: "Sam",
    text: "Walked the long way home. The best decision of the day.",
    count: "2"
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

            <div className="mt-4 rounded-xl border border-brg-border bg-white/[0.03] p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-[#0B7A46]/25" />
                <div className="h-4 flex-1 rounded-full bg-white/[0.08]" />
              </div>
              <div className="mt-4 flex justify-end">
                <span className="rounded-lg bg-brg-accent px-4 py-2 text-sm font-semibold">
                  Post
                </span>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {previewPosts.map((post) => (
                <article
                  key={post.name}
                  className="rounded-xl border border-brg-border bg-white/[0.03] p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0B7A46]/25 text-sm font-semibold">
                      {post.name[0]}
                    </div>
                    <div>
                      <p className="font-semibold">{post.name}</p>
                      <p className="text-xs text-brg-muted">a few minutes ago</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-brg-text">{post.text}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-brg-muted">
                    <span className="inline-flex items-center gap-2">
                      <HeartHandshake size={16} />
                      {post.count}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle size={16} />1
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
    </main>
  );
}
