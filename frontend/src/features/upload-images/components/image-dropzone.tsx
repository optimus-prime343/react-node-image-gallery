import { Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconPhotoPlus } from '@tabler/icons'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'

import { UploadedImageFilesPreview } from '../components/uploaded-image-files-preview'
import { UploadImageFile } from '../models/upload-image-file'

export interface CustomDropzoneProps
  extends Omit<DropzoneProps, 'children' | 'onDrop'> {
  onImageFilesDrop: (files: File[]) => void
}
export const ImageDropzone = ({ onImageFilesDrop }: CustomDropzoneProps) => {
  const theme = useMantineTheme()
  const [imageFiles, setImageFiles] = useState<UploadImageFile[]>([])

  const removeAlreadyUploadedFiles = (uploadedFiles: File[]) => {
    return uploadedFiles.filter(
      uploadedFile =>
        !imageFiles.find(imageFile => imageFile.file.name === uploadedFile.name)
    )
  }

  const handleImagesDrop = (files: File[]) => {
    setImageFiles(prevImageFiles => [
      ...prevImageFiles,
      ...removeAlreadyUploadedFiles(files).map(file => ({
        id: nanoid(),
        file,
      })),
    ])
  }
  const handleDeleteImageFile = (imageFileId: string) => {
    setImageFiles(prevImageFiles =>
      prevImageFiles.filter(imageFile => imageFile.id !== imageFileId)
    )
  }
  useEffect(() => {
    onImageFilesDrop(imageFiles.map(imageFile => imageFile.file))
  }, [imageFiles, onImageFilesDrop])

  return (
    <Stack>
      <Dropzone accept={IMAGE_MIME_TYPE} onDrop={handleImagesDrop}>
        <Group align='center' spacing='xl'>
          <IconPhotoPlus color={theme.primaryColor} size={40} />
          <Stack spacing='xs'>
            <Title order={4}>Drage images here or click to select files</Title>
            <Text size='sm' color='dimmed'>
              Attach as many files as you like, each file should not exceed 5mb.
            </Text>
          </Stack>
        </Group>
      </Dropzone>
      {imageFiles.length > 0 ? (
        <UploadedImageFilesPreview
          imageFiles={imageFiles}
          onDeleteImageFile={handleDeleteImageFile}
        />
      ) : null}
    </Stack>
  )
}
