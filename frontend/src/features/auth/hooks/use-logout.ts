import { useMutation } from '@tanstack/react-query'

import { ApiResponseSuccess } from '~types'
import { axiosClient } from '~utils'

export const useLogout = () => {
  return useMutation<string, Error, undefined>(() =>
    axiosClient
      .get<ApiResponseSuccess>('/auth/logout')
      .then(response => response.data.message)
      .catch(error => {
        throw new Error(error.response?.data ?? 'Something went wrong')
      })
  )
}
