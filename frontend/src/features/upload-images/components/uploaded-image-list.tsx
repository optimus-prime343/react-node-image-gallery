import { Grid, SimpleGrid } from '@mantine/core'
import Image from 'next/image'

import { UploadedImage } from '../models/uploaded-image'

export interface UploadedImageListProps {
  uploadedImages: UploadedImage[]
}
export const UploadedImageList = ({ uploadedImages }: UploadedImageListProps) => {
  const renderUploadedImages = () => {
    return uploadedImages.map(uploadedImage => (
      <Grid key={uploadedImage.id}>
        <Image
          style={{ borderRadius: '10px' }}
          width={200}
          height={200}
          src={uploadedImage.url}
          alt={uploadedImage.id}
        />
      </Grid>
    ))
  }
  return <SimpleGrid cols={4}>{renderUploadedImages()}</SimpleGrid>
}
