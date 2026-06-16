"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function withMessage(message: string): never {
  const params = new URLSearchParams({ message });
  redirect(`/home?${params.toString()}`);
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

export async function createPost(formData: FormData) {
  const { supabase, user } = await getUser();
  const body = textValue(formData, "body");
  const image = formData.get("image");
  let imagePath: string | null = null;

  if (!body) {
    withMessage("Write something before posting.");
  }

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      withMessage("Please upload an image file.");
    }

    const safeName =
      image.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "image";
    imagePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(imagePath, image, {
        contentType: image.type,
        upsert: false
      });

    if (uploadError) {
      withMessage(uploadError.message);
    }
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    body,
    image_path: imagePath
  });

  if (error) {
    withMessage(error.message);
  }

  revalidatePath("/home");
  redirect("/home");
}

export async function deletePost(formData: FormData) {
  const { supabase, user } = await getUser();
  const postId = textValue(formData, "post_id");

  if (!postId) {
    withMessage("Post not found.");
  }

  const { data: post, error: findError } = await supabase
    .from("posts")
    .select("id, image_path")
    .eq("id", postId)
    .eq("author_id", user.id)
    .maybeSingle();

  if (findError) {
    withMessage(findError.message);
  }

  if (!post) {
    withMessage("You can only delete your own posts.");
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", post.id)
    .eq("author_id", user.id);

  if (error) {
    withMessage(error.message);
  }

  if (post.image_path) {
    await supabase.storage.from("post-images").remove([post.image_path]);
  }

  revalidatePath("/home");
  withMessage("Post deleted.");
}

export async function toggleLike(formData: FormData) {
  const { supabase, user } = await getUser();
  const postId = textValue(formData, "post_id");

  if (!postId) {
    withMessage("Post not found.");
  }

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);

    if (error) {
      withMessage(error.message);
    }
  } else {
    const { error } = await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: user.id
    });

    if (error) {
      withMessage(error.message);
    }
  }

  revalidatePath("/home");
}

export async function addComment(formData: FormData) {
  const { supabase, user } = await getUser();
  const postId = textValue(formData, "post_id");
  const body = textValue(formData, "body");

  if (!postId || !body) {
    withMessage("Comment text is required.");
  }

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    author_id: user.id,
    body
  });

  if (error) {
    withMessage(error.message);
  }

  revalidatePath("/home");
}
