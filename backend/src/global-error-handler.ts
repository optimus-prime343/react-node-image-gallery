import type { ErrorRequestHandler } from 'express'
import type { HttpError } from 'http-errors'
import { StatusCodes } from 'http-status-codes'

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const typedError = error as HttpError
  const statusCode = typedError.statusCode ?? StatusCodes.BAD_REQUEST
  res.status(statusCode).json({
    status: 'error',
    data: { error: typedError.message }
  })
}

export { globalErrorHandler }
