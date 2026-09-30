import Notification from '../models/notification.model'
import asyncHandler from '../helper/asyncHandler'
import { successResponse, errorResponse } from '../helper/response'

export const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user!.id
  const [notifications, unread] = await Promise.all([
    Notification.find({ userId }).sort({ createdAt: -1 }).limit(50),
    Notification.countDocuments({ userId, isRead: false })
  ])
  return successResponse(res, 200, 'Notifications fetched', { notifications, unread })
})

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user!.id, isRead: false }, { isRead: true })
  return successResponse(res, 200, 'All notifications marked as read')
})

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id }, { isRead: true }, { new: true })
  if (!notification) return errorResponse(res, 404, 'Notification not found')
  return successResponse(res, 200, 'Notification marked as read', notification)
})
