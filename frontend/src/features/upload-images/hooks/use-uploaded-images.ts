import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useRef } from 'react'

import { apiUrls } from '~constants/api-urls'
import { useUser } from '~features/auth'
import { ApiResponseSuccess, QueryKeys } from '~types'
import { axiosClient } from '~utils'

import { UploadedImage } from '../models/uploaded-image'

const sortUploadedImagesByDate = (
  uploadedImages: UploadedImage[]
): Record<string, UploadedImage[]> => {
  const imagesByUploadDate = uploadedImages.reduce((acc, curr) => {
    const imageUploadDate = dayjs(curr.createdAt).format('YYYY-MM-DD')
    if (imageUploadDate in acc) {
      acc[imageUploadDate] = [...acc[imageUploadDate], curr]
    } else {
      acc[imageUploadDate] = [curr]
    }
    return acc
  }, {} as Record<string, UploadedImage[]>)
  return imagesByUploadDate
}
export const useUploadedImages = <TRefElement extends HTMLElement>(perPage = 20) => {
  const { data: user } = useUser()
  const ref = useRef<TRefElement | null>(null)
  const {
    data: uploadedImagePages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    ...rest
  } = useInfiniteQuery(
    [QueryKeys.UPLOADED_IMAGES, user?.id],
    ({ pageParam = 1 }) =>
      axiosClient.get<
        ApiResponseSuccess<{
          images: UploadedImage[]
          nextPage: number
          prevPage: number
        }>
      >(apiUrls.uploadImages, { params: { page: pageParam, perPage } }),
    {
      getNextPageParam: lastPage => lastPage.data.data.nextPage,
      getPreviousPageParam: firstPage => firstPage.data.data.prevPage,
    }
  )
  const uploadImagesByPage =
    uploadedImagePages?.pages.map(page => page.data.data.images).flat() ?? []
  const uploadedImagesByDate = sortUploadedImagesByDate(uploadImagesByPage)

  const isImageLastInArray = (imageId: string) =>
    uploadImagesByPage[uploadImagesByPage.length - 1].id === imageId

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage()
        }
      }
    })
    observer.observe(ref.current)
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])
  return { ref, isImageLastInArray, uploadedImagesByDate, ...rest }
}
