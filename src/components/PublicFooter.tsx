import Link from "next/link";
import { policyLinks } from "@/lib/policies";

type PublicFooterProps = {
  variant?: "public" | "app";
};

export function PublicFooter({ variant = "public" }: PublicFooterProps) {
  const isAppVariant = variant === "app";

  return (
    <footer
      className={
        isAppVariant
          ? "mt-10 border-t border-brg-border pb-2 pt-6 text-sm text-brg-muted"
          : "border-t border-brg-border bg-brg-bg px-5 py-8 text-sm text-brg-muted sm:px-8"
      }
    >
      <div
        className={
          isAppVariant
            ? "flex flex-col gap-5 md:flex-row md:items-center md:justify-between"
            : "mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between"
        }
      >
        <div>
          <Link href="/" className="font-semibold tracking-normal text-brg-text">
            BASIC22
          </Link>
          <p className="mt-2 text-xs">&copy; 2026 Basic22. All rights reserved.</p>
        </div>

        <nav className="flex flex-wrap gap-x-5 gap-y-3">
          {policyLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition hover:text-brg-text"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
