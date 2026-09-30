import { useCallback, useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { SOCKET_EVENTS, TYPING_IDLE_MS } from "../utils/constants";

const useTyping = (receiverId: string | null) => {
  const { socket } = useSocket();
  const typingRef = useRef(false);
  const timerRef = useRef<number | undefined>(undefined);

  const stop = useCallback(() => {
    window.clearTimeout(timerRef.current);
    if (typingRef.current && socket && receiverId) {
      socket.emit(SOCKET_EVENTS.TYPING, { to: receiverId, isTyping: false });
    }
    typingRef.current = false;
  }, [socket, receiverId]);

  const start = useCallback(() => {
    if (!socket || !receiverId) return;
    if (!typingRef.current) {
      typingRef.current = true;
      socket.emit(SOCKET_EVENTS.TYPING, { to: receiverId, isTyping: true });
    }
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(stop, TYPING_IDLE_MS);
  }, [socket, receiverId, stop]);

  useEffect(() => stop, [stop]);

  return { start, stop };
};

export default useTyping;
