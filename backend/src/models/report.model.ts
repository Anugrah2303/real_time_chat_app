import mongoose, { Schema } from 'mongoose'
import { IReport } from '../interfaces/report'
import { ReportStatus } from '../enums/report.enum'

const reportSchema = new Schema<IReport>({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  messageId: { type: Schema.Types.ObjectId, ref: 'Message' },
  reason: { type: String, required: true, maxlength: 300 },
  status: { type: String, enum: Object.values(ReportStatus), default: ReportStatus.OPEN }
}, { timestamps: true })

export default mongoose.model<IReport>('Report', reportSchema)
