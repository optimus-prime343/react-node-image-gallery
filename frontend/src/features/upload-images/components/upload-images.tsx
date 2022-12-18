import { Button, LoadingOverlay } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons'
import { useState } from 'react'

import { useUploadImageFiles } from '../hooks/use-upload-image-files'
import { UploadImageFile } from '../models/upload-image-file'
import { ImageDropzone } from './image-dropzone'

export const UploadImages = () => {
  const { mutate: uploadImageFilesMutation, isLoading: isUploadImageFilesLoading } =
    useUploadImageFiles()
  const [uploadImageFiles, setUploadImageFiles] = useState<UploadImageFile[]>([])

  const handleConfirmUploadImages = () => {
    const imageFiles = uploadImageFiles.map(uploadImageFile => uploadImageFile.file)
    uploadImageFilesMutation(imageFiles, {
      onSuccess: message => {
        showNotification({ message, title: 'Success' })
        setUploadImageFiles([])
      },
      onError: error => {
        showNotification({ message: error.message, title: 'Error' })
      },
    })
  }

  return (
    <>
      <LoadingOverlay
        visible={isUploadImageFilesLoading}
        pos='fixed'
        inset={0}
        overlayBlur={2}
      />
      <div>
        <ImageDropzone
          uploadImageFiles={uploadImageFiles}
          setUploadImageFiles={setUploadImageFiles}
        />
        {uploadImageFiles.length > 0 ? (
          <Button
            mt='lg'
            leftIcon={<IconUpload />}
            onClick={handleConfirmUploadImages}
          >
            Upload Images
          </Button>
        ) : null}
      </div>
    </>
  )
}
