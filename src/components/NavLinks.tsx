"use client";

import { Home, MessageCircle, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/lib/utils";

const links = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/friends", label: "Friends", icon: Users },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/settings", label: "Settings", icon: Settings }
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;

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
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
