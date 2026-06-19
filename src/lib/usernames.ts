const DEFAULT_USERNAME_BASE = "user";

type GenerateUsernameOptions = {
  maxLength?: number;
  suffixLength?: number;
};

export function usernameBaseFromDisplayName(displayName: string) {
  const base = displayName
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

  return base.length >= 3 ? base : DEFAULT_USERNAME_BASE;
}

export function generateUsername(
  displayName: string,
  { maxLength = 24, suffixLength = 8 }: GenerateUsernameOptions = {}
) {
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, suffixLength);
  const separator = "_";
  const baseLimit = Math.max(
    DEFAULT_USERNAME_BASE.length,
    maxLength - suffix.length - separator.length
  );
  const base =
    usernameBaseFromDisplayName(displayName).slice(0, baseLimit).replace(/_+$/g, "") ||
    DEFAULT_USERNAME_BASE;

  return `${base}${separator}${suffix}`.slice(0, maxLength);
}
