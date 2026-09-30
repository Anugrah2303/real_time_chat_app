import mongoose, { Document } from 'mongoose'
import { ReportStatus } from '../enums/report.enum'

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId
  reportedUserId: mongoose.Types.ObjectId
  messageId?: mongoose.Types.ObjectId
  reason: string
  status: ReportStatus
}
