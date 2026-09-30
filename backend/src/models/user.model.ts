import mongoose, { Schema } from 'mongoose'
import { IUser } from '../interfaces/user'
import { UserRole, UserStatus } from '../enums/user.enum'

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
  status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true })

export default mongoose.model<IUser>('User', userSchema)
