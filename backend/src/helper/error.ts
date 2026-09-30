import { Request, Response, NextFunction } from 'express'
import { errorResponse } from './response'
import { AppError } from './appError'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) return errorResponse(res, err.statusCode, err.message)
  if (err.name === 'MulterError') return errorResponse(res, 400, err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 2 MB)' : err.message)
  if (err.name === 'CastError') return errorResponse(res, 400, 'Invalid id')
  if (err.code === 11000) return errorResponse(res, 409, 'Duplicate value')
  if (err.type === 'entity.parse.failed') return errorResponse(res, 400, 'Invalid JSON')
  console.error(err)
  return errorResponse(res, 500, 'Something went wrong')
}

export default errorHandler
