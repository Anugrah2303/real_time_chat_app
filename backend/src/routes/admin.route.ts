import express from 'express'
import { authentication } from '../middleware/authentication'
import { authorization } from '../middleware/authorization'
import { UserRole } from '../enums/user.enum'
import { getStats, getUsers, toggleBlockUser, getReports, resolveReport } from '../controllers/admin.controller'

const router = express.Router()

router.use(authentication, authorization(UserRole.ADMIN))

router.get('/stats', getStats)
router.get('/users', getUsers)
router.patch('/users/:id/block', toggleBlockUser)
router.get('/reports', getReports)
router.patch('/reports/:id/resolve', resolveReport)

export default router
