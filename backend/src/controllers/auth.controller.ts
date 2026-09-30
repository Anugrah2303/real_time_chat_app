import bcrypt from 'bcryptjs'
import User from '../models/user.model'
import generateToken from '../utils/generateToken'
import publicUser from '../utils/publicUser'
import asyncHandler from '../helper/asyncHandler'
import { successResponse, errorResponse } from '../helper/response'
import { UserStatus } from '../enums/user.enum'
import { BCRYPT_SALT_ROUNDS } from '../constants/auth'

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const existing = await User.findOne({ email })
  if (existing) return errorResponse(res, 409, 'Email already registered')
  const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS)
  const user = await User.create({ name, email, password: hashed })
  const token = generateToken(user.id, user.role)
  return successResponse(res, 201, 'Registered successfully', { token, user: publicUser(user) })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email }).select('+password')
  if (!user) return errorResponse(res, 401, 'Invalid email or password')
  const match = await bcrypt.compare(password, user.password)
  if (!match) return errorResponse(res, 401, 'Invalid email or password')
  if (user.status === UserStatus.BLOCKED) return errorResponse(res, 403, 'Your account is blocked')
  const token = generateToken(user.id, user.role)
  return successResponse(res, 200, 'Logged in successfully', { token, user: publicUser(user) })
})

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user!.id)
  if (!user) return errorResponse(res, 404, 'User not found')
  return successResponse(res, 200, 'Profile fetched', { user: publicUser(user) })
})
