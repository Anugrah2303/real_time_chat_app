import mongoose from 'mongoose'
import Conversation from '../models/conversation.model'
import { IConversation } from '../interfaces/conversation'

type Id = string | mongoose.Types.ObjectId

export const getOrCreateConversation = async (a: Id, b: Id) => {
  const pairKey = [String(a), String(b)].sort().join('_')
  const conversation = await Conversation.findOneAndUpdate(
    { pairKey },
    { $setOnInsert: { participants: [a, b], pairKey } },
    { upsert: true, new: true }
  )
  return conversation as IConversation
}

export const isParticipant = (conversation: IConversation, userId: string) => {
  return conversation.participants.some(p => p.toString() === userId)
}
