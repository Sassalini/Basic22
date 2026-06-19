"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateUsername } from "@/lib/usernames";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function authRedirect(path: string, message: string) {
  const params = new URLSearchParams({ message });
  redirect(`${path}?${params.toString()}`);
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
    authRedirect("/sign-in", error.message);
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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
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
  redirect("/home");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
