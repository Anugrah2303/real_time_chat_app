import express from 'express'
import { authentication } from '../middleware/authentication'
import { validate } from '../middleware/zod'
import upload from '../middleware/upload'
import { getMessagesQuerySchema } from '../validators/message.validator'
import { uploadFile, getMessages, deleteMessage } from '../controllers/message.controller'

const router = express.Router()

router.use(authentication)

router.post('/upload', upload.single('file'), uploadFile)
router.get('/:conversationId', validate(getMessagesQuerySchema, 'query'), getMessages)
router.delete('/:id', deleteMessage)

export default router
