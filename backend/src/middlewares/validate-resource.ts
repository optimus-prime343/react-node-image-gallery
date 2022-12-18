import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import type { AnyZodObject } from 'zod'
import { ZodError } from 'zod'

const validateResource =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query
      })
      req.body = parsedData.body
      req.query = parsedData.query
      req.params = parsedData.params
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(error => ({
          message: error.message,
          path: error.path,
          code: error.code
        }))
        res.status(StatusCodes.BAD_REQUEST).json({
          data: {
            errors
          }
        })
        return
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        data: {
          message: 'Internal server error'
        }
      })
    }
  }

export { validateResource }
