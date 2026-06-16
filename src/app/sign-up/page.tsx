import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { Logo } from "@/components/Logo";
import { PasswordField } from "@/components/PasswordField";
import { SubmitButton } from "@/components/SubmitButton";

type SignUpPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-brg-bg px-5 py-10 text-brg-text">
      <section className="w-full max-w-md rounded-2xl border border-brg-border bg-brg-panel/80 p-6 shadow-calm">
        <Logo />
        <h1 className="mt-8 text-3xl font-semibold tracking-normal">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-brg-muted">
          Basic22 starts small: your profile, friends, posts, and messages.
        </p>

        {params.message ? (
          <p className="mt-5 rounded-lg border border-[#0B7A46]/40 bg-[#0B7A46]/10 p-3 text-sm text-brg-text">
            {params.message}
          </p>
        ) : null}

        <form action={signUp} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            Display name
            <input
              required
              name="display_name"
              type="text"
              autoComplete="name"
              className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
              placeholder="Alex Green"
            />
          </label>
          <label className="grid gap-2 text-sm">
            Username
            <input
              required
              name="username"
              type="text"
              pattern="[a-zA-Z0-9_]{3,24}"
              autoComplete="username"
              className="min-h-11 rounded-lg border border-brg-border bg-black/10 px-3 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
              placeholder="alex_green"
            />
          </label>
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
          <PasswordField
            required
            minLength={8}
            id="sign-up-password"
            name="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
          />
          <SubmitButton pendingLabel="Creating account...">Create account</SubmitButton>
        </form>

        <p className="mt-6 text-sm text-brg-muted">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-brg-text hover:text-[#0B7A46]">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
