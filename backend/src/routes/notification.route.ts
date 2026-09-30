import express from 'express'
import { authentication } from '../middleware/authentication'
import { getMyNotifications, markAllRead, markRead } from '../controllers/notification.controller'

const router = express.Router()

router.use(authentication)

router.get('/', getMyNotifications)
router.patch('/read-all', markAllRead)
router.patch('/:id/read', markRead)

export default router
