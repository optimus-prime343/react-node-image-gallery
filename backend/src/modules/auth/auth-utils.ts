import config from 'config'
import type { NextFunction, Request, RequestHandler, Response } from 'express'
import jsonwebtoken from 'jsonwebtoken'

type CookieName = 'accessToken' | 'refreshToken'

const JWTSecret = config.get<string>('JWT_SECRET')

export const generateJWT = (
  userId: string,
  options: jsonwebtoken.SignOptions
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign({ userId }, JWTSecret, options, (error, token) => {
      if (error) return reject(error)
      if (!token) return reject(new Error('No token generated'))
      resolve(token)
    })
  })
}
export const verifyJWT = <TResponse>(token: string): Promise<TResponse> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, JWTSecret, (error, data) => {
      if (error) return reject(error)
      if (!data) return reject(new Error('No data'))
      resolve(data as TResponse)
    })
  })
}
export const sendCookie = (name: CookieName, value: string): RequestHandler => {
  const COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000 // 30 days
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.cookie(name, value, {
      maxAge: COOKIE_MAX_AGE,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    })
    next()
  }
}
