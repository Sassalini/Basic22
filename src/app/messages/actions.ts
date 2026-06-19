"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field.trim() : "";
}

function messagesMessage(message: string, friendId?: string) {
  const params = new URLSearchParams({ message });
  if (friendId) {
    params.set("friend", friendId);
  }
  redirect(`/messages?${params.toString()}`);
}

export async function sendDirectMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const recipientId = value(formData, "recipient_id");
  const body = value(formData, "basic22_message_compose") || value(formData, "body");

  if (!recipientId || !body) {
    messagesMessage("Message text is required.", recipientId);
  }

  const { error } = await supabase.from("direct_messages").insert({
    sender_id: user.id,
    recipient_id: recipientId,
    body
  });

  if (error) {
    messagesMessage(error.message, recipientId);
  }

  revalidatePath("/messages");
  redirect(`/messages?friend=${recipientId}`);
}

export async function deleteDirectMessage(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const messageId = value(formData, "message_id");
  const friendId = value(formData, "friend_id");

  if (!messageId) {
    messagesMessage("Message not found.", friendId);
  }

  const { error } = await supabase.rpc("delete_direct_message", {
    message_id: messageId
  });

  if (error) {
    messagesMessage(error.message, friendId);
  }

  revalidatePath("/messages");
  redirect(friendId ? `/messages?friend=${friendId}` : "/messages");
}
