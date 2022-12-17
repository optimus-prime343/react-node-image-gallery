import { Button, LoadingOverlay } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons'
import { useState } from 'react'

import { useUploadImageFiles } from '../hooks/use-upload-image-files'
import { ImageDropzone } from './image-dropzone'

export const UploadImages = () => {
  const { mutate: uploadImageFilesMutation, isLoading: isUploadImageFilesLoading } =
    useUploadImageFiles()
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const handleConfirmUploadImages = () => {
    uploadImageFilesMutation(imageFiles, {
      onSuccess: message => {
        showNotification({ message, title: 'Success' })
        setImageFiles([])
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
        <ImageDropzone onImageFilesDrop={setImageFiles} />
        {imageFiles.length > 0 ? (
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
