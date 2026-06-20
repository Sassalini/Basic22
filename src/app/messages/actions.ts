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

type DirectMessageRecord = {
  deleted_at: string | null;
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

type LoadOlderMessagesInput = {
  beforeCreatedAt: string;
  beforeId: string;
  friendId: string;
};

type LoadOlderMessagesResult =
  | {
      hasMore: boolean;
      messages: DirectMessageRecord[];
      ok: true;
    }
  | {
      message: string;
      ok: false;
    };

type SendDirectMessageResult =
  | {
      ok: true;
      message: DirectMessageRecord;
    }
  | {
      ok: false;
      message: string;
    };

type DeleteDirectMessageResult = {
  ok: boolean;
  id: string;
  message: string;
};

const messagePageSize = 10;

async function getUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return { supabase, user };
}

function conversationFilter(currentUserId: string, friendId: string) {
  return `and(sender_id.eq.${currentUserId},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${currentUserId})`;
}

async function isAcceptedFriend(
  supabase: Awaited<ReturnType<typeof createClient>>,
  currentUserId: string,
  friendId: string
) {
  const { data } = await supabase
    .from("friendships")
    .select("id")
    .eq("status", "accepted")
    .or(`and(requester_id.eq.${currentUserId},addressee_id.eq.${friendId}),and(requester_id.eq.${friendId},addressee_id.eq.${currentUserId})`)
    .maybeSingle();

  return Boolean(data);
}

export async function sendDirectMessage(formData: FormData) {
  const { supabase, user } = await getUser();

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

export async function sendDirectMessageInline(
  formData: FormData
): Promise<SendDirectMessageResult> {
  const { supabase, user } = await getUser();

  if (!user) {
    return { ok: false, message: "You must be signed in to send messages." };
  }

  const recipientId = value(formData, "recipient_id");
  const body = value(formData, "basic22_message_compose") || value(formData, "body");

  if (!recipientId || !body) {
    return { ok: false, message: "Message text is required." };
  }

  const { data, error } = await supabase
    .from("direct_messages")
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      body
    })
    .select("id, sender_id, recipient_id, body, created_at, deleted_at, read_at")
    .single();

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/messages");
  return { ok: true, message: data as DirectMessageRecord };
}

export async function loadOlderMessages(
  input: LoadOlderMessagesInput
): Promise<LoadOlderMessagesResult> {
  const { supabase, user } = await getUser();

  if (!user) {
    return { ok: false, message: "You must be signed in to load messages." };
  }

  if (!input.friendId || !input.beforeCreatedAt || !input.beforeId) {
    return { ok: false, message: "Conversation history could not be loaded." };
  }

  const acceptedFriend = await isAcceptedFriend(supabase, user.id, input.friendId);
  if (!acceptedFriend) {
    return { ok: false, message: "Conversation not found." };
  }

  const { data, error } = await supabase
    .from("direct_messages")
    .select("id, sender_id, recipient_id, body, created_at, deleted_at, read_at")
    .or(conversationFilter(user.id, input.friendId))
    .is("deleted_at", null)
    .or(`created_at.lt.${input.beforeCreatedAt},and(created_at.eq.${input.beforeCreatedAt},id.lt.${input.beforeId})`)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(messagePageSize);

  if (error) {
    return { ok: false, message: error.message };
  }

  const messages = ((data ?? []) as DirectMessageRecord[]).reverse();

  return {
    hasMore: messages.length === messagePageSize,
    messages,
    ok: true
  };
}

export async function deleteDirectMessage(formData: FormData) {
  const { supabase, user } = await getUser();

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

export async function deleteDirectMessageInline(
  formData: FormData
): Promise<DeleteDirectMessageResult> {
  const { supabase, user } = await getUser();

  if (!user) {
    return {
      ok: false,
      id: "",
      message: "You must be signed in to delete messages."
    };
  }

  const messageId = value(formData, "message_id");

  if (!messageId) {
    return { ok: false, id: "", message: "Message not found." };
  }

  const { error } = await supabase.rpc("delete_direct_message", {
    message_id: messageId
  });

  if (error) {
    return { ok: false, id: messageId, message: error.message };
  }

  revalidatePath("/messages");
  return { ok: true, id: messageId, message: "Message deleted." };
}
