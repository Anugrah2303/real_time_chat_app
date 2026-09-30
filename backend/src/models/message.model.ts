import mongoose, { Schema } from 'mongoose'
import { IMessage } from '../interfaces/message'
import { MessageType, MessageStatus } from '../enums/message.enum'

const messageSchema = new Schema<IMessage>({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageType: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT },
  content: { type: String, default: '' },
  fileName: { type: String, default: '' },
  status: { type: String, enum: Object.values(MessageStatus), default: MessageStatus.SENT },
  deleted: { type: Boolean, default: false }
}, { timestamps: true })

messageSchema.index({ conversationId: 1, createdAt: -1 })
messageSchema.index({ receiverId: 1, status: 1 })

export default mongoose.model<IMessage>('Message', messageSchema)
