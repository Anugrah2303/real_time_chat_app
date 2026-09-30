import { useCallback } from "react";
import MessageBubble from "./MessageBubble";
import { useAuth } from "../../context/AuthContext";
import useAutoScroll from "../../hooks/useAutoScroll";
import type { Message } from "../../types";
import { formatDateSeparator, isSameDay } from "../../utils/format";

interface MessageListProps {
  conversationId: string;
  messages: Message[];
  hasMore: boolean;
  isLoadingOlder: boolean;
  onLoadOlder: (conversationId: string) => void;
  onDelete: (message: Message) => void;
  onReport: (message: Message) => void;
  onPreview: (src: string, name: string) => void;
}

const MessageList = ({
  conversationId,
  messages,
  hasMore,
  isLoadingOlder,
  onLoadOlder,
  onDelete,
  onReport,
  onPreview,
}: MessageListProps) => {
  const { user } = useAuth();
  const myId = user?.id ?? "";

  const loadOlder = useCallback(() => onLoadOlder(conversationId), [onLoadOlder, conversationId]);

  const { containerRef, onScroll, keepBottom } = useAutoScroll({
    messages,
    conversationId,
    hasMore,
    isLoadingOlder,
    currentUserId: myId,
    onLoadOlder: loadOlder,
  });

  return (
    <div ref={containerRef} onScroll={onScroll} className="min-h-0 flex-1 space-y-2 overflow-y-auto px-3 py-4 sm:px-6">
      {isLoadingOlder && <p className="py-2 text-center text-xs text-ink-500">Loading older messages...</p>}
      {!hasMore && messages.length > 0 && (
        <p className="py-2 text-center text-xs text-ink-500">Beginning of conversation</p>
      )}
      {messages.length === 0 && (
        <p className="py-10 text-center text-sm text-ink-500">No messages yet. Say hello!</p>
      )}
      {messages.map((m, index) => {
        const prev = messages[index - 1];
        const showDate = !prev || !isSameDay(new Date(prev.createdAt), new Date(m.createdAt));
        return (
          <div key={m._id} className="space-y-2">
            {showDate && (
              <div className="flex justify-center py-2">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink-500 shadow-card">
                  {formatDateSeparator(m.createdAt)}
                </span>
              </div>
            )}
            <MessageBubble
              message={m}
              isMine={m.senderId === myId}
              onDelete={onDelete}
              onReport={onReport}
              onPreview={onPreview}
              onImageLoad={keepBottom}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
