import mongoose, { Document } from 'mongoose'
import { MessageType, MessageStatus } from '../enums/message.enum'

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  receiverId: mongoose.Types.ObjectId
  messageType: MessageType
  content: string
  fileName: string
  status: MessageStatus
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}
