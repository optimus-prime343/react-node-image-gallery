import { Router } from 'express'

import { URLS } from '../../constants/urls.js'
import { authenticated } from '../../middlewares/authenticated.js'
import { validateResource } from '../../middlewares/validate-resource.js'
import { login, logout, profile, signup } from './auth-controller.js'
import { authSchema } from './auth-schema.js'

const authRouter = Router()

authRouter.post(URLS.login, validateResource(authSchema), login)
authRouter.post(URLS.signup, validateResource(authSchema), signup)
authRouter.get(URLS.profile, authenticated, profile)
authRouter.get(URLS.logout, authenticated, logout)

export { authRouter }
