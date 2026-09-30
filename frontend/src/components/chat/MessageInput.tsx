import { useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Paperclip, Send } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { uploadFile } from "../../api/message.api";
import { useChat } from "../../context/ChatContext";
import useTyping from "../../hooks/useTyping";
import { MessageType } from "../../types";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, MAX_MESSAGE_LENGTH } from "../../utils/constants";
import { formatFileSize, getErrorMessage } from "../../utils/format";

interface MessageInputProps {
  receiverId: string;
}

const COUNTER_THRESHOLD = 1800;

const MessageInput = ({ receiverId }: MessageInputProps) => {
  const { sendMessage } = useChat();
  const { start, stop } = useTyping(receiverId);
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const busy = isSending || isUploading;
  const trimmedLength = text.trim().length;
  const isOverLimit = trimmedLength > MAX_MESSAGE_LENGTH;

  const submit = () => {
    const content = text.trim();
    if (!content || busy) return;
    if (content.length > MAX_MESSAGE_LENGTH) {
      toast.error(`Message must be 1-${MAX_MESSAGE_LENGTH} characters`);
      return;
    }
    setIsSending(true);
    stop();
    sendMessage(receiverId, MessageType.TEXT, content, "")
      .then(() => setText(""))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => {
        setIsSending(false);
        textRef.current?.focus();
      });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      submit();
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || busy) return;
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Only png, jpeg, webp, gif, pdf and txt files are allowed");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File too large (max ${formatFileSize(MAX_FILE_SIZE)})`);
      return;
    }
    setIsUploading(true);
    stop();
    uploadFile(file)
      .then((result) => sendMessage(receiverId, result.messageType, result.url, result.fileName))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setIsUploading(false));
  };

  return (
    <div className="border-t border-ink-100 bg-white p-3 sm:p-4">
      {isUploading && <p className="mb-2 text-xs text-ink-500">Uploading file...</p>}
      <div className="flex items-end gap-2">
        <input
          ref={fileRef}
          type="file"
          accept={ALLOWED_FILE_TYPES.join(",")}
          onChange={onFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          aria-label="Attach file"
          className="rounded-xl p-2.5 text-ink-500 transition hover:bg-ink-50 hover:text-brand-600 disabled:opacity-50"
        >
          <Paperclip size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <textarea
            ref={textRef}
            value={text}
            rows={1}
            readOnly={busy}
            onChange={(e) => {
              setText(e.target.value);
              if (e.target.value.trim()) start();
              else stop();
            }}
            onKeyDown={onKeyDown}
            onBlur={stop}
            placeholder="Type a message"
            className="max-h-32 min-h-[44px] w-full resize-none rounded-xl border border-ink-100 bg-ink-50 px-3 py-2.5 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white"
          />
          {trimmedLength >= COUNTER_THRESHOLD && (
            <p className={`mt-1 text-right text-xs ${isOverLimit ? "text-red-600" : "text-ink-500"}`}>
              {trimmedLength}/{MAX_MESSAGE_LENGTH}
            </p>
          )}
        </div>
        <Button
          onClick={submit}
          isLoading={isSending}
          disabled={busy || !trimmedLength || isOverLimit}
          icon={<Send size={18} />}
        >
          <span className="hidden sm:inline">Send</span>
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
