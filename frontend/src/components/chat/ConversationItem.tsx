import { FileText, Image as ImageIcon } from "lucide-react";
import Avatar from "../common/Avatar";
import Badge from "../ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { MessageType, type ChatUser, type Conversation } from "../../types";
import { formatDateSeparator, formatTime, isSameDay } from "../../utils/format";

interface ConversationItemProps {
  conversation: Conversation & { other: ChatUser };
  active: boolean;
  onClick: () => void;
}

const ConversationItem = ({ conversation, active, onClick }: ConversationItemProps) => {
  const { user } = useAuth();
  const { getPresence } = useSocket();
  const { other, lastMessage, lastMessageAt, unread } = conversation;
  const presence = getPresence(other);
  const prefix = lastMessage && lastMessage.senderId === user?.id ? "You: " : "";

  const time = lastMessage
    ? isSameDay(new Date(lastMessageAt), new Date())
      ? formatTime(lastMessageAt)
      : formatDateSeparator(lastMessageAt)
    : "";

  const renderPreview = () => {
    if (!lastMessage) return <span>No messages yet</span>;
    if (lastMessage.deleted) return <span className="italic">{prefix}This message was deleted</span>;
    if (lastMessage.messageType === MessageType.IMAGE) {
      return (
        <span className="inline-flex items-center gap-1">
          {prefix}
          <ImageIcon size={14} />
          Photo
        </span>
      );
    }
    if (lastMessage.messageType === MessageType.FILE) {
      return (
        <span className="inline-flex items-center gap-1">
          {prefix}
          <FileText size={14} />
          File
        </span>
      );
    }
    return (
      <span>
        {prefix}
        {lastMessage.content}
      </span>
    );
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
        active ? "bg-brand-50" : "hover:bg-ink-50"
      }`}
    >
      <Avatar name={other.name} src={other.profileImage} isOnline={presence.isOnline} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-semibold text-ink-900">{other.name}</p>
          <span className="shrink-0 text-xs text-ink-500">{time}</span>
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2">
          <p className="truncate text-sm text-ink-500">{renderPreview()}</p>
          {unread > 0 && <Badge tone="green">{unread > 99 ? "99+" : unread}</Badge>}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
