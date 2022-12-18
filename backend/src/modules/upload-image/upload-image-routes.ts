import { Router } from 'express'

import { optimizeSaveImage } from '../../middlewares/optimize-save-image.js'
import { storeImageMemory } from '../../middlewares/store-image-memory.js'
import { validateResource } from '../../middlewares/validate-resource.js'
import { getUploadedImages, uploadImage } from './upload-image-controller.js'
import {
  uploadedImageSchema,
  uploadImageSchema
} from './upload-image-schema.js'

const uploadImageRouter = Router()

uploadImageRouter.get(
  '/',
  validateResource(uploadedImageSchema),
  getUploadedImages
)
uploadImageRouter.post(
  '/',
  storeImageMemory.array('images'),
  optimizeSaveImage,
  validateResource(uploadImageSchema),
  uploadImage
)

export { uploadImageRouter }
