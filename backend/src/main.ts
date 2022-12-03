import config from 'config'

import { app } from './app.js'
import { logger } from './utils/logger.js'

const port = config.get<number>('PORT')

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
