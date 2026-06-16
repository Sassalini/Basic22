"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const themeChangeEvent = "basic22-theme-change";

function getThemeSnapshot() {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.localStorage.getItem("basic22-theme") === "light" ? "light" : "dark";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(themeChangeEvent, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(themeChangeEvent, callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => "dark");

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("basic22-theme", nextTheme);
    document.documentElement.classList.toggle("light", nextTheme === "light");
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex min-h-11 items-center justify-between gap-3 rounded-lg border border-brg-border bg-white/[0.03] px-4 py-2 text-sm text-brg-text transition hover:border-[#0B7A46]/60"
      aria-label="Toggle theme"
    >
      <span className="inline-flex items-center gap-2">
        {isDark ? <Moon size={17} /> : <Sun size={17} />}
        {isDark ? "Dark" : "Light"}
      </span>
      <span className="flex h-5 w-9 items-center rounded-full bg-[#0B7A46]/30 p-0.5">
        <span
          className={`h-4 w-4 rounded-full bg-brg-text transition ${
            isDark ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </span>
    </button>
  );
}
