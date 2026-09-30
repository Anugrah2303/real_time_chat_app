import Report from '../models/report.model'
import User from '../models/user.model'
import Message from '../models/message.model'
import asyncHandler from '../helper/asyncHandler'
import { successResponse, errorResponse } from '../helper/response'

export const createReport = asyncHandler(async (req, res) => {
  const { reportedUserId, messageId, reason } = req.body
  const me = req.user!.id

  if (reportedUserId === me) return errorResponse(res, 400, 'You cannot report yourself')
  if (!(await User.exists({ _id: reportedUserId }))) return errorResponse(res, 404, 'User not found')

  if (messageId) {
    const message = await Message.findById(messageId)
    const isMine = message && (message.senderId.toString() === me || message.receiverId.toString() === me)
    if (!message || !isMine) return errorResponse(res, 404, 'Message not found')
  }

  await Report.create({ reporterId: me, reportedUserId, messageId, reason })
  return successResponse(res, 201, 'Report submitted')
})
