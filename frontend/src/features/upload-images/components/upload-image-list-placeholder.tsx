import { Box, Grid, Skeleton } from '@mantine/core'

export const UploadImageListPlaceholder = () => {
  return (
    <Box>
      <UploadedImageSkeletonItem skeletonImagecount={2} />
      <UploadedImageSkeletonItem skeletonImagecount={4} />
      <UploadedImageSkeletonItem skeletonImagecount={3} />
    </Box>
  )
}
const UploadedImageSkeletonItem = ({
  skeletonImagecount,
}: {
  skeletonImagecount: number
}) => {
  return (
    <Box>
      <Skeleton height={16} width={150} mb='md' mt='xl' />
      <Grid>
        {Array.from({ length: skeletonImagecount }).map((_, index) => (
          <Grid.Col lg={4} md={3} sm={1} key={index}>
            <Skeleton width={300} height={200} />
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  )
}
