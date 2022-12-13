import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { ApiResponseFailure, ApiResponseSuccess } from '~/types'
import { apiUrls } from '~constants/api-urls'
import { axiosClient } from '~utils'

import { AuthPayload } from '../schemas/auth-schema'

export const useLogin = () => {
  return useMutation<string, Error, AuthPayload>(loginPayload =>
    axiosClient
      .post<ApiResponseSuccess<{ accessToken: string }>>(apiUrls.login, loginPayload)
      .then(() => {
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
