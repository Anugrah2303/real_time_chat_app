import mongoose, { Schema } from 'mongoose'
import { IConversation } from '../interfaces/conversation'

const conversationSchema = new Schema<IConversation>({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
  pairKey: { type: String, required: true, unique: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  lastMessageAt: { type: Date, default: Date.now }
}, { timestamps: true })

conversationSchema.index({ participants: 1, lastMessageAt: -1 })

export default mongoose.model<IConversation>('Conversation', conversationSchema)
