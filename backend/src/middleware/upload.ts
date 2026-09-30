import multer from 'multer'
import crypto from 'crypto'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE, UPLOAD_DIR } from '../constants/chat'
import { AppError } from '../helper/appError'

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, crypto.randomUUID() + ALLOWED_FILE_TYPES[file.mimetype])
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_FILE_TYPES[file.mimetype]) return cb(null, true)
    cb(new AppError('File type not allowed', 400))
  }
})

export default upload
