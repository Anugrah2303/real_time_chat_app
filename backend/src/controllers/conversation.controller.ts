import { Types } from 'mongoose'
import User from '../models/user.model'
import Conversation from '../models/conversation.model'
import Message from '../models/message.model'
import asyncHandler from '../helper/asyncHandler'
import { successResponse, errorResponse } from '../helper/response'
import { MessageStatus } from '../enums/message.enum'
import { UserStatus } from '../enums/user.enum'
import { getOrCreateConversation } from '../utils/conversation'
import { isOnline } from '../utils/onlineUsers'

export const getMyConversations = asyncHandler(async (req, res) => {
  const me = req.user!.id

  const conversations = await Conversation.find({ participants: me, lastMessage: { $exists: true } })
    .sort({ lastMessageAt: -1 })
    .populate('participants', 'name profileImage lastSeen')
    .populate('lastMessage')

  const unreadCounts = await Message.aggregate([
    { $match: { receiverId: new Types.ObjectId(me), status: { $ne: MessageStatus.READ }, deleted: false } },
    { $group: { _id: '$conversationId', count: { $sum: 1 } } }
  ])
  const unreadMap = new Map<string, number>(unreadCounts.map(u => [String(u._id), u.count]))

  const data = conversations.map(c => {
    const other = (c.participants as any[]).find(p => p._id.toString() !== me)
    return {
      id: c.id,
      other: other ? { ...other.toObject(), isOnline: isOnline(other._id) } : null,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      unread: unreadMap.get(c.id) || 0
    }
  })

  return successResponse(res, 200, 'Conversations fetched', data)
})

export const createConversation = asyncHandler(async (req, res) => {
  const { userId } = req.body
  const other = await User.findById(userId).select('name profileImage lastSeen status')
  if (!other || other.status === UserStatus.BLOCKED || other.id === req.user!.id)
    return errorResponse(res, 400, 'Cannot start a chat with this user')
  const conversation = await getOrCreateConversation(req.user!.id, other.id)
  return successResponse(res, 200, 'Conversation ready', { id: conversation.id, other: { ...other.toObject(), isOnline: isOnline(other._id) } })
})
