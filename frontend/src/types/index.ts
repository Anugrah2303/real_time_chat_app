export enum UserRole {
  USER = "user",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
}

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read",
}

export enum NotificationType {
  MESSAGE = "message",
  SYSTEM = "system",
}

export enum ReportStatus {
  OPEN = "open",
  RESOLVED = "resolved",
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ChatUser {
  _id: string;
  name: string;
  profileImage: string;
  lastSeen: string;
  isOnline: boolean;
}

export interface SearchUser extends ChatUser {
  email: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  messageType: MessageType;
  content: string;
  fileName: string;
  status: MessageStatus;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  other: ChatUser | null;
  lastMessage: Message | null;
  lastMessageAt: string;
  unread: number;
}

export interface NewConversation {
  id: string;
  other: ChatUser;
}

export interface MessagesPage {
  messages: Message[];
  hasMore: boolean;
}

export interface UploadResult {
  url: string;
  fileName: string;
  messageType: MessageType;
}

export interface ProfileUpdateResult {
  id: string;
  name: string;
  profileImage: string;
}

export interface AppNotification {
  _id: string;
  userId: string;
  conversationId?: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: AppNotification[];
  unread: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  status: UserStatus;
  lastSeen: string;
  createdAt: string;
}

export interface AdminReport {
  _id: string;
  reason: string;
  status: ReportStatus;
  createdAt: string;
  reporterId: { _id: string; name: string; email: string };
  reportedUserId: { _id: string; name: string; email: string; status: UserStatus };
  messageId?: { _id: string; content: string; messageType: MessageType; deleted: boolean };
}

export interface AdminStats {
  users: number;
  blocked: number;
  messages: number;
  openReports: number;
  online: number;
}

export interface SocketAck {
  success: boolean;
  message: string;
  data?: Message;
}

export interface MessageStatusEvent {
  by: string;
  status: MessageStatus.DELIVERED | MessageStatus.READ;
  conversationId?: string;
}

export interface MessageDeletedEvent {
  id: string;
  conversationId: string;
}

export interface TypingEvent {
  from: string;
  isTyping: boolean;
}

export interface PresenceEvent {
  userId: string;
  online: boolean;
  lastSeen?: string;
}
