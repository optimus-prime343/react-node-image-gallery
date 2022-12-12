import config from 'config'

import { prisma } from '../../utils/db.js'
import { generateJWT } from './auth-utils.js'

const accessTokenExpiresIn = config.get<string>('ACCESS_TOKEN_EXPIRES_IN')
const refreshTokenExpiresIn = config.get<string>('REFRESH_TOKEN_EXPIRES_IN')

const createAuthSession = async (
  userId: string,
  onError?: (error: Error) => void
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = await generateJWT(userId, {
    expiresIn: accessTokenExpiresIn
  })
  const refreshToken = await generateJWT(userId, {
    expiresIn: refreshTokenExpiresIn
  })
  try {
    await prisma.session.create({
      data: {
        userId,
        refreshToken
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    if (error instanceof Error) {
      onError?.(error)
    }
    return { accessToken, refreshToken }
  }
}

export { createAuthSession }
