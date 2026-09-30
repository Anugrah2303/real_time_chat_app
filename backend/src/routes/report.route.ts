import express from 'express'
import { authentication } from '../middleware/authentication'
import { validate } from '../middleware/zod'
import { createReportSchema } from '../validators/report.validator'
import { createReport } from '../controllers/report.controller'

const router = express.Router()

router.post('/', authentication, validate(createReportSchema), createReport)

export default router
