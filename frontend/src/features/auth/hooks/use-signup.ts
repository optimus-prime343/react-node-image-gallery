import { useMutation } from '@tanstack/react-query'

import { ApiResponseSuccess, axiosClient } from '../../../shared'
import { apiUrls } from '../../../shared/constants/api-urls'
import { AuthPayload } from '../schemas/auth-schema'
import { autoLogin } from '../utils/auth'

export const useSignup = () => {
  return useMutation<string, Error, AuthPayload>(signupPayload =>
    axiosClient
      .post<ApiResponseSuccess<{ accessToken: string }>>(
        apiUrls.signup,
        signupPayload
      )
      .then(res => {
        const { accessToken } = res.data.data
        autoLogin(accessToken)
        return 'Signup successful'
      })
      .catch(error => {
        throw new Error('Invalid credentials')
      })
  )
}