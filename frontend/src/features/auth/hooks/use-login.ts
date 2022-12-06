import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiResponseFailure, ApiResponseSuccess, axiosClient } from '../../../shared'
import { apiUrls } from '../../../shared/constants/api-urls'
import { AuthPayload } from '../schemas/auth-schema'
import { autoLogin } from '../utils/auth'

export const useLogin = () => {
  return useMutation<string, Error, AuthPayload>(loginPayload =>
    axiosClient
      .post<ApiResponseSuccess<{ accessToken: string }>>(apiUrls.login, loginPayload)
      .then(res => {
        const { accessToken } = res.data.data
        autoLogin(accessToken)
        return 'Successfully logged in'
      })
      .catch(error => {
        console.error(error.response?.data)
        throw new Error(
          (error as AxiosError<ApiResponseFailure<{ error: string }>>).response?.data
            ?.data?.error ?? 'Invalid credentials'
        )
      })
  )
}