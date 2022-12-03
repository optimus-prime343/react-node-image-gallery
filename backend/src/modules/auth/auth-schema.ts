import { z } from 'zod'

const authSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
})
type AuthPayload = z.infer<typeof authSchema>['body']

export { AuthPayload, authSchema }
