import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { errorResponse } from '../helper/response'

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source])
    if (!result.success) return errorResponse(res, 400, result.error.issues[0].message)
    ;(req as any)[source] = result.data
    next()
  }
}
