"use client";

import { useState } from "react";

type PasswordFieldProps = {
  autoComplete: string;
  id: string;
  minLength?: number;
  name: string;
  placeholder?: string;
  required?: boolean;
};

export function PasswordField({
  autoComplete,
  id,
  minLength,
  name,
  placeholder,
  required
}: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const label = isVisible ? "Hide password" : "Show password";

  return (
    <div className="grid gap-2 text-sm">
      <label htmlFor={id}>Password</label>
      <div className="relative">
        <input
          required={required}
          minLength={minLength}
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          className="min-h-11 w-full rounded-lg border border-brg-border bg-black/10 px-3 pr-16 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#0B7A46]"
          placeholder={placeholder}
        />
        <button
          type="button"
          aria-label={label}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-brg-muted transition hover:text-brg-text focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
          onClick={() => setIsVisible((current) => !current)}
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}
