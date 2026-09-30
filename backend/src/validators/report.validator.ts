import { z } from 'zod'
import { objectId } from './common'

export const createReportSchema = z.object({
  reportedUserId: objectId,
  messageId: objectId.optional(),
  reason: z.string().trim().min(1, 'Reason must be 1-300 characters').max(300, 'Reason must be 1-300 characters')
})
