import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const callbackFallbackMessage =
  "We could not sign you in automatically. Please sign in with your verified email to continue.";

function emailOtpType(value: string | null) {
  if (value === "signup" || value === "email_change" || value === "email") {
    return value;
  }

  return "email";
}

function redirectWithMessage(requestUrl: URL, pathname: string, message: string) {
  const url = new URL(pathname, requestUrl.origin);
  url.searchParams.set("message", message);
  return NextResponse.redirect(url);
}

function safeNextPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/home";
  }

  return value;
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const authError =
    requestUrl.searchParams.get("error_description") ??
    requestUrl.searchParams.get("error");

  if (authError) {
    return redirectWithMessage(
      requestUrl,
      "/auth/callback/error",
      "This confirmation link could not be used. Please sign in with your verified email or request a new link."
    );
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirectWithMessage(requestUrl, "/auth/callback/error", callbackFallbackMessage);
    }
  } else if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: emailOtpType(requestUrl.searchParams.get("type"))
    });

    if (error) {
      return redirectWithMessage(requestUrl, "/auth/callback/error", callbackFallbackMessage);
    }
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    return NextResponse.redirect(
      new URL(safeNextPath(requestUrl.searchParams.get("next")), requestUrl.origin)
    );
  }

  return redirectWithMessage(requestUrl, "/auth/callback/error", callbackFallbackMessage);
}
