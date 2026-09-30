import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import Sidebar from "../components/chat/Sidebar";
import ChatPanel from "../components/chat/ChatPanel";
import EmptyState from "../components/ui/EmptyState";
import { useChat } from "../context/ChatContext";

const ChatPage = () => {
  const { conversationId } = useParams();
  const { setActiveId } = useChat();

  useEffect(() => {
    setActiveId(conversationId ?? null);
    return () => setActiveId(null);
  }, [conversationId, setActiveId]);

  const hasChat = !!conversationId;

  return (
    <div className="mx-auto flex h-[calc(100dvh-4rem)] w-full max-w-7xl overflow-hidden bg-white md:border-x md:border-ink-100">
      <aside
        className={`${hasChat ? "hidden md:flex" : "flex"} w-full flex-col border-r border-ink-100 md:w-96 md:shrink-0`}
      >
        <Sidebar />
      </aside>
      <section className={`${hasChat ? "flex" : "hidden md:flex"} min-w-0 flex-1 flex-col bg-cream`}>
        {conversationId ? (
          <ChatPanel key={conversationId} conversationId={conversationId} />
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={<MessageCircle size={28} />}
              title="Select a conversation"
              description="Pick a chat from the list or search for someone to start a new one"
            />
          </div>
        )}
      </section>
    </div>
  );
};

export default ChatPage;
