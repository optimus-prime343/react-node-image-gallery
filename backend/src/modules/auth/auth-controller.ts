import type { User } from '@prisma/client'
import argon from 'argon2'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { prisma } from '../../utils/db.js'
import { logger } from '../../utils/logger.js'
import type { AuthPayload } from './auth-schema.js'
import { createAuthSession } from './auth-service.js'
import { sendCookie } from './auth-utils.js'

const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body as AuthPayload
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (user === null) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, 'No user found'))
  }
  const isPasswordCorrect = await argon.verify(user.password, password)
  if (!isPasswordCorrect) {
    return next(
      createHttpError(
        StatusCodes.UNAUTHORIZED,
        'Username or password is incorrect'
      )
    )
  }
  const { accessToken, refreshToken } = await createAuthSession(user.id)
  logger.info(`${user.email} logged into their account`)
  sendCookie('accessToken', accessToken)(req, res, next)
  sendCookie('refreshToken', refreshToken)(req, res, next)
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Login successful'
  })
})
const signup = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body as AuthPayload
  const userAlreadyExists = await prisma.user.findUnique({
    where: { email }
  })
  if (userAlreadyExists !== null) {
    return next(createHttpError(StatusCodes.CONFLICT, 'Email already exists'))
  }
  const hashedPassword = await argon.hash(password)
  const user = await prisma.user.create({
    data: { email, password: hashedPassword }
  })
  const { accessToken, refreshToken } = await createAuthSession(user.id)
  logger.info(`${user.email} signed up for an account`)
  sendCookie('accessToken', accessToken)(req, res, next)
  sendCookie('refreshToken', refreshToken)(req, res, next)
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Signup successful'
  })
})
const logout = expressAsyncHandler(async (req, res, next) => {
  const { refreshToken } = req.cookies
  const session = await prisma.session.findFirst({ where: { refreshToken } })
  if (session === null) {
    return next(createHttpError(StatusCodes.UNAUTHORIZED, 'No session found'))
  }
  await prisma.session.delete({ where: { id: session.id } })
  logger.info(`${session.userId} logged out of their account`)
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken')
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Logout successful'
  })
})

const profile = expressAsyncHandler(async (_req, res, _next) => {
  const { user } = res.locals as { user?: User }
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Profile fetched successfully',
    // here we are sending null instead of undefined because react-query complains if we return undefined from a query
    data: { user: user === undefined ? null : user }
  })
})

export { login, logout, profile, signup }
