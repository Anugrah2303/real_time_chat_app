import { Ban, Download, FileText, Flag, Trash2 } from "lucide-react";
import MessageStatusTicks from "../common/MessageStatusTicks";
import { MessageType, type Message } from "../../types";
import { formatTime } from "../../utils/format";
import { getFileUrl } from "../../utils/server";

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  onDelete: (message: Message) => void;
  onReport: (message: Message) => void;
  onPreview: (src: string, name: string) => void;
  onImageLoad: () => void;
}

const MessageBubble = ({ message, isMine, onDelete, onReport, onPreview, onImageLoad }: MessageBubbleProps) => {
  const url = getFileUrl(message.content);

  const renderContent = () => {
    if (message.deleted) {
      return (
        <p className="flex items-center gap-1.5 text-sm italic opacity-80">
          <Ban size={14} />
          This message was deleted
        </p>
      );
    }
    if (message.messageType === MessageType.IMAGE) {
      return (
        <img
          src={url}
          alt={message.fileName || "Image"}
          onLoad={onImageLoad}
          onClick={() => onPreview(url, message.fileName)}
          className="max-h-64 w-full max-w-[16rem] cursor-zoom-in rounded-xl object-cover"
        />
      );
    }
    if (message.messageType === MessageType.FILE) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          download={message.fileName}
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
            isMine ? "bg-white/15 text-white" : "bg-ink-50 text-ink-900"
          }`}
        >
          <FileText size={18} className="shrink-0" />
          <span className="min-w-0 max-w-[12rem] truncate">{message.fileName || "File"}</span>
          <Download size={16} className="shrink-0" />
        </a>
      );
    }
    return <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>;
  };

  const showAction = !message.deleted;

  return (
    <div className={`group flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[85%] items-end gap-1.5 sm:max-w-[75%] ${isMine ? "flex-row-reverse" : ""}`}>
        <div
          className={`min-w-0 rounded-2xl px-3 py-2 ${
            isMine
              ? "rounded-br-md bg-brand-600 text-white"
              : "rounded-bl-md border border-ink-100 bg-white text-ink-900"
          }`}
        >
          {renderContent()}
          <div
            className={`mt-1 flex items-center justify-end gap-1 text-[11px] ${
              isMine ? "text-white/70" : "text-ink-500"
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isMine && !message.deleted && <MessageStatusTicks status={message.status} />}
          </div>
        </div>
        {showAction && (
          <button
            type="button"
            onClick={() => (isMine ? onDelete(message) : onReport(message))}
            aria-label={isMine ? "Delete message" : "Report message"}
            className="mb-1 shrink-0 rounded-lg p-1.5 text-ink-500 transition hover:bg-ink-50 hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100"
          >
            {isMine ? <Trash2 size={15} /> : <Flag size={15} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
