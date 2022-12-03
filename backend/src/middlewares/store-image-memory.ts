import multer from 'multer'

const storage = multer.memoryStorage()

const storeImageMemory = multer({
  storage
})
export { storeImageMemory }
