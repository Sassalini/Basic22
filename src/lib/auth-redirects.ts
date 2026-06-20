import { headers } from "next/headers";

export const productionAuthCallbackUrl = "https://www.basic22.com/auth/callback";
export const localAuthCallbackUrl = "http://localhost:3000/auth/callback";

function firstHeaderValue(value: string | null) {
  return value?.split(",")[0]?.trim() ?? null;
}

function isLocalDevHost(value: string | null) {
  if (!value) {
    return false;
  }

  const host = value.toLowerCase();
  return (
    host === "localhost" ||
    host.startsWith("localhost:") ||
    host === "127.0.0.1" ||
    host.startsWith("127.0.0.1:")
  );
}

function isLocalDevOrigin(value: string | null) {
  if (!value) {
    return false;
  }

  try {
    return isLocalDevHost(new URL(value).host);
  } catch {
    return isLocalDevHost(value);
  }
}

export async function getEmailRedirectTo() {
  const headerStore = await headers();
  const host =
    firstHeaderValue(headerStore.get("x-forwarded-host")) ??
    firstHeaderValue(headerStore.get("host"));
  const origin =
    firstHeaderValue(headerStore.get("origin")) ??
    firstHeaderValue(headerStore.get("referer"));

  if (isLocalDevHost(host) || isLocalDevOrigin(origin)) {
    return localAuthCallbackUrl;
  }

  return productionAuthCallbackUrl;
}
