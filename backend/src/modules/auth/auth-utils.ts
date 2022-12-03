import jsonwebtoken from 'jsonwebtoken'

import { config } from '../../config.js'

const JWT_EXPIRES_IN = '30d'

export const generateJWT = <TPayload extends object>(
  payload: TPayload
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(
      payload,
      config.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN },
      (error, token) => {
        if (error) return reject(error)
        if (!token) return reject(new Error('No token generated'))
        resolve(token)
      }
    )
  })
}
export const verifyJWT = <TResponse>(token: string): Promise<TResponse> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, config.JWT_SECRET, (error, data) => {
      if (error) return reject(error)
      if (!data) return reject(new Error('No data'))
      resolve(data as TResponse)
    })
  })
}
