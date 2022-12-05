import { z } from 'zod'

const uploadImageSchema = z.object({
  body: z.object({
    uploadedImages: z.array(z.string()).min(1, 'At least one image is required')
  })
})

type UploadImagePayload = z.infer<typeof uploadImageSchema>['body']

export { UploadImagePayload, uploadImageSchema }
