import { z } from 'zod'
import { objectId } from './common'
import { MessageType } from '../enums/message.enum'
import { FILE_URL_REGEX, MAX_MESSAGE_LENGTH } from '../constants/chat'

export const sendMessageSchema = z.object({
  receiverId: objectId,
  messageType: z.nativeEnum(MessageType).default(MessageType.TEXT),
  content: z.string().trim(),
  fileName: z.string().max(100).default('')
}).superRefine((data, ctx) => {
  if (data.messageType === MessageType.TEXT) {
    if (data.content.length < 1 || data.content.length > MAX_MESSAGE_LENGTH) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['content'], message: `Message must be 1-${MAX_MESSAGE_LENGTH} characters` })
    }
  } else if (!FILE_URL_REGEX.test(data.content)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['content'], message: 'Invalid file' })
  }
})

export const getMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(30),
  before: z.string().datetime().optional()
})

export const readMessagesSchema = z.object({
  conversationId: objectId
})

export const typingSchema = z.object({
  to: objectId,
  isTyping: z.boolean().default(true)
})
