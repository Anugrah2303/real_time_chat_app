import { Request, Response, NextFunction } from 'express'
import { errorResponse } from '../helper/response'
import { UserRole } from '../enums/user.enum'

export const authorization = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) return errorResponse(res, 403, 'Forbidden')
    next()
  }
}
