import jwt from 'jsonwebtoken'
import { UserRole } from '../enums/user.enum'
import { JWT_EXPIRY } from '../constants/auth'

const generateToken = (id: string, role: UserRole) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: JWT_EXPIRY })
}

export default generateToken
