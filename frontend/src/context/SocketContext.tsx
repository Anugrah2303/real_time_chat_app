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
import { io, type Socket } from "socket.io-client";
import { getCurrentUser } from "../api/auth.api";
import type { ChatUser, PresenceEvent, TypingEvent } from "../types";
import { SOCKET_EVENTS, TYPING_EXPIRE_MS } from "../utils/constants";
import { getServerUrl } from "../utils/server";
import { useAuth } from "./AuthContext";

interface Presence {
  isOnline: boolean;
  lastSeen: string;
}

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  typingUsers: Record<string, boolean>;
  getPresence: (user: ChatUser) => Presence;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token, logout } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [hasOnlineList, setHasOnlineList] = useState(false);
  const [lastSeenMap, setLastSeenMap] = useState<Record<string, string>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const typingTimers = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!token) return;

    const s = io(getServerUrl(), { auth: { token } });
    const timers = typingTimers.current;

    const onConnect = () => setIsConnected(true);

    const onDisconnect = (reason: string) => {
      setIsConnected(false);
      if (reason === "io server disconnect") {
        getCurrentUser()
          .then(() => s.connect())
          .catch(() => undefined);
      }
    };

    const onConnectError = (err: Error) => {
      if (err.message === "Unauthorized") logout();
    };

    const onOnlineList = (ids: string[]) => {
      setOnlineUserIds(new Set(ids));
      setHasOnlineList(true);
    };

    const onPresence = (event: PresenceEvent) => {
      setOnlineUserIds((prev) => {
        const next = new Set(prev);
        if (event.online) next.add(event.userId);
        else next.delete(event.userId);
        return next;
      });
      const lastSeen = event.lastSeen;
      if (!event.online && lastSeen) {
        setLastSeenMap((prev) => ({ ...prev, [event.userId]: lastSeen }));
      }
    };

    const onTyping = ({ from, isTyping }: TypingEvent) => {
      window.clearTimeout(timers[from]);
      setTypingUsers((prev) => ({ ...prev, [from]: isTyping }));
      if (isTyping) {
        timers[from] = window.setTimeout(() => {
          setTypingUsers((prev) => ({ ...prev, [from]: false }));
        }, TYPING_EXPIRE_MS);
      }
    };

    s.on("connect", onConnect);
    s.on("disconnect", onDisconnect);
    s.on("connect_error", onConnectError);
    s.on(SOCKET_EVENTS.ONLINE_LIST, onOnlineList);
    s.on(SOCKET_EVENTS.PRESENCE, onPresence);
    s.on(SOCKET_EVENTS.TYPING, onTyping);
    setSocket(s);

    return () => {
      s.off("connect", onConnect);
      s.off("disconnect", onDisconnect);
      s.off("connect_error", onConnectError);
      s.off(SOCKET_EVENTS.ONLINE_LIST, onOnlineList);
      s.off(SOCKET_EVENTS.PRESENCE, onPresence);
      s.off(SOCKET_EVENTS.TYPING, onTyping);
      s.disconnect();
      Object.values(timers).forEach((timer) => window.clearTimeout(timer));
      Object.keys(timers).forEach((key) => delete timers[key]);
      setSocket(null);
      setIsConnected(false);
      setOnlineUserIds(new Set());
      setHasOnlineList(false);
      setLastSeenMap({});
      setTypingUsers({});
    };
  }, [token, logout]);

  const getPresence = useCallback(
    (user: ChatUser): Presence => {
      const seen = lastSeenMap[user._id];
      const lastSeen = seen && new Date(seen) > new Date(user.lastSeen) ? seen : user.lastSeen;
      return {
        isOnline: hasOnlineList ? onlineUserIds.has(user._id) : user.isOnline,
        lastSeen,
      };
    },
    [hasOnlineList, onlineUserIds, lastSeenMap]
  );

  const value = useMemo(
    () => ({ socket, isConnected, typingUsers, getPresence }),
    [socket, isConnected, typingUsers, getPresence]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
