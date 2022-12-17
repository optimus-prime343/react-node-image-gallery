import { useMutation } from '@tanstack/react-query'

import { apiUrls } from '~constants/api-urls'
import { ApiResponseSuccess } from '~types'
import { axiosClient } from '~utils'

export const useUploadImageFiles = () => {
  return useMutation<string, Error, File[]>(async imageFiles => {
    const formData = new FormData()
    for (const imageFile of imageFiles) {
      formData.append('images', imageFile)
    }
    return axiosClient
      .post<ApiResponseSuccess>(apiUrls.uploadImages, formData)
      .then(res => res.data.message)
      .catch(error => {
        throw new Error(error.response?.data.message ?? 'Something went wrong')
      })
  })
}
