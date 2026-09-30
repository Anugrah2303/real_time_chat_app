import mongoose, { Document } from 'mongoose'

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[]
  pairKey: string
  lastMessage?: mongoose.Types.ObjectId
  lastMessageAt: Date
}
