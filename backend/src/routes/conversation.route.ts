import express from 'express'
import { authentication } from '../middleware/authentication'
import { validate } from '../middleware/zod'
import { createConversationSchema } from '../validators/conversation.validator'
import { getMyConversations, createConversation } from '../controllers/conversation.controller'

const router = express.Router()

router.use(authentication)

router.get('/', getMyConversations)
router.post('/', validate(createConversationSchema), createConversation)

export default router
