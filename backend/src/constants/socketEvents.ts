export const SOCKET_EVENTS = {
  PRESENCE: 'presence',
  ONLINE_LIST: 'online-list',
  MESSAGE_SEND: 'message:send',
  MESSAGE_NEW: 'message:new',
  MESSAGE_READ: 'message:read',
  MESSAGE_DELETED: 'message:deleted',
  MESSAGES_STATUS: 'messages:status',
  TYPING: 'typing',
  NOTIFICATION_NEW: 'notification:new'
} as const
