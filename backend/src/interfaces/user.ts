import { Document } from 'mongoose'
import { UserRole, UserStatus } from '../enums/user.enum'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  profileImage: string
  role: UserRole
  status: UserStatus
  lastSeen: Date
  createdAt: Date
  updatedAt: Date
}

export interface JwtPayload {
  id: string
  role: UserRole
}
