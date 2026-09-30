import { z } from 'zod'
import { objectId } from './common'

export const createConversationSchema = z.object({
  userId: objectId
})
