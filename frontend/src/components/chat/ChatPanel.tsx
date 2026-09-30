import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import ImagePreviewModal from "./ImagePreviewModal";
import ReportModal from "./ReportModal";
import Loader from "../ui/Loader";
import EmptyState from "../ui/EmptyState";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useChat } from "../../context/ChatContext";
import type { Message } from "../../types";
import { getErrorMessage } from "../../utils/format";

interface ChatPanelProps {
  conversationId: string;
}

interface ReportTarget {
  userId: string;
  messageId?: string;
  title: string;
}

interface PreviewTarget {
  src: string;
  name: string;
}

const ChatPanel = ({ conversationId }: ChatPanelProps) => {
  const navigate = useNavigate();
  const { conversations, isLoadingConversations, getThread, loadOlder, deleteMessage } = useChat();
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);
  const [preview, setPreview] = useState<PreviewTarget | null>(null);

  const conversation = conversations.find((c) => c.id === conversationId);
  const other = conversation?.other ?? null;
  const thread = getThread(conversationId);

  if (!other) {
    if (isLoadingConversations) return <Loader label="Loading chat" />;
    return (
      <EmptyState
        icon={<MessageCircle size={28} />}
        title="Conversation not found"
        description="It may have been removed or you do not have access"
        action={
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to chats
          </Button>
        }
      />
    );
  }

  const confirmDelete = () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    deleteMessage(deleteTarget)
      .then(() => {
        toast.success("Message deleted");
        setDeleteTarget(null);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsDeleting(false));
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ChatHeader
        other={other}
        onBack={() => navigate("/")}
        onReport={() => setReportTarget({ userId: other._id, title: `Report ${other.name}` })}
      />
      {!thread || !thread.loaded ? (
        <div className="flex min-h-0 flex-1 items-center justify-center">
          <Loader label="Loading messages" />
        </div>
      ) : (
        <MessageList
          conversationId={conversationId}
          messages={thread.items}
          hasMore={thread.hasMore}
          isLoadingOlder={thread.isLoadingOlder}
          onLoadOlder={loadOlder}
          onDelete={setDeleteTarget}
          onReport={(m) => setReportTarget({ userId: m.senderId, messageId: m._id, title: "Report message" })}
          onPreview={(src, name) => setPreview({ src, name })}
        />
      )}
      <MessageInput key={conversationId} receiverId={other._id} />

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete message">
        <p className="text-sm text-ink-700">This message will be deleted for everyone in this chat.</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </Modal>

      <ReportModal
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        reportedUserId={reportTarget?.userId ?? ""}
        messageId={reportTarget?.messageId}
        title={reportTarget?.title ?? "Report"}
      />

      <ImagePreviewModal src={preview?.src ?? null} name={preview?.name ?? ""} onClose={() => setPreview(null)} />
    </div>
  );
};

export default ChatPanel;
