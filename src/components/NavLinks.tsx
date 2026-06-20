"use client";

import { Home, MessageCircle, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/lib/utils";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/friends", label: "Friends", icon: Users, badgeKey: "friends" },
  { href: "/messages", label: "Messages", icon: MessageCircle, badgeKey: "messages" },
  { href: "/settings", label: "Settings", icon: Settings }
] as const;

type NavLinksProps = {
  badges?: {
    friends?: number;
    messages?: number;
  };
};

function badgeLabel(count: number) {
  return count > 99 ? "99+" : String(count);
}

export function NavLinks({ badges }: NavLinksProps) {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        const badgeKey = "badgeKey" in link ? link.badgeKey : undefined;
        const badgeCount = badgeKey ? badges?.[badgeKey] ?? 0 : 0;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={classNames(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm text-brg-muted transition hover:bg-white/[0.04] hover:text-brg-text",
              active && "bg-white/[0.06] text-brg-text"
            )}
          >
            <Icon size={18} />
            <span className="flex-1">{link.label}</span>
            {badgeCount > 0 ? (
              <span
                className="min-w-5 rounded-full border border-[#0B7A46]/50 bg-[#0B7A46]/25 px-1.5 py-0.5 text-center text-[11px] font-semibold leading-none text-brg-text"
                aria-label={`${badgeLabel(badgeCount)} new ${link.label.toLowerCase()} item${badgeCount === 1 ? "" : "s"}`}
              >
                {badgeLabel(badgeCount)}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
