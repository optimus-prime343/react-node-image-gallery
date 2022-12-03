import config from 'config'
import jsonwebtoken from 'jsonwebtoken'

const JWTSecret = config.get<string>('JWT_SECRET')
const JWTExpiresIn = config.get<string>('JWT_EXPIRES_IN')

export const generateJWT = <TPayload extends object>(
  payload: TPayload
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.sign(
      payload,
      JWTSecret,
      { expiresIn: JWTExpiresIn },
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
    jsonwebtoken.verify(token, JWTSecret, (error, data) => {
      if (error) return reject(error)
      if (!data) return reject(new Error('No data'))
      resolve(data as TResponse)
    })
  })
}
