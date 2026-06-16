"use client";

import { useFormStatus } from "react-dom";
import { classNames } from "@/lib/utils";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
};

export function SubmitButton({
  children,
  pendingLabel = "Working...",
  className
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className={classNames(
        "inline-flex min-h-11 items-center justify-center rounded-lg bg-brg-accent px-5 py-2 text-sm font-semibold text-brg-text transition hover:bg-brg-accentHover focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      type="submit"
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
