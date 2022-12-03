import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { verifyJWT } from '../modules/auth/auth-utils.js'
import { prisma } from '../utils/db.js'

const isTokenExpired = (expirationEpoch: number): boolean => {
  const currentDate = new Date()
  const expirationDate = new Date(expirationEpoch * 1000) //converting epoch to milliseconds
  return currentDate > expirationDate
}
const authenticated = expressAsyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization
  if (authorizationHeader === undefined) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, 'Login required'))
  }
  const token = authorizationHeader.split(' ')[1]
  const { userId, exp } = await verifyJWT<{ userId: string; exp: number }>(
    token
  )
  if (isTokenExpired(exp)) {
    return next(
      createHttpError(
        StatusCodes.UNAUTHORIZED,
        'Session expired. Please login again'
      )
    )
  }
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user === null) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, 'User not found'))
  }
  res.locals.user = user
  next()
})
export { authenticated }
