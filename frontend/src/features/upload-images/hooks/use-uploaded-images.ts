import { useQuery } from '@tanstack/react-query'

import { apiUrls } from '~constants/api-urls'
import { ApiResponseSuccess, QueryKeys } from '~types'
import { axiosClient } from '~utils'

import { UploadedImage } from '../models/uploaded-image'

export const useUploadedImages = () => {
  return useQuery(
    [QueryKeys.UPLOADED_IMAGES],
    () =>
      axiosClient
        .get<ApiResponseSuccess<{ images: UploadedImage[] }>>(apiUrls.uploadImages)
        .then(res => res.data.data.images)
        .catch(error => {
          throw new Error(error.response?.data?.message ?? 'Something went wrong')
        }),
    { initialData: [] }
  )
}
