import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import User from '../models/user.model'
import { UserRole } from '../enums/user.enum'
import { BCRYPT_SALT_ROUNDS } from '../constants/auth'

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string)
  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'Admin@123'

  if (await User.findOne({ email })) {
    console.log('Admin already exists')
  } else {
    await User.create({ name: 'Admin', email, password: await bcrypt.hash(password, BCRYPT_SALT_ROUNDS), role: UserRole.ADMIN })
    console.log(`Admin created: ${email}`)
  }

  await mongoose.disconnect()
}

seed()
