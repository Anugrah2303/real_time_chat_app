export const APP_NAME = "ChatNest";
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_REASON_LENGTH = 300;
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const MESSAGES_PAGE_SIZE = 30;
export const TYPING_IDLE_MS = 2000;
export const TYPING_EXPIRE_MS = 5000;
export const SEARCH_DEBOUNCE_MS = 300;
export const SEND_TIMEOUT_MS = 10000;

export const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
];

export const IMAGE_FILE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export const SOCKET_EVENTS = {
  PRESENCE: "presence",
  ONLINE_LIST: "online-list",
  MESSAGE_SEND: "message:send",
  MESSAGE_NEW: "message:new",
  MESSAGE_READ: "message:read",
  MESSAGE_DELETED: "message:deleted",
  MESSAGES_STATUS: "messages:status",
  TYPING: "typing",
  NOTIFICATION_NEW: "notification:new",
} as const;
