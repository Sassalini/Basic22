import Link from "next/link";
import { Logo } from "@/components/Logo";
import { PublicFooter } from "@/components/PublicFooter";
import type { Policy, PolicyBlock } from "@/lib/policies";

type PolicyPageProps = {
  policy: Policy;
};

function PolicyBlockView({ block }: { block: PolicyBlock }) {
  if (block.type === "heading") {
    return (
      <h2 className="pt-4 text-xl font-semibold tracking-normal text-brg-text">
        {block.text}
      </h2>
    );
  }

  if (block.type === "list") {
    return (
      <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-brg-muted sm:text-base">
        {block.items.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p className="text-sm leading-7 text-brg-muted sm:text-base">{block.text}</p>;
}

export function PolicyPage({ policy }: PolicyPageProps) {
  return (
    <main className="min-h-screen bg-brg-bg text-brg-text">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Logo />
        <Link
          href="/"
          className="rounded-lg border border-brg-border px-4 py-2 text-sm font-semibold text-brg-text transition hover:border-[#0B7A46]/60"
        >
          Back to Basic22
        </Link>
      </header>

      <article className="mx-auto max-w-5xl px-5 pb-16 pt-6 sm:px-8 sm:pt-10">
        <div className="rounded-xl border border-brg-border bg-brg-panel/80 p-5 shadow-calm sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brg-muted">
            Last updated {policy.updated}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
            {policy.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-brg-muted">
            {policy.description}
          </p>

          <div className="mt-8 space-y-4">
            {policy.blocks.map((block, index) => (
              <PolicyBlockView key={`${block.type}-${index}`} block={block} />
            ))}
          </div>
        </div>
      </article>

      <PublicFooter />
    </main>
  );
}
