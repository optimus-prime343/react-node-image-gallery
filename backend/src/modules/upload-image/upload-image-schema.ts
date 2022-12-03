import { z } from 'zod'

const uploadImageSchema = z.object({
  body: z.object({
    uploadedImages: z.array(z.string())
  })
})

type UploadImagePayload = z.infer<typeof uploadImageSchema>['body']

export { UploadImagePayload, uploadImageSchema }
