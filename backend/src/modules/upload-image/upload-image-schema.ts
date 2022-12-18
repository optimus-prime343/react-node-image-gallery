import { z } from 'zod'

const uploadImageSchema = z.object({
  body: z.object({
    uploadedImages: z.array(z.string()).min(1, 'At least one image is required')
  })
})
const uploadedImageSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform(val => (val ? parseInt(val, 10) : undefined)),
    perPage: z
      .string()
      .optional()
      .transform(val => (val ? parseInt(val, 10) : undefined))
  })
})

type UploadImagePayload = z.infer<typeof uploadImageSchema>['body']
type UploadedImageQuery = z.infer<typeof uploadedImageSchema>['query']

export {
  UploadedImageQuery,
  uploadedImageSchema,
  UploadImagePayload,
  uploadImageSchema
}
