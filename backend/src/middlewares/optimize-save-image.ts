import crypto from 'crypto'
import expressAsyncHandler from 'express-async-handler'
import fs from 'fs'
import createHttpError from 'http-errors'
import { StatusCodes } from 'http-status-codes'
import path from 'path'
import sharp from 'sharp'

import { logger } from '../utils/logger.js'

//  create a new directory named 'images' in public directory if it doesn't exist
const createImageDiretory = (): void => {
  const imageDirectoryPath = path.join(process.cwd(), 'public', 'images')
  fs.open(imageDirectoryPath, 'r', error => {
    if (error?.code === 'ENOENT') {
      logger.info('Image directory does not exist. Creating one...')
      fs.mkdirSync(imageDirectoryPath, { recursive: true })
    }
  })
}

const optimizeSaveImage = expressAsyncHandler(async (req, _res, next) => {
  try {
    const files = (req.files ?? []) as Express.Multer.File[]
    createImageDiretory()
    const images = await Promise.all(
      files.map(async file => {
        const randomUUID = crypto.randomUUID()
        const fileExt = path.extname(file.originalname)
        const fileName = `${randomUUID}${fileExt}`
        const uploadDestination = path.join(
          process.cwd(),
          'public',
          'images',
          fileName
        )
        await sharp(file.buffer)
          .resize(500, 500, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .toFormat('jpeg', { quality: 80 })
          .toFile(uploadDestination)
        return fileName
      })
    )
    console.log(images)
    req.body.uploadedImages = images
    next()
  } catch (error) {
    if (error instanceof Error) {
      next(createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, error.message))
      return
    }
    next(
      createHttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Something went wrong')
    )
  }
})

export { optimizeSaveImage }
