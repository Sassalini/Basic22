import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";
import { PublicFooter } from "@/components/PublicFooter";
import { SubmitButton } from "@/components/SubmitButton";

type SignInPageProps = {
  searchParams: Promise<{
    message?: string;
    next?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen flex-col bg-brg-bg text-brg-text">
      <div className="flex flex-1 items-center justify-center px-5 py-10">
        <section className="w-full max-w-md rounded-2xl border border-brg-border bg-brg-panel/80 p-6 shadow-calm">
          <Logo />
          <h1 className="mt-8 text-3xl font-semibold tracking-normal">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-brg-muted">
            Sign in to return to your private, chronological feed.
          </p>

          {params.message ? (
            <p className="mt-5 rounded-lg border border-[#0B7A46]/40 bg-[#0B7A46]/10 p-3 text-sm text-brg-text">
              {params.message}
            </p>
          ) : null}

          <form action={signIn} className="mt-6 grid gap-4">
            <input type="hidden" name="next" value={params.next ?? "/home"} />
            <label className="grid gap-2 text-sm">
              Email
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
                placeholder="you@example.com"
              />
            </label>
            <label className="grid gap-2 text-sm">
              Password
              <input
                required
                name="password"
                type="password"
                autoComplete="current-password"
                className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
                placeholder="Your password"
              />
            </label>
            <SubmitButton pendingLabel="Signing in...">Sign in</SubmitButton>
          </form>

          <p className="mt-6 text-sm text-brg-muted">
            New here?{" "}
            <Link
              href="/sign-up"
              className="font-semibold text-brg-text hover:text-[#0B7A46]"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
      <PublicFooter />
    </main>
  );
}
