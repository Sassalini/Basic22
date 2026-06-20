"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getEmailRedirectTo } from "@/lib/auth-redirects";
import { createClient } from "@/lib/supabase/server";
import { generateUsername } from "@/lib/usernames";

const verificationEmailSentMessage =
  "A verification email has been sent. Please confirm your email before logging in. Check your spam/junk folder if you do not see it.";

const emailNotConfirmedMessage =
  "Your email has not been confirmed yet. Please check your inbox and verify your email before logging in. Check your spam/junk folder if you do not see it.";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function authRedirect(path: string, message: string) {
  const params = new URLSearchParams({ message });
  redirect(`${path}?${params.toString()}`);
}

function friendlySignInError(message: string) {
  if (message.toLowerCase().includes("email not confirmed")) {
    return emailNotConfirmedMessage;
  }

  return message;
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const next = getString(formData, "next") || "/home";

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authRedirect("/sign-in", friendlySignInError(error.message));
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/home");
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const displayName = getString(formData, "display_name");
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const username = generateUsername(displayName, {
    maxLength: 15,
    suffixLength: 4
  });

  if (!displayName) {
    authRedirect("/sign-up", "Display name is required.");
  }

  if (displayName.length > 80) {
    authRedirect("/sign-up", "Display name must be 80 characters or fewer.");
  }

  if (password.length < 8) {
    authRedirect("/sign-up", "Password must be at least 8 characters.");
  }

  const emailRedirectTo = await getEmailRedirectTo();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo,
      data: {
        display_name: displayName,
        username
      }
    }
  });

  if (error) {
    authRedirect("/sign-up", error.message);
  }

  revalidatePath("/", "layout");

  if (data.session) {
    redirect("/home");
  }

  authRedirect("/sign-in", verificationEmailSentMessage);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
