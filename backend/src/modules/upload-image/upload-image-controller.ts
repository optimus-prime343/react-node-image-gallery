import type { User } from '@prisma/client'
import expressAsyncHandler from 'express-async-handler'
import { StatusCodes } from 'http-status-codes'

import { prisma } from '../../utils/db.js'
import type { UploadImagePayload } from './upload-image-schema.js'

const getUploadedImages = expressAsyncHandler(async (_req, res, _next) => {
  const { user } = res.locals as { user: User }
  const images = await prisma.image.findMany({
    where: {
      userId: user.id
    }
  })
  res.status(StatusCodes.OK).json({
    status: 'success',
    message: 'Images fetched successfully',
    data: { images }
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
