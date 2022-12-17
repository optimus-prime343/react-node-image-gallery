import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import { apiUrls } from '~constants/api-urls'
import { ApiResponseFailure, ApiResponseSuccess, QueryKeys } from '~types'
import { axiosClient } from '~utils'

import { User } from '../models/user'

// we are accepting accessToken since we will be using this function on server side also
export const fetchUser = async (accessToken?: string): Promise<User> => {
  if (accessToken) {
    axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  }
  return axiosClient
    .get<ApiResponseSuccess<{ user: User }>>(apiUrls.profile)
    .then(res => res.data.data.user)
    .catch(error => {
      if (error instanceof AxiosError<ApiResponseFailure>) {
        throw new Error(error.response?.data?.error ?? 'Something went wrong')
      }
      throw new Error('Something went wrong')
    })
}

export const useUser = () => {
  return useQuery<User | null, Error>([QueryKeys.USER], () => fetchUser(), {
    refetchOnWindowFocus: false,
    retry(failureCount, error) {
      if (error.message === 'Unauthorized. Please login') {
        return false
      }
      return failureCount < 3
    },
  })
}
