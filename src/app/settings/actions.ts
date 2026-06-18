"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  const field = formData.get(key);
  return typeof field === "string" ? field.trim() : "";
}

function settingsMessage(message: string): never {
  const params = new URLSearchParams({ message });
  redirect(`/settings?${params.toString()}`);
}

function isImageFile(file: File) {
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

export async function updateProfile(formData: FormData) {
  const { supabase, user } = await getUser();
  const displayName = value(formData, "display_name");
  const username = value(formData, "username").toLowerCase();
  const about = value(formData, "about");
  const avatar = formData.get("avatar");

  if (!displayName || !username) {
    settingsMessage("Display name and username are required.");
  }

  if (displayName.length > 80) {
    settingsMessage("Display name must be 80 characters or fewer.");
  }

  if (!/^[a-z0-9_]{3,24}$/.test(username)) {
    settingsMessage("Username must be 3-24 characters using letters, numbers, or underscores.");
  }

  if (about.length > 160) {
    settingsMessage("About must be 160 characters or fewer.");
  }

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  let avatarPath: string | null = null;

  if (avatar instanceof File && avatar.size > 0) {
    if (!isImageFile(avatar)) {
      settingsMessage("Please upload a JPG, PNG, WebP, or GIF image.");
    }

    if (avatar.size > 5 * 1024 * 1024) {
      settingsMessage("Profile photo must be 5MB or smaller.");
    }

    const safeName =
      avatar.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "avatar";
    avatarPath = `${user.id}/${crypto.randomUUID()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("profile-images")
      .upload(avatarPath, avatar, {
        contentType: avatar.type,
        upsert: false
      });

    if (uploadError) {
      settingsMessage(uploadError.message);
    }
  }

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      display_name: displayName,
      username,
      about,
      ...(avatarPath ? { avatar_url: avatarPath } : {})
    },
    { onConflict: "id" }
  );

  if (error) {
    if (avatarPath) {
      await supabase.storage.from("profile-images").remove([avatarPath]);
    }

    settingsMessage(error.message);
  }

  if (avatarPath && currentProfile?.avatar_url) {
    await supabase.storage.from("profile-images").remove([currentProfile.avatar_url]);
  }

  revalidatePath("/settings");
  revalidatePath("/home");
  revalidatePath("/friends");
  revalidatePath("/messages");
  revalidatePath("/", "layout");
  settingsMessage("Settings saved.");
}

export async function uploadProfileGalleryImage(formData: FormData) {
  const { supabase, user } = await getUser();
  const image = formData.get("gallery_image");

  if (!(image instanceof File) || image.size === 0) {
    settingsMessage("Choose a profile image to upload.");
  }

  if (!isImageFile(image)) {
    settingsMessage("Please upload a JPG, PNG, WebP, or GIF image.");
  }

  if (image.size > 5 * 1024 * 1024) {
    settingsMessage("Profile images must be 5MB or smaller.");
  }

  const safeName =
    image.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80) || "profile-image";
  const imagePath = `${user.id}/gallery/${crypto.randomUUID()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("profile-images")
    .upload(imagePath, image, {
      contentType: image.type,
      upsert: false
    });

  if (uploadError) {
    settingsMessage(uploadError.message);
  }

  const { error } = await supabase.from("profile_gallery_images").insert({
    owner_id: user.id,
    image_path: imagePath
  });

  if (error) {
    await supabase.storage.from("profile-images").remove([imagePath]);
    settingsMessage(error.message);
  }

  revalidatePath("/settings");
  revalidatePath(`/friends/${user.id}`);
  settingsMessage("Profile image added.");
}

export async function deleteProfileGalleryImage(formData: FormData) {
  const { supabase, user } = await getUser();
  const imageId = value(formData, "image_id");

  if (!imageId) {
    settingsMessage("Profile image not found.");
  }

  const { data: image, error: findError } = await supabase
    .from("profile_gallery_images")
    .select("id, image_path")
    .eq("id", imageId)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (findError) {
    settingsMessage(findError.message);
  }

  if (!image) {
    settingsMessage("You can only delete your own profile images.");
  }

  const { error } = await supabase
    .from("profile_gallery_images")
    .delete()
    .eq("id", image.id)
    .eq("owner_id", user.id);

  if (error) {
    settingsMessage(error.message);
  }

  await supabase.storage.from("profile-images").remove([image.image_path]);

  revalidatePath("/settings");
  revalidatePath(`/friends/${user.id}`);
  settingsMessage("Profile image deleted.");
}
