import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import nookies from 'nookies'

import {
  ApiResponseFailure,
  ApiResponseSuccess,
  axiosClient,
  QueryKeys,
  User,
} from '../../../shared'
import { apiUrls } from '../../../shared/constants/api-urls'

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
  const { accessToken } = nookies.get(undefined, 'accessToken')
  return useQuery<User, Error>([QueryKeys.USER], () => fetchUser(), {
    enabled: !!accessToken,
  })
}
