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
import { useMatch } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../api/notification.api";
import type { AppNotification } from "../types";
import { SOCKET_EVENTS } from "../utils/constants";
import { useAuth } from "./AuthContext";
import { useSocket } from "./SocketContext";

interface NotificationContextValue {
  notifications: AppNotification[];
  unread: number;
  isLoading: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const match = useMatch("/chat/:conversationId");
  const activeId = match?.params.conversationId ?? null;
  const myId = user?.id ?? null;

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const notificationsRef = useRef(notifications);
  notificationsRef.current = notifications;

  const load = useCallback(
    () =>
      getNotifications()
        .then((data) => {
          setNotifications(data.notifications);
          setUnread(data.unread);
        })
        .catch(() => undefined),
    []
  );

  useEffect(() => {
    if (!myId) return;
    setIsLoading(true);
    load().finally(() => setIsLoading(false));
    return () => {
      setNotifications([]);
      setUnread(0);
    };
  }, [myId, load]);

  const markRead = useCallback(
    (id: string) => {
      const target = notificationsRef.current.find((n) => n._id === id);
      if (!target || target.isRead) return;
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
      setUnread((prev) => Math.max(0, prev - 1));
      markNotificationRead(id).catch(() => {
        load();
      });
    },
    [load]
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => (n.isRead ? n : { ...n, isRead: true })));
    setUnread(0);
    markAllNotificationsRead().catch(() => {
      load();
    });
  }, [load]);

  useEffect(() => {
    if (!activeId || isLoading) return;
    notificationsRef.current
      .filter((n) => n.conversationId === activeId && !n.isRead)
      .forEach((n) => markRead(n._id));
  }, [activeId, isLoading, markRead]);

  useEffect(() => {
    if (!socket) return;
    let connectedBefore = socket.connected;

    const onConnect = () => {
      if (connectedBefore) load();
      connectedBefore = true;
    };

    const onNew = (n: AppNotification) => {
      if (notificationsRef.current.some((x) => x._id === n._id)) return;
      const isOpen = !!n.conversationId && n.conversationId === activeIdRef.current;
      if (isOpen) {
        setNotifications((prev) => [{ ...n, isRead: true }, ...prev].slice(0, 50));
        markNotificationRead(n._id).catch(() => undefined);
        return;
      }
      setNotifications((prev) => [n, ...prev].slice(0, 50));
      setUnread((prev) => prev + 1);
      toast(n.message);
    };

    socket.on("connect", onConnect);
    socket.on(SOCKET_EVENTS.NOTIFICATION_NEW, onNew);
    return () => {
      socket.off("connect", onConnect);
      socket.off(SOCKET_EVENTS.NOTIFICATION_NEW, onNew);
    };
  }, [socket, load]);

  const value = useMemo(
    () => ({ notifications, unread, isLoading, markRead, markAllRead }),
    [notifications, unread, isLoading, markRead, markAllRead]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
