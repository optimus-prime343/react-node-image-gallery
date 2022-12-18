/* eslint-disable react/display-name */
import { Grid } from '@mantine/core'
import Image from 'next/image'
import { forwardRef } from 'react'

import { UploadedImage } from '../models/uploaded-image'

export interface UploadedImageListProps {
  uploadedImages: UploadedImage[]
  isImageLastInArray: (imageId: string) => boolean
}
export const UploadedImageList = forwardRef<HTMLDivElement, UploadedImageListProps>(
  (props, ref) => {
    const { uploadedImages, isImageLastInArray } = props
    const renderUploadedImages = () => {
      return uploadedImages.map(uploadedImage => (
        <Grid.Col
          ref={isImageLastInArray(uploadedImage.id) ? ref : undefined}
          lg={3}
          md={2}
          sm={1}
          key={uploadedImage.id}
        >
          <Image
            style={{ borderRadius: '6px', objectFit: 'cover' }}
            width={200}
            height={200}
            src={uploadedImage.url}
            alt={uploadedImage.id}
          />
        </Grid.Col>
      ))
    }
    return <Grid>{renderUploadedImages()}</Grid>
  }
)
