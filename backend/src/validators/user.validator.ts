import { z } from 'zod'
import { FILE_URL_REGEX } from '../constants/chat'

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be 2-50 characters').max(50, 'Name must be 2-50 characters').optional(),
  profileImage: z.string().refine(v => v === '' || FILE_URL_REGEX.test(v), 'Invalid image').optional()
})

export const searchUsersSchema = z.object({
  q: z.string().trim().max(50).optional().default('')
})
