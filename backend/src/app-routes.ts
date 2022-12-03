import { Router } from 'express'

import { URLS } from './constants/urls.js'
import { authenticated } from './middlewares/authenticated.js'
import { authRouter } from './modules/auth/auth-routes.js'
import { uploadImageRouter } from './modules/upload-image/upload-image-routes.js'

const appRouter = Router()

appRouter.use(URLS.authBaseEndpoint, authRouter)
appRouter.use(URLS.uploadImage, authenticated, uploadImageRouter)

export { appRouter }
