import express from 'express'
import { register, login, getMe } from '../controllers/auth.controller'
import { authentication } from '../middleware/authentication'
import { validate } from '../middleware/zod'
import { registerSchema, loginSchema } from '../validators/auth.validator'

const router = express.Router()

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', authentication, getMe)

export default router
