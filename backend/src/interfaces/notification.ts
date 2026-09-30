import mongoose, { Document } from 'mongoose'
import { NotificationType } from '../enums/notification.enum'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  conversationId?: mongoose.Types.ObjectId
  message: string
  type: NotificationType
  isRead: boolean
  createdAt: Date
}
