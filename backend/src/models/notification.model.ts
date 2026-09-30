import mongoose, { Schema } from 'mongoose'
import { INotification } from '../interfaces/notification'
import { NotificationType } from '../enums/notification.enum'

const notificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  message: { type: String, required: true },
  type: { type: String, enum: Object.values(NotificationType), default: NotificationType.MESSAGE },
  isRead: { type: Boolean, default: false }
}, { timestamps: true })

export default mongoose.model<INotification>('Notification', notificationSchema)
