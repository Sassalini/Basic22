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

type CreatePostState = {
  ok: boolean;
  message: string;
  nonce: number;
};

function postState(ok: boolean, message: string): CreatePostState {
  return {
    ok,
    message,
    nonce: Date.now()
  };
}

function isPostImageFile(file: File) {
  return ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type);
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

export async function createPost(formData: FormData): Promise<CreatePostState> {
  const { supabase, user } = await getUser();
  const body = textValue(formData, "basic22_post_compose") || textValue(formData, "body");
  const image = formData.get("image");
  const imageFile = image instanceof File && image.size > 0 ? image : null;
  let imagePath: string | null = null;

  if (!body && !imageFile) {
    return postState(false, "Write something or choose an image before posting.");
  }

  if (imageFile) {
    if (!isPostImageFile(imageFile)) {
      return postState(false, "Please upload a JPG, PNG, WebP, or GIF image.");
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      return postState(false, "Post images must be 5MB or smaller.");
    }

    const safeName =
      imageFile.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "image";
    imagePath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(imagePath, imageFile, {
        contentType: imageFile.type,
        upsert: false
      });

    if (uploadError) {
      return postState(false, uploadError.message);
    }
  }

  const { error } = await supabase.from("posts").insert({
    author_id: user.id,
    body,
    image_path: imagePath
  });

  if (error) {
    if (imagePath) {
      await supabase.storage.from("post-images").remove([imagePath]);
    }

    return postState(false, error.message);
  }

  revalidatePath("/home");
  return postState(true, "Post shared.");
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
  const parentCommentId = textValue(formData, "parent_comment_id");
  const body = textValue(formData, "basic22_comment_body") || textValue(formData, "body");

  if (!postId || !body) {
    withMessage("Comment text is required.");
  }

  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    author_id: user.id,
    parent_comment_id: parentCommentId || null,
    body
  });

  if (error) {
    withMessage(error.message);
  }

  revalidatePath("/home");
}

export async function toggleCommentLike(formData: FormData) {
  const { supabase, user } = await getUser();
  const commentId = textValue(formData, "comment_id");

  if (!commentId) {
    withMessage("Comment not found.");
  }

  const { data: existing } = await supabase
    .from("comment_likes")
    .select("comment_id")
    .eq("comment_id", commentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("comment_likes")
      .delete()
      .eq("comment_id", commentId)
      .eq("user_id", user.id);

    if (error) {
      withMessage(error.message);
    }
  } else {
    const { error } = await supabase.from("comment_likes").insert({
      comment_id: commentId,
      user_id: user.id
    });

    if (error) {
      withMessage(error.message);
    }
  }

  revalidatePath("/home");
}

export async function deleteComment(formData: FormData) {
  const { supabase } = await getUser();
  const commentId = textValue(formData, "comment_id");

  if (!commentId) {
    withMessage("Comment not found.");
  }

  const { error } = await supabase.rpc("delete_post_comment", {
    target_comment_id: commentId
  });

  if (error) {
    withMessage(error.message);
  }

  revalidatePath("/home");
}
