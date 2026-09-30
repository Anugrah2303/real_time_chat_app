import express from 'express'
import authRoutes from './auth.route'
import userRoutes from './user.route'
import conversationRoutes from './conversation.route'
import messageRoutes from './message.route'
import notificationRoutes from './notification.route'
import reportRoutes from './report.route'
import adminRoutes from './admin.route'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/conversations', conversationRoutes)
router.use('/messages', messageRoutes)
router.use('/notifications', notificationRoutes)
router.use('/reports', reportRoutes)
router.use('/admin', adminRoutes)

export default router
