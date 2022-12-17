import { ActionIcon, BackgroundImage, Center, Grid, Group } from '@mantine/core'
import { IconEye, IconTrash } from '@tabler/icons'

import { UploadImageFile } from '../models/upload-image-file'

const PREVIEW_IMAGE_SIZE = 120

export interface UploadedImageFilesPreviewProps {
  imageFiles: UploadImageFile[]
  onDeleteImageFile: (imageFileId: string) => void
}
export const UploadedImageFilesPreview = ({
  onDeleteImageFile,
  imageFiles,
}: UploadedImageFilesPreviewProps) => {
  const handleViewImage = (imageFile: File) => {
    const imageUrl = URL.createObjectURL(imageFile)
    window.open(imageUrl, '_blank', 'noopener,noreferrer')
  }

  const renderImagePreviews = () => {
    return imageFiles.map((imageFile, index) => (
      <Grid.Col span={3} key={imageFile.id}>
        <BackgroundImage
          pos='relative'
          mih={PREVIEW_IMAGE_SIZE}
          miw={PREVIEW_IMAGE_SIZE}
          src={URL.createObjectURL(imageFile.file)}
          radius='md'
        >
          <Center pos='absolute' inset={0}>
            <Group>
              <ActionIcon
                variant='filled'
                color='green'
                onClick={() => handleViewImage(imageFile.file)}
              >
                <IconEye />
              </ActionIcon>
              <ActionIcon
                variant='filled'
                color='red'
                onClick={() => onDeleteImageFile(imageFile.id)}
              >
                <IconTrash />
              </ActionIcon>
            </Group>
          </Center>
        </BackgroundImage>
      </Grid.Col>
    ))
  }
  return <Grid>{renderImagePreviews()}</Grid>
}
