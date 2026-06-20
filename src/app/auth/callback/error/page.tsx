import Link from "next/link";
import { Logo } from "@/components/Logo";

type AuthCallbackErrorPageProps = {
  searchParams: Promise<{
    message?: string;
  }>;
};

export default async function AuthCallbackErrorPage({
  searchParams
}: AuthCallbackErrorPageProps) {
  const params = await searchParams;
  const message =
    params.message ??
    "We could not sign you in automatically. Please sign in with your verified email to continue.";

  return (
    <main className="flex min-h-screen items-center justify-center bg-brg-bg px-5 py-10 text-brg-text">
      <section className="w-full max-w-md rounded-2xl border border-brg-border bg-brg-panel/80 p-6 shadow-calm">
        <Logo />
        <h1 className="mt-8 text-3xl font-semibold tracking-normal">Email confirmed</h1>
        <p className="mt-2 text-sm leading-6 text-brg-muted">
          Your verification link was received, but this browser does not have an active session.
        </p>
        <p className="mt-5 rounded-lg border border-[#0B7A46]/40 bg-[#0B7A46]/10 p-3 text-sm text-brg-text">
          {message}
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-brg-accent px-5 py-2 text-sm font-semibold text-brg-text transition hover:bg-brg-accentHover focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
        >
          Sign in
        </Link>
      </section>
    </main>
  );
}
