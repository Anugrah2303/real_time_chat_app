import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.model'
import { errorResponse } from '../helper/response'
import { JwtPayload } from '../interfaces/user'
import { UserStatus } from '../enums/user.enum'

export const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return errorResponse(res, 401, 'Not authorized')
  const token = header.split(' ')[1]

  let payload: JwtPayload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
  } catch {
    return errorResponse(res, 401, 'Invalid or expired token')
  }

  const user = await User.findById(payload.id).select('role status')
  if (!user) return errorResponse(res, 401, 'User not found')
  if (user.status === UserStatus.BLOCKED) return errorResponse(res, 403, 'Your account is blocked')

  req.user = { id: user.id, role: user.role }
  next()
}
