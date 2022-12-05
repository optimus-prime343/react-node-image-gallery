import argon from 'argon2'
import expressAsyncHandler from 'express-async-handler'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'

import { prisma } from '../../utils/db.js'
import type { AuthPayload } from './auth-schema.js'
import { generateJWT } from './auth-utils.js'

const login = expressAsyncHandler(async (req, res, next) => {
  const { email, password } = req.body as AuthPayload
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (user === null) {
    return next(
      createHttpError(
        StatusCodes.UNAUTHORIZED,
        'Username or password is incorrect'
      )
    )
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
  const accessToken = await generateJWT({ userId: user.id })
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Login successful',
    data: { accessToken }
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
  const accessToken = await generateJWT({ userId: user.id })
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    message: 'Signup successful',
    data: { accessToken }
  })
})

export { login, signup }
