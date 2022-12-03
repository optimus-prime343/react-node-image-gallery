import config from 'config'
import cors from 'cors'
import Express from 'express'
import morgan from 'morgan'
import path from 'path'

import { appRouter } from './app-routes.js'
import { URLS } from './constants/urls.js'
import { globalErrorHandler } from './global-error-handler.js'

const app = Express()

app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: config.get<string>('FRONTEND_URL')
  })
)
app.use(morgan('dev'))
app.use(Express.static(path.join(process.cwd(), 'public')))

app.use(URLS.baseApiEndpoint, appRouter)

app.use(globalErrorHandler)

export { app }
