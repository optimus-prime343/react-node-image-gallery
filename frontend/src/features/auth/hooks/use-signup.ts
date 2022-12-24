import { useMutation } from '@tanstack/react-query'

import { apiUrls } from '~constants/api-urls'
import { ApiResponseSuccess } from '~types'
import { axiosClient } from '~utils'

import { AuthPayload } from '../schemas/auth-schema'

export const useSignup = () => {
  return useMutation<string, Error, AuthPayload>(signupPayload =>
    axiosClient
      .post<ApiResponseSuccess<{ accessToken: string }>>(
        apiUrls.signup,
        signupPayload
      )
      .then(() => {
        return 'Signup successful'
      })
      .catch(() => {
        throw new Error('Invalid credentials')
      })
  )
}
