import { Server, Socket } from 'socket.io'
import User from '../models/user.model'
import Message from '../models/message.model'
import Conversation from '../models/conversation.model'
import Notification from '../models/notification.model'
import { MessageStatus } from '../enums/message.enum'
import { UserStatus } from '../enums/user.enum'
import { NotificationType } from '../enums/notification.enum'
import { SOCKET_EVENTS } from '../constants/socketEvents'
import { sendMessageSchema, readMessagesSchema, typingSchema } from '../validators/message.validator'
import { getOrCreateConversation, isParticipant } from '../utils/conversation'
import { isOnline } from '../utils/onlineUsers'

type Ack = (response: { success: boolean; message: string; data?: unknown }) => void

export const registerChatHandlers = (io: Server, socket: Socket) => {
  const me = socket.data.userId as string
  const myName = socket.data.name as string

  socket.on(SOCKET_EVENTS.MESSAGE_SEND, async (payload: unknown, callback?: Ack) => {
    const ack: Ack = typeof callback === 'function' ? callback : () => {}
    try {
      const parsed = sendMessageSchema.safeParse(payload)
      if (!parsed.success) return ack({ success: false, message: parsed.error.issues[0].message })
      const { receiverId, messageType, content, fileName } = parsed.data

      const receiver = await User.findById(receiverId)
      if (!receiver || receiver.status === UserStatus.BLOCKED || receiver.id === me)
        return ack({ success: false, message: 'Cannot send a message to this user' })

      const conversation = await getOrCreateConversation(me, receiver.id)

      const message = await Message.create({
        conversationId: conversation._id,
        senderId: me,
        receiverId: receiver._id,
        messageType,
        content,
        fileName,
        status: isOnline(receiver.id) ? MessageStatus.DELIVERED : MessageStatus.SENT
      })

      await Conversation.findByIdAndUpdate(conversation._id, { lastMessage: message._id, lastMessageAt: message.createdAt })

      const notification = await Notification.create({
        userId: receiver._id,
        conversationId: conversation._id,
        message: `New message from ${myName}`,
        type: NotificationType.MESSAGE
      })

      io.to(receiver.id).emit(SOCKET_EVENTS.MESSAGE_NEW, message)
      io.to(me).emit(SOCKET_EVENTS.MESSAGE_NEW, message)
      io.to(receiver.id).emit(SOCKET_EVENTS.NOTIFICATION_NEW, notification)

      ack({ success: true, message: 'Message sent', data: message })
    } catch (err) {
      console.error(err)
      ack({ success: false, message: 'Failed to send message' })
    }
  })

  socket.on(SOCKET_EVENTS.TYPING, (payload: unknown) => {
    const parsed = typingSchema.safeParse(payload)
    if (!parsed.success) return
    io.to(parsed.data.to).emit(SOCKET_EVENTS.TYPING, { from: me, isTyping: parsed.data.isTyping })
  })

  socket.on(SOCKET_EVENTS.MESSAGE_READ, async (payload: unknown) => {
    try {
      const parsed = readMessagesSchema.safeParse(payload)
      if (!parsed.success) return
      const { conversationId } = parsed.data

      const conversation = await Conversation.findById(conversationId)
      if (!conversation || !isParticipant(conversation, me)) return

      const result = await Message.updateMany(
        { conversationId, receiverId: me, status: { $ne: MessageStatus.READ } },
        { status: MessageStatus.READ }
      )
      if (!result.modifiedCount) return

      const other = conversation.participants.find(p => p.toString() !== me)
      if (other) io.to(other.toString()).emit(SOCKET_EVENTS.MESSAGES_STATUS, { by: me, status: MessageStatus.READ, conversationId })
    } catch (err) {
      console.error(err)
    }
  })
}
