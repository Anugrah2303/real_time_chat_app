import User from '../models/user.model'
import asyncHandler from '../helper/asyncHandler'
import { successResponse, errorResponse } from '../helper/response'
import { UserRole, UserStatus } from '../enums/user.enum'
import { isOnline } from '../utils/onlineUsers'

export const searchUsers = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const filter: Record<string, unknown> = { _id: { $ne: req.user!.id }, role: UserRole.USER, status: UserStatus.ACTIVE }
  if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }]
  const users = await User.find(filter).select('name email profileImage lastSeen').limit(20).lean()
  const data = users.map(u => ({ ...u, isOnline: isOnline(u._id) }))
  return successResponse(res, 200, 'Users fetched', data)
})

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('name profileImage lastSeen status').lean()
  if (!user || user.status === UserStatus.BLOCKED) return errorResponse(res, 404, 'User not found')
  return successResponse(res, 200, 'User fetched', { ...user, isOnline: isOnline(user._id) })
})

export const updateMe = asyncHandler(async (req, res) => {
  const { name, profileImage } = req.body
  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (profileImage !== undefined) updates.profileImage = profileImage
  const user = await User.findByIdAndUpdate(req.user!.id, updates, { new: true })
  if (!user) return errorResponse(res, 404, 'User not found')
  return successResponse(res, 200, 'Profile updated', { id: user.id, name: user.name, profileImage: user.profileImage })
})
