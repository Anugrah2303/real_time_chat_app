import User from '../models/user.model'
import Message from '../models/message.model'
import Report from '../models/report.model'
import asyncHandler from '../helper/asyncHandler'
import { successResponse, errorResponse } from '../helper/response'
import { UserRole, UserStatus } from '../enums/user.enum'
import { ReportStatus } from '../enums/report.enum'
import { getOnlineUserIds } from '../utils/onlineUsers'

export const getStats = asyncHandler(async (req, res) => {
  const [users, blocked, messages, openReports] = await Promise.all([
    User.countDocuments({ role: UserRole.USER }),
    User.countDocuments({ status: UserStatus.BLOCKED }),
    Message.countDocuments(),
    Report.countDocuments({ status: ReportStatus.OPEN })
  ])
  return successResponse(res, 200, 'Stats fetched', { users, blocked, messages, openReports, online: getOnlineUserIds().length })
})

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: UserRole.USER }).select('name email status lastSeen createdAt').sort({ createdAt: -1 })
  return successResponse(res, 200, 'Users fetched', users)
})

export const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user || user.role === UserRole.ADMIN) return errorResponse(res, 404, 'User not found')
  user.status = user.status === UserStatus.BLOCKED ? UserStatus.ACTIVE : UserStatus.BLOCKED
  await user.save()
  if (user.status === UserStatus.BLOCKED) req.app.get('io').in(user.id).disconnectSockets(true)
  return successResponse(res, 200, `User ${user.status}`, { status: user.status })
})

export const getReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().sort({ createdAt: -1 }).limit(100)
    .populate('reporterId', 'name email')
    .populate('reportedUserId', 'name email status')
    .populate('messageId', 'content messageType deleted')
  return successResponse(res, 200, 'Reports fetched', reports)
})

export const resolveReport = asyncHandler(async (req, res) => {
  const report = await Report.findByIdAndUpdate(req.params.id, { status: ReportStatus.RESOLVED }, { new: true })
  if (!report) return errorResponse(res, 404, 'Report not found')
  return successResponse(res, 200, 'Report resolved', report)
})
