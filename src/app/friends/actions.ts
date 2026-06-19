"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field.trim() : "";
}

function friendsMessage(message: string): never {
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

export async function removeFriend(formData: FormData) {
  const { supabase, user } = await getUser();
  const friendshipId = value(formData, "friendship_id");

  if (!friendshipId) {
    friendsMessage("Friendship not found.");
  }

  const { data: friendship, error: findError } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status")
    .eq("id", friendshipId)
    .eq("status", "accepted")
    .maybeSingle();

  if (findError) {
    friendsMessage(findError.message);
  }

  if (
    !friendship ||
    (friendship.requester_id !== user.id && friendship.addressee_id !== user.id)
  ) {
    friendsMessage("Friendship not found.");
  }

  const friendId =
    friendship.requester_id === user.id ? friendship.addressee_id : friendship.requester_id;

  const { data: deletedFriendship, error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendship.id)
    .eq("status", "accepted")
    .select("id")
    .maybeSingle();

  if (error) {
    friendsMessage(error.message);
  }

  if (!deletedFriendship) {
    friendsMessage("Friendship could not be removed.");
  }

  revalidatePath("/friends");
  revalidatePath(`/friends/${friendId}`);
  revalidatePath("/messages");
  revalidatePath("/home");
  friendsMessage("Friend removed.");
}
