import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import ConversationItem from "./ConversationItem";
import Avatar from "../common/Avatar";
import Loader from "../ui/Loader";
import EmptyState from "../ui/EmptyState";
import { searchUsers } from "../../api/user.api";
import { useChat } from "../../context/ChatContext";
import { useSocket } from "../../context/SocketContext";
import useDebounce from "../../hooks/useDebounce";
import type { ChatUser, Conversation, SearchUser } from "../../types";
import { SEARCH_DEBOUNCE_MS } from "../../utils/constants";
import { getErrorMessage } from "../../utils/format";

const Sidebar = () => {
  const navigate = useNavigate();
  const { conversations, isLoadingConversations, activeId, startConversation } = useChat();
  const { getPresence } = useSocket();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const debounced = useDebounce(query.trim(), SEARCH_DEBOUNCE_MS);
  const isSearchMode = query.trim().length > 0;

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    let cancelled = false;
    setIsSearching(true);
    searchUsers(debounced)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch((err) => {
        if (!cancelled) toast.error(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setIsSearching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const openChat = (userId: string) => {
    if (openingId) return;
    setOpeningId(userId);
    startConversation(userId)
      .then((id) => {
        setQuery("");
        navigate(`/chat/${id}`);
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setOpeningId(null));
  };

  const visibleConversations = conversations.filter(
    (c): c is Conversation & { other: ChatUser } => c.other !== null
  );

  const renderBody = () => {
    if (isSearchMode) {
      if (isSearching || debounced !== query.trim()) return <Loader label="Searching" />;
      if (!results.length) {
        return (
          <EmptyState
            icon={<Search size={28} />}
            title="No users found"
            description="Try a different name or email"
          />
        );
      }
      return (
        <ul>
          {results.map((u) => (
            <li key={u._id}>
              <button
                type="button"
                disabled={openingId !== null}
                onClick={() => openChat(u._id)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-ink-50 disabled:opacity-60"
              >
                <Avatar name={u.name} src={u.profileImage} isOnline={getPresence(u).isOnline} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink-900">{u.name}</p>
                  <p className="truncate text-sm text-ink-500">{u.email}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      );
    }
    if (isLoadingConversations) return <Loader label="Loading chats" />;
    if (!visibleConversations.length) {
      return (
        <EmptyState
          icon={<MessageCircle size={28} />}
          title="No conversations yet"
          description="Search for a user above to start chatting"
        />
      );
    }
    return (
      <ul>
        {visibleConversations.map((c) => (
          <li key={c.id}>
            <ConversationItem
              conversation={c}
              active={c.id === activeId}
              onClick={() => navigate(`/chat/${c.id}`)}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="border-b border-ink-100 p-4">
        <h2 className="mb-3 font-display text-xl font-bold text-ink-900">Chats</h2>
        <div className="relative">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            maxLength={50}
            placeholder="Search users by name or email"
            className="w-full rounded-xl border border-ink-100 bg-ink-50 py-2.5 pl-9 pr-9 text-sm text-ink-900 outline-none transition focus:border-brand-500 focus:bg-white"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{renderBody()}</div>
    </div>
  );
};

export default Sidebar;
