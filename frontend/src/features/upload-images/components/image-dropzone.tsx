import { Group, Stack, Text, Title, useMantineTheme } from '@mantine/core'
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { IconPhotoPlus } from '@tabler/icons'
import { nanoid } from 'nanoid'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { UploadedImageFilesPreview } from '../components/uploaded-image-files-preview'
import { UploadImageFile } from '../models/upload-image-file'

export interface CustomDropzoneProps
  extends Omit<DropzoneProps, 'children' | 'onDrop'> {
  uploadImageFiles: UploadImageFile[]
  setUploadImageFiles: Dispatch<SetStateAction<UploadImageFile[]>>
}
export const ImageDropzone = ({
  uploadImageFiles,
  setUploadImageFiles,
}: CustomDropzoneProps) => {
  const theme = useMantineTheme()

  const removeAlreadyUploadedFiles = (uploadedFiles: File[]) => {
    return uploadedFiles.filter(
      uploadedFile =>
        !uploadImageFiles.find(
          imageFile => imageFile.file.name === uploadedFile.name
        )
    )
  }

  const handleImagesDrop = (files: File[]) => {
    setUploadImageFiles(prevImageFiles => [
      ...prevImageFiles,
      ...removeAlreadyUploadedFiles(files).map(file => ({
        id: nanoid(),
        file,
      })),
    ])
  }
  const handleDeleteImageFile = (imageFileId: string) => {
    setUploadImageFiles(prevImageFiles =>
      prevImageFiles.filter(imageFile => imageFile.id !== imageFileId)
    )
  }

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
      {uploadImageFiles.length > 0 ? (
        <UploadedImageFilesPreview
          imageFiles={uploadImageFiles}
          onDeleteImageFile={handleDeleteImageFile}
        />
      ) : null}
    </Stack>
  )
}
