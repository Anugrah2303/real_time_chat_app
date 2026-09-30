import { ArrowLeft, Flag } from "lucide-react";
import Avatar from "../common/Avatar";
import Button from "../ui/Button";
import { useSocket } from "../../context/SocketContext";
import type { ChatUser } from "../../types";
import { formatLastSeen } from "../../utils/format";

interface ChatHeaderProps {
  other: ChatUser;
  onBack: () => void;
  onReport: () => void;
}

const ChatHeader = ({ other, onBack, onReport }: ChatHeaderProps) => {
  const { typingUsers, getPresence } = useSocket();
  const presence = getPresence(other);
  const isTyping = !!typingUsers[other._id];
  const status = isTyping ? "typing..." : presence.isOnline ? "online" : formatLastSeen(presence.lastSeen);

  return (
    <div className="flex items-center gap-3 border-b border-ink-100 bg-white px-3 py-3 sm:px-4">
      <button
        type="button"
        onClick={onBack}
        className="rounded-xl p-2 text-ink-700 hover:bg-ink-50 md:hidden"
        aria-label="Back to chats"
      >
        <ArrowLeft size={20} />
      </button>
      <Avatar name={other.name} src={other.profileImage} isOnline={presence.isOnline} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink-900">{other.name}</p>
        <p className={`truncate text-xs ${isTyping || presence.isOnline ? "text-brand-600" : "text-ink-500"}`}>
          {status}
        </p>
      </div>
      <Button variant="ghost" size="sm" icon={<Flag size={16} />} onClick={onReport}>
        <span className="hidden sm:inline">Report</span>
      </Button>
    </div>
  );
};

export default ChatHeader;
