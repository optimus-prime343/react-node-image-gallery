import { Router } from 'express'

import { URLS } from '../../constants/urls.js'
import { validateResource } from '../../middlewares/validate-resource.js'
import { login, signup } from './auth-controller.js'
import { authSchema } from './auth-schema.js'

const authRouter = Router()

authRouter.get(URLS.login, validateResource(authSchema), login)
authRouter.get(URLS.signup, validateResource(authSchema), signup)

export { authRouter }
