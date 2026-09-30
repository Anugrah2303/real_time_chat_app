import express from 'express'
import { authentication } from '../middleware/authentication'
import { validate } from '../middleware/zod'
import { updateProfileSchema, searchUsersSchema } from '../validators/user.validator'
import { searchUsers, getUserById, updateMe } from '../controllers/user.controller'

const router = express.Router()

router.use(authentication)

router.get('/', validate(searchUsersSchema, 'query'), searchUsers)
router.put('/me', validate(updateProfileSchema), updateMe)
router.get('/:id', getUserById)

export default router
