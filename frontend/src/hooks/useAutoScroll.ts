import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { Message } from "../types";

interface UseAutoScrollOptions {
  messages: Message[];
  conversationId: string;
  hasMore: boolean;
  isLoadingOlder: boolean;
  currentUserId: string;
  onLoadOlder: () => void;
}

interface Snapshot {
  conversationId: string;
  first?: string;
  last?: string;
  height: number;
}

const useAutoScroll = ({
  messages,
  conversationId,
  hasMore,
  isLoadingOlder,
  currentUserId,
  onLoadOlder,
}: UseAutoScrollOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const snapshotRef = useRef<Snapshot>({ conversationId: "", height: 0 });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const snap = snapshotRef.current;
    const first = messages[0]?._id;
    const lastMessage = messages[messages.length - 1];
    const last = lastMessage?._id;

    if (snap.conversationId !== conversationId) {
      el.scrollTop = el.scrollHeight;
      atBottomRef.current = true;
    } else if (snap.first && first && first !== snap.first && last === snap.last) {
      el.scrollTop += el.scrollHeight - snap.height;
    } else if (lastMessage && last !== snap.last) {
      if (atBottomRef.current || lastMessage.senderId === currentUserId) {
        el.scrollTop = el.scrollHeight;
        atBottomRef.current = true;
      }
    }

    snapshotRef.current = { conversationId, first, last, height: el.scrollHeight };
  }, [messages, conversationId, currentUserId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !messages.length || !hasMore || isLoadingOlder) return;
    if (el.scrollHeight <= el.clientHeight) {
      snapshotRef.current.height = el.scrollHeight;
      onLoadOlder();
    }
  }, [messages, hasMore, isLoadingOlder, onLoadOlder]);

  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    atBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    snapshotRef.current.height = el.scrollHeight;
    if (el.scrollTop < 80 && hasMore && !isLoadingOlder) onLoadOlder();
  }, [hasMore, isLoadingOlder, onLoadOlder]);

  const keepBottom = useCallback(() => {
    const el = containerRef.current;
    if (el && atBottomRef.current) el.scrollTop = el.scrollHeight;
  }, []);

  return { containerRef, onScroll, keepBottom };
};

export default useAutoScroll;
