"use client";

import { Send, Trash2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent
} from "react";
import {
  deleteDirectMessageInline,
  loadOlderMessages,
  sendDirectMessageInline
} from "@/app/messages/actions";
import { EmptyState } from "@/components/EmptyState";
import { classNames, formatDateTime } from "@/lib/utils";

type MessageRecord = {
  deleted_at: string | null;
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  read_at?: string | null;
};

type MessageThreadProps = {
  currentUserId: string;
  hasMoreInitial: boolean;
  initialMessages: MessageRecord[];
  selectedFriendId: string;
};

const deletedMessageDelayMs = 2500;
const topLoadThresholdPx = 96;

export function MessageThread({
  currentUserId,
  hasMoreInitial,
  initialMessages,
  selectedFriendId
}: MessageThreadProps) {
  const [messages, setMessages] = useState(
    initialMessages.filter((message) => !message.deleted_at)
  );
  const [body, setBody] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [hasMoreOlderMessages, setHasMoreOlderMessages] = useState(hasMoreInitial);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] = useState(false);
  const [isSending, startSending] = useTransition();
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bodyVersionRef = useRef(0);
  const hideTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const loadingOlderRef = useRef(false);
  const scrollAnchorRef = useRef<{ scrollHeight: number; scrollTop: number } | null>(
    null
  );
  const scrollToBottomRef = useRef(true);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedFriendId]);

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    if (scrollAnchorRef.current) {
      const anchor = scrollAnchorRef.current;
      scroller.scrollTop = scroller.scrollHeight - anchor.scrollHeight + anchor.scrollTop;
      scrollAnchorRef.current = null;
      return;
    }

    if (scrollToBottomRef.current) {
      scroller.scrollTop = scroller.scrollHeight;
      scrollToBottomRef.current = false;
    }
  }, [messages]);

  useEffect(() => {
    const hideTimers = hideTimersRef.current;

    return () => {
      hideTimers.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  function hideDeletedMessage(messageId: string) {
    const existingTimer = hideTimersRef.current.get(messageId);

    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      setMessages((currentMessages) =>
        currentMessages.filter((message) => message.id !== messageId)
      );
      hideTimersRef.current.delete(messageId);
    }, deletedMessageDelayMs);

    hideTimersRef.current.set(messageId, timer);
  }

  const loadOlder = useCallback(async () => {
    if (loadingOlderRef.current || !hasMoreOlderMessages || messages.length === 0) {
      return;
    }

    const scroller = scrollerRef.current;
    const oldestMessage = messages[0];

    if (!scroller || !oldestMessage) {
      return;
    }

    loadingOlderRef.current = true;
    scrollAnchorRef.current = {
      scrollHeight: scroller.scrollHeight,
      scrollTop: scroller.scrollTop
    };
    setIsLoadingOlderMessages(true);
    setStatusMessage("");

    const result = await loadOlderMessages({
      beforeCreatedAt: oldestMessage.created_at,
      beforeId: oldestMessage.id,
      friendId: selectedFriendId
    });

    if (!result.ok) {
      setStatusMessage(result.message);
      scrollAnchorRef.current = null;
      setIsLoadingOlderMessages(false);
      loadingOlderRef.current = false;
      inputRef.current?.focus();
      return;
    }

    setHasMoreOlderMessages(result.hasMore);
    setMessages((currentMessages) => {
      const currentIds = new Set(currentMessages.map((message) => message.id));
      const olderMessages = result.messages.filter(
        (message) => !currentIds.has(message.id)
      );

      if (olderMessages.length === 0) {
        scrollAnchorRef.current = null;
        return currentMessages;
      }

      return [...olderMessages, ...currentMessages];
    });
    setIsLoadingOlderMessages(false);
    loadingOlderRef.current = false;
  }, [hasMoreOlderMessages, messages, selectedFriendId]);

  function handleScroll() {
    const scroller = scrollerRef.current;

    if (!scroller || scroller.scrollTop > topLoadThresholdPx) {
      return;
    }

    void loadOlder();
  }

  function handleSend(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("");

    const submittedBody = body.trim();
    if (!submittedBody) {
      setStatusMessage("Message text is required.");
      inputRef.current?.focus();
      return;
    }

    const formData = new FormData();
    const submittedBodyVersion = bodyVersionRef.current;
    formData.set("recipient_id", selectedFriendId);
    formData.set("basic22_message_compose", submittedBody);

    startSending(async () => {
      const result = await sendDirectMessageInline(formData);

      if (!result.ok) {
        setStatusMessage(result.message);
        inputRef.current?.focus();
        return;
      }

      scrollToBottomRef.current = true;
      setMessages((currentMessages) => [...currentMessages, result.message]);
      setBody((currentBody) =>
        bodyVersionRef.current === submittedBodyVersion ? "" : currentBody
      );
      inputRef.current?.focus();
    });
  }

  function handleDelete(messageId: string) {
    setStatusMessage("");
    setDeletingIds((currentIds) => new Set(currentIds).add(messageId));

    const formData = new FormData();
    formData.set("message_id", messageId);

    startSending(async () => {
      const result = await deleteDirectMessageInline(formData);

      setDeletingIds((currentIds) => {
        const nextIds = new Set(currentIds);
        nextIds.delete(messageId);
        return nextIds;
      });

      if (!result.ok) {
        setStatusMessage(result.message);
        inputRef.current?.focus();
        return;
      }

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId
            ? { ...message, body: "", deleted_at: new Date().toISOString() }
            : message
        )
      );
      hideDeletedMessage(messageId);
      inputRef.current?.focus();
    });
  }

  return (
    <>
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="calm-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5"
      >
        {isLoadingOlderMessages ? (
          <p className="rounded-lg border border-brg-border bg-white/[0.03] px-3 py-2 text-center text-xs text-brg-muted">
            Loading older messages...
          </p>
        ) : null}
        {messages.length === 0 ? (
          <EmptyState
            title="No messages yet"
            body="Send the first quiet note. Messages are only between accepted friends."
          />
        ) : (
          messages.map((message) => {
            const mine = message.sender_id === currentUserId;
            const deleted = Boolean(message.deleted_at);
            return (
              <div
                key={message.id}
                className={classNames("flex", mine ? "justify-end" : "justify-start")}
              >
                <div
                  className={classNames(
                    "max-w-[84%] rounded-2xl border px-4 py-3 shadow-[0_10px_26px_rgba(0,0,0,0.18)] sm:max-w-[76%]",
                    deleted
                      ? "message-bubble-deleted"
                      : mine
                      ? "message-bubble-sent"
                      : "message-bubble-received"
                  )}
                >
                  <p
                    className={classNames(
                      "whitespace-pre-wrap text-sm leading-6",
                      deleted && "italic"
                    )}
                  >
                    {deleted ? "Message deleted" : message.body}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <p className="text-xs message-timestamp">
                      {formatDateTime(message.created_at)}
                    </p>
                    {mine && !deleted ? (
                      <button
                        type="button"
                        disabled={deletingIds.has(message.id)}
                        onClick={() => handleDelete(message.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md opacity-75 transition hover:bg-white/[0.08] hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#0B7A46]/70 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Delete message"
                      >
                        <Trash2 size={14} />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <form
        onSubmit={handleSend}
        autoComplete="off"
        className="flex gap-2 border-t border-brg-border p-4"
      >
        <input type="hidden" name="recipient_id" value={selectedFriendId} />
        <label className="sr-only" htmlFor="basic22-message-compose">
          Message
        </label>
        <input
          ref={inputRef}
          id="basic22-message-compose"
          name="basic22_message_compose"
          required
          maxLength={2000}
          value={body}
          onChange={(event) => {
            bodyVersionRef.current += 1;
            setBody(event.currentTarget.value);
          }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck={true}
          placeholder="Type a message"
          className="feed-inner-surface min-h-11 flex-1 rounded-lg px-3 text-sm outline-none transition placeholder:text-brg-muted focus:border-[#2C8B54]"
        />
        <button
          type="submit"
          disabled={isSending}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-brg-accent transition hover:bg-brg-accentHover disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Send message"
        >
          <Send size={17} />
        </button>
      </form>
      {statusMessage ? (
        <p className="border-t border-brg-border px-4 py-2 text-sm text-brg-muted">
          {statusMessage}
        </p>
      ) : null}
    </>
  );
}
