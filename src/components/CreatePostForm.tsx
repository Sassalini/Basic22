"use client";

/* eslint-disable @next/next/no-img-element */
import { ImagePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent
} from "react";
import { createPost } from "@/app/home/actions";
import { SubmitButton } from "@/components/SubmitButton";

const initialPostState = {
  ok: false,
  message: "",
  nonce: 0
};

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const maxImageSize = 5 * 1024 * 1024;

type SelectedImagePreview = {
  name: string;
  url: string;
};

export function CreatePostForm() {
  const router = useRouter();
  const [state, setState] = useState(initialPostState);
  const [preview, setPreview] = useState<SelectedImagePreview | null>(null);
  const [localMessage, setLocalMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  const revokePreviewUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const clearPreview = useCallback(() => {
    revokePreviewUrl();
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [revokePreviewUrl]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0] ?? null;
    revokePreviewUrl();
    setPreview(null);
    setLocalMessage("");
    setState(initialPostState);

    if (!file) {
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setLocalMessage("Please choose a JPG, PNG, WebP, or GIF image.");
      event.currentTarget.value = "";
      return;
    }

    if (file.size > maxImageSize) {
      setLocalMessage("Post images must be 5MB or smaller.");
      event.currentTarget.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    objectUrlRef.current = objectUrl;
    setPreview({
      name: file.name,
      url: objectUrl
    });
  }

  async function formAction(formData: FormData) {
    setLocalMessage("");
    const result = await createPost(formData);
    setState(result);

    if (result.ok) {
      formRef.current?.reset();
      clearPreview();
      router.refresh();
    }
  }

  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, [revokePreviewUrl]);

  const statusMessage = localMessage || state.message;

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => setLocalMessage("")}
      autoComplete="off"
      className="feed-card-surface rounded-xl p-4"
    >
      <label className="sr-only" htmlFor="basic22-post-compose">
        New post
      </label>
      <textarea
        id="basic22-post-compose"
        name="basic22_post_compose"
        maxLength={2000}
        rows={4}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="sentences"
        spellCheck={true}
        placeholder="What would you like to share with friends?"
        className="feed-inner-surface w-full resize-none rounded-lg p-3 text-sm leading-6 text-brg-text outline-none transition placeholder:text-brg-muted focus:border-[#2C8B54]"
      />

      {preview ? (
        <div className="mt-4 overflow-hidden rounded-lg border border-[color:var(--feed-card-border)] bg-[color:var(--feed-inner)]">
          <div className="flex items-center justify-between gap-3 px-3 py-2">
            <p className="min-w-0 truncate text-sm feed-muted-text">{preview.name}</p>
            <button
              type="button"
              onClick={clearPreview}
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-brg-muted transition hover:bg-white/[0.06] hover:text-brg-text focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70"
              aria-label="Remove selected image"
            >
              <X size={16} />
            </button>
          </div>
          <img
            src={preview.url}
            alt=""
            className="h-auto max-h-80 w-full border-t border-[color:var(--feed-card-border)] object-contain p-2"
          />
        </div>
      ) : null}

      {statusMessage ? (
        <p
          className="mt-3 rounded-lg border border-[color:var(--feed-card-border)] bg-black/10 px-3 py-2 text-sm feed-muted-text"
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}

      <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[color:var(--feed-card-border)] px-3 text-sm feed-muted-text transition hover:border-[#2C8B54] hover:text-brg-text">
          <ImagePlus size={17} />
          {preview ? "Change image" : "Add image"}
          <input
            ref={fileInputRef}
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={handleImageChange}
          />
        </label>
        <SubmitButton pendingLabel="Posting...">Post</SubmitButton>
      </div>
    </form>
  );
}
