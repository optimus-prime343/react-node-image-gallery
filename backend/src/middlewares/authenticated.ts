import config from 'config'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import jsonwebtoken from 'jsonwebtoken'

import {
  generateJWT,
  sendCookie,
  verifyJWT
} from '../modules/auth/auth-utils.js'
import { prisma } from '../utils/db.js'
import { logger } from '../utils/logger.js'

const UNAUTHORIZED = 'Unauthorized. Please login'

const isTokenExpired = (expirationEpoch: number): boolean => {
  const currentDate = new Date()
  const expirationDate = new Date(expirationEpoch * 1000) //converting epoch to milliseconds
  return currentDate > expirationDate
}
const authenticated = expressAsyncHandler(async (req, res, next) => {
  const requestUrl = req.url
  const { accessToken, refreshToken } = req.cookies as Record<string, string>
  if (refreshToken === undefined) {
    if (requestUrl === '/profile') {
      // allow access to profile page without login
      return next()
    }
    return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  }
  const { exp: refreshTokenExp } = await verifyJWT<{
    userId: string
    exp: number
  }>(refreshToken)
  if (isTokenExpired(refreshTokenExp)) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  }
  const session = await prisma.session.findFirst({ where: { refreshToken } })
  if (session === null) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  }
  const user = await prisma.user.findUnique({ where: { id: session.userId } })

  if (user === null) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, UNAUTHORIZED))
  }
  res.locals.user = user
  await verifyJWT(accessToken).catch(async error => {
    if (error instanceof jsonwebtoken.TokenExpiredError) {
      logger.info('Access token expired. Generating new access token')
      const newAccessToken = await generateJWT(user.id, {
        expiresIn: config.get('ACCESS_TOKEN_EXPIRES_IN')
      })
      sendCookie('accessToken', newAccessToken)(req, res, next)
    }
  })
  next()
})
export { authenticated }
