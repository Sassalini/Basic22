"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field.trim() : "";
}

function friendsMessage(message: string) {
  const params = new URLSearchParams({ message });
  redirect(`/friends?${params.toString()}`);
}

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return { supabase, user };
}

export async function sendFriendRequest(formData: FormData) {
  const { supabase, user } = await getUser();
  const addresseeId = value(formData, "addressee_id");

  if (!addresseeId || addresseeId === user.id) {
    friendsMessage("Choose another person to add.");
  }

  const { error } = await supabase.from("friendships").insert({
    requester_id: user.id,
    addressee_id: addresseeId,
    status: "pending"
  });

  if (error) {
    friendsMessage(error.message);
  }

  revalidatePath("/friends");
  friendsMessage("Friend request sent.");
}

export async function respondToFriendRequest(formData: FormData) {
  const { supabase } = await getUser();
  const friendshipId = value(formData, "friendship_id");
  const response = value(formData, "response");

  if (!friendshipId || !["accepted", "rejected"].includes(response)) {
    friendsMessage("Friend request not found.");
  }

  const { error } = await supabase
    .from("friendships")
    .update({
      status: response,
      responded_at: new Date().toISOString()
    })
    .eq("id", friendshipId);

  if (error) {
    friendsMessage(error.message);
  }

  revalidatePath("/friends");
  friendsMessage(response === "accepted" ? "Friend request accepted." : "Friend request rejected.");
}
