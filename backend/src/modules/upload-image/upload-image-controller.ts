import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import { StatusCodes } from 'http-status-codes'

import { prisma } from '../../utils/db.js'
import type {
  UploadedImageQuery,
  UploadImagePayload
} from './upload-image-schema.js'

const getUploadedImages = expressAsyncHandler(async (req, res, _next) => {
  const { user } = res.locals as { user: User }
  const query = req.query as UploadedImageQuery
  const page = query.page ?? 1
  const perPage = query.perPage ?? 10

  const totalUploadedImages = await prisma.image.count({
    where: {
      userId: user.id
    }
  })
  const totalPages = Math.ceil(totalUploadedImages / perPage)

  const nextPage = page < totalPages ? page + 1 : null
  const prevPage = page > 1 ? page - 1 : null

  const images = await prisma.image.findMany({
    take: perPage,
    skip: perPage * (page - 1),
    where: {
      userId: user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Images fetched successfully',
    data: { images, currentPage: page, nextPage, prevPage }
  })
})

const uploadImage = expressAsyncHandler(async (req, res, _next) => {
  const { user } = res.locals as { user: User }
  const { uploadedImages } = req.body as UploadImagePayload

  const createImageUrl = (image: string): string =>
    `${req.protocol}://${req.get('host')}/images/${image}`

  const uploadedImagesDB = await Promise.all(
    uploadedImages.map(
      async image =>
        await prisma.image.create({
          data: {
            url: createImageUrl(image),
            userId: user.id
          }
        })
    )
  )
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Image upload successful',
    data: { images: uploadedImagesDB }
  })
})

export { getUploadedImages, uploadImage }
