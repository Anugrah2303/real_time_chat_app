import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { createConversation, getConversations } from "../api/conversation.api";
import { deleteMessageById, getMessages } from "../api/message.api";
import {
  MessageStatus,
  type Conversation,
  type Message,
  type MessageDeletedEvent,
  type MessageStatusEvent,
  type MessageType,
  type SocketAck,
} from "../types";
import { MESSAGES_PAGE_SIZE, SEND_TIMEOUT_MS, SOCKET_EVENTS } from "../utils/constants";
import { getErrorMessage } from "../utils/format";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

export interface ThreadState {
  items: Message[];
  hasMore: boolean;
  isLoading: boolean;
  isLoadingOlder: boolean;
  loaded: boolean;
}

interface ChatContextValue {
  conversations: Conversation[];
  isLoadingConversations: boolean;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
  activeConversation: Conversation | null;
  getThread: (id: string) => ThreadState | undefined;
  sendMessage: (
    receiverId: string,
    messageType: MessageType,
    content: string,
    fileName: string
  ) => Promise<Message>;
  deleteMessage: (message: Message) => Promise<void>;
  loadOlder: (conversationId: string) => void;
  startConversation: (userId: string) => Promise<string>;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

const EMPTY_THREAD: ThreadState = {
  items: [],
  hasMore: false,
  isLoading: false,
  isLoadingOlder: false,
  loaded: false,
};

const sortConversations = (list: Conversation[]) =>
  [...list].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

const mergeMessages = (a: Message[], b: Message[]) => {
  const map = new Map<string, Message>();
  a.forEach((m) => map.set(m._id, m));
  b.forEach((m) => map.set(m._id, m));
  return [...map.values()].sort((x, y) => new Date(x.createdAt).getTime() - new Date(y.createdAt).getTime());
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const myId = user?.id ?? null;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [threads, setThreads] = useState<Record<string, ThreadState>>({});

  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const conversationsRef = useRef(conversations);
  conversationsRef.current = conversations;
  const threadsRef = useRef(threads);
  threadsRef.current = threads;

  const loadConversations = useCallback(
    () =>
      getConversations()
        .then((list) => {
          const current = activeIdRef.current;
          const fetched = list.map((c) => (c.id === current ? { ...c, unread: 0 } : c));
          setConversations((prev) =>
            sortConversations([
              ...fetched,
              ...prev.filter((c) => !c.lastMessage && !fetched.some((f) => f.id === c.id)),
            ])
          );
        })
        .catch((err) => {
          toast.error(getErrorMessage(err));
        }),
    []
  );

  useEffect(() => {
    if (!myId) return;
    setIsLoadingConversations(true);
    loadConversations().finally(() => setIsLoadingConversations(false));
    return () => {
      setConversations([]);
      setThreads({});
      setActiveId(null);
    };
  }, [myId, loadConversations]);

  const fetchThread = useCallback((id: string, reset: boolean) => {
    setThreads((prev) => ({ ...prev, [id]: { ...(prev[id] ?? EMPTY_THREAD), isLoading: true } }));
    getMessages(id, { limit: MESSAGES_PAGE_SIZE })
      .then((page) => {
        setThreads((prev) => {
          const cur = prev[id] ?? EMPTY_THREAD;
          const fresh = reset || !cur.loaded;
          return {
            ...prev,
            [id]: {
              items: reset ? mergeMessages([], page.messages) : mergeMessages(cur.items, page.messages),
              hasMore: fresh ? page.hasMore : cur.hasMore,
              isLoading: false,
              isLoadingOlder: false,
              loaded: true,
            },
          };
        });
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        setThreads((prev) => ({
          ...prev,
          [id]: { ...(prev[id] ?? EMPTY_THREAD), isLoading: false, loaded: true },
        }));
      });
  }, []);

  useEffect(() => {
    if (!activeId) return;
    setConversations((prev) =>
      prev.some((c) => c.id === activeId && c.unread > 0)
        ? prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
        : prev
    );
    if (!threadsRef.current[activeId]) fetchThread(activeId, false);
  }, [activeId, fetchThread]);

  useEffect(() => {
    if (activeId && socket) {
      socket.emit(SOCKET_EVENTS.MESSAGE_READ, { conversationId: activeId });
    }
  }, [activeId, socket]);

  const applyIncoming = useCallback(
    (m: Message) => {
      if (!myId) return;
      const isMine = m.senderId === myId;
      const cid = m.conversationId;

      setThreads((prev) => {
        const thread = prev[cid];
        if (!thread || thread.items.some((x) => x._id === m._id)) return prev;
        return { ...prev, [cid]: { ...thread, items: [...thread.items, m] } };
      });

      const conv = conversationsRef.current.find((c) => c.id === cid);
      if (!conv) {
        loadConversations();
        return;
      }

      const isNew = conv.lastMessage?._id !== m._id;
      const isActive = activeIdRef.current === cid;
      setConversations((prev) =>
        sortConversations(
          prev.map((c) =>
            c.id !== cid
              ? c
              : {
                  ...c,
                  lastMessage: m,
                  lastMessageAt: m.createdAt,
                  unread: !isMine && isNew && !isActive ? c.unread + 1 : c.unread,
                }
          )
        )
      );

      if (!isMine && isNew && isActive && socket) {
        socket.emit(SOCKET_EVENTS.MESSAGE_READ, { conversationId: cid });
      }
    },
    [myId, socket, loadConversations]
  );

  const applyStatus = useCallback(
    (e: MessageStatusEvent) => {
      if (!myId) return;
      const shouldUpdate = (m: Message) => {
        if (m.senderId !== myId || m.receiverId !== e.by || m.status === MessageStatus.READ) return false;
        if (e.status === MessageStatus.READ) return m.conversationId === e.conversationId;
        return m.status === MessageStatus.SENT;
      };
      const update = (m: Message): Message => (shouldUpdate(m) ? { ...m, status: e.status } : m);

      setThreads((prev) => {
        const next = { ...prev };
        Object.keys(prev).forEach((key) => {
          const thread = prev[key];
          if (thread.items.some(shouldUpdate)) next[key] = { ...thread, items: thread.items.map(update) };
        });
        return next;
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.lastMessage && shouldUpdate(c.lastMessage) ? { ...c, lastMessage: update(c.lastMessage) } : c
        )
      );
    },
    [myId]
  );

  const applyDeleted = useCallback(
    (e: MessageDeletedEvent) => {
      const mark = (m: Message): Message =>
        m._id === e.id ? { ...m, deleted: true, content: "", fileName: "" } : m;

      setThreads((prev) => {
        const thread = prev[e.conversationId];
        if (!thread) return prev;
        return { ...prev, [e.conversationId]: { ...thread, items: thread.items.map(mark) } };
      });
      setConversations((prev) =>
        prev.map((c) =>
          c.id === e.conversationId && c.lastMessage ? { ...c, lastMessage: mark(c.lastMessage) } : c
        )
      );
      if (activeIdRef.current !== e.conversationId) loadConversations();
    },
    [loadConversations]
  );

  useEffect(() => {
    if (!socket) return;
    let connectedBefore = socket.connected;

    const onConnect = () => {
      if (connectedBefore) {
        const id = activeIdRef.current;
        setThreads((prev) => (id && prev[id] ? { [id]: prev[id] } : {}));
        loadConversations();
        if (id) fetchThread(id, true);
      }
      connectedBefore = true;
    };

    socket.on("connect", onConnect);
    socket.on(SOCKET_EVENTS.MESSAGE_NEW, applyIncoming);
    socket.on(SOCKET_EVENTS.MESSAGE_DELETED, applyDeleted);
    socket.on(SOCKET_EVENTS.MESSAGES_STATUS, applyStatus);
    return () => {
      socket.off("connect", onConnect);
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, applyIncoming);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED, applyDeleted);
      socket.off(SOCKET_EVENTS.MESSAGES_STATUS, applyStatus);
    };
  }, [socket, applyIncoming, applyDeleted, applyStatus, loadConversations, fetchThread]);

  const sendMessage = useCallback(
    (receiverId: string, messageType: MessageType, content: string, fileName: string) =>
      new Promise<Message>((resolve, reject) => {
        if (!socket || !socket.connected) {
          reject(new Error("Not connected to the chat server"));
          return;
        }
        socket
          .timeout(SEND_TIMEOUT_MS)
          .emit(
            SOCKET_EVENTS.MESSAGE_SEND,
            { receiverId, messageType, content, fileName },
            (err: Error | null, res?: SocketAck) => {
              if (err || !res) {
                reject(new Error("Message timed out, please try again"));
                return;
              }
              if (!res.success || !res.data) {
                reject(new Error(res.message));
                return;
              }
              applyIncoming(res.data);
              resolve(res.data);
            }
          );
      }),
    [socket, applyIncoming]
  );

  const deleteMessage = useCallback(
    async (message: Message) => {
      await deleteMessageById(message._id);
      applyDeleted({ id: message._id, conversationId: message.conversationId });
    },
    [applyDeleted]
  );

  const loadOlder = useCallback((id: string) => {
    const thread = threadsRef.current[id];
    if (!thread || !thread.hasMore || thread.isLoading || thread.isLoadingOlder || !thread.items.length) return;
    const before = thread.items[0].createdAt;
    setThreads((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], isLoadingOlder: true } } : prev));
    getMessages(id, { limit: MESSAGES_PAGE_SIZE, before })
      .then((page) => {
        setThreads((prev) => {
          const cur = prev[id];
          if (!cur) return prev;
          return {
            ...prev,
            [id]: {
              ...cur,
              items: mergeMessages(cur.items, page.messages),
              hasMore: page.hasMore,
              isLoadingOlder: false,
            },
          };
        });
      })
      .catch((err) => {
        toast.error(getErrorMessage(err));
        setThreads((prev) =>
          prev[id] ? { ...prev, [id]: { ...prev[id], isLoadingOlder: false, hasMore: false } } : prev
        );
      });
  }, []);

  const startConversation = useCallback(
    async (userId: string) => {
      const created = await createConversation(userId);
      const exists = conversationsRef.current.some((c) => c.id === created.id);
      if (!exists) {
        setConversations((prev) =>
          prev.some((c) => c.id === created.id)
            ? prev
            : sortConversations([
                ...prev,
                {
                  id: created.id,
                  other: created.other,
                  lastMessage: null,
                  lastMessageAt: new Date().toISOString(),
                  unread: 0,
                },
              ])
        );
        loadConversations();
      }
      return created.id;
    },
    [loadConversations]
  );

  const getThread = useCallback((id: string) => threads[id], [threads]);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const value = useMemo(
    () => ({
      conversations,
      isLoadingConversations,
      activeId,
      setActiveId,
      activeConversation,
      getThread,
      sendMessage,
      deleteMessage,
      loadOlder,
      startConversation,
    }),
    [
      conversations,
      isLoadingConversations,
      activeId,
      activeConversation,
      getThread,
      sendMessage,
      deleteMessage,
      loadOlder,
      startConversation,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
