import { Check, CheckCheck } from "lucide-react";
import { MessageStatus } from "../../types";

interface MessageStatusTicksProps {
  status: MessageStatus;
}

const MessageStatusTicks = ({ status }: MessageStatusTicksProps) => {
  if (status === MessageStatus.SENT) return <Check size={14} className="text-white/70" />;
  if (status === MessageStatus.DELIVERED) return <CheckCheck size={14} className="text-white/70" />;
  return <CheckCheck size={14} className="text-saffron-400" />;
};

export default MessageStatusTicks;
