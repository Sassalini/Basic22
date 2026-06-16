type ProfileImageSource = {
  avatar_url: string | null;
  id: string;
};

type ProfileImageStorageClient = {
  storage: {
    from(bucket: string): {
      createSignedUrl(
        path: string,
        expiresIn: number
      ): Promise<{ data: { signedUrl: string } | null }>;
    };
  };
};

export async function getProfileImageUrls(
  supabase: ProfileImageStorageClient,
  profiles: ProfileImageSource[]
) {
  const urls = new Map<string, string>();

  await Promise.all(
    profiles.map(async (profile) => {
      if (!profile.avatar_url) {
        return;
      }

      const { data } = await supabase.storage
        .from("profile-images")
        .createSignedUrl(profile.avatar_url, 60 * 10);

      if (data?.signedUrl) {
        urls.set(profile.id, data.signedUrl);
      }
    })
  );

  return urls;
}
