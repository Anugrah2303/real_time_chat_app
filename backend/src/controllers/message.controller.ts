import Message from '../models/message.model'
import Conversation from '../models/conversation.model'
import asyncHandler from '../helper/asyncHandler'
import { successResponse, errorResponse } from '../helper/response'
import { MessageType } from '../enums/message.enum'
import { SOCKET_EVENTS } from '../constants/socketEvents'
import { isParticipant } from '../utils/conversation'

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) return errorResponse(res, 400, 'File missing')
  return successResponse(res, 200, 'File uploaded', {
    url: '/uploads/' + req.file.filename,
    fileName: req.file.originalname.slice(0, 100),
    messageType: req.file.mimetype.startsWith('image/') ? MessageType.IMAGE : MessageType.FILE
  })
})

export const getMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.conversationId)
  if (!conversation || !isParticipant(conversation, req.user!.id)) return errorResponse(res, 403, 'Access denied')

  const { limit, before } = req.query as unknown as { limit: number; before?: string }
  const filter: Record<string, unknown> = { conversationId: conversation._id }
  if (before) filter.createdAt = { $lt: new Date(before) }

  const docs = await Message.find(filter).sort({ createdAt: -1 }).limit(limit + 1)
  const hasMore = docs.length > limit
  const messages = docs.slice(0, limit).reverse()

  return successResponse(res, 200, 'Messages fetched', { messages, hasMore })
})

export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id)
  if (!message || message.senderId.toString() !== req.user!.id) return errorResponse(res, 404, 'Message not found')

  message.deleted = true
  message.content = ''
  message.fileName = ''
  await message.save()

  const io = req.app.get('io')
  const payload = { id: message.id, conversationId: message.conversationId }
  io.to(message.senderId.toString()).to(message.receiverId.toString()).emit(SOCKET_EVENTS.MESSAGE_DELETED, payload)

  return successResponse(res, 200, 'Message deleted')
})
