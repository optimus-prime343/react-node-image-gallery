import { Button, Container, Divider, Group, Title } from '@mantine/core'
import { IconCirclePlus } from '@tabler/icons'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import relativeTime from 'dayjs/plugin/relativeTime'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import { fetchUser } from '~features/auth'
import { UploadedImageList, useUploadedImages } from '~features/upload-images'
import { UploadImageListPlaceholder } from '~features/upload-images/components/upload-image-list-placeholder'
import { QueryKeys } from '~types'

dayjs.extend(calendar)
dayjs.extend(relativeTime)

const HomePage = () => {
  const { ref, isImageLastInArray, uploadedImagesByDate, isFetching } =
    useUploadedImages<HTMLDivElement>()

  const formatImageUploadDate = (imageUploadDate: string) => {
    const currentDate = dayjs()
    const dayjsImageUploadDate = dayjs(imageUploadDate)
    if (currentDate.diff(dayjsImageUploadDate, 'day') === 0) return 'Today'
    if (currentDate.diff(dayjsImageUploadDate, 'day') === 1) return 'Yesterday'
    return dayjsImageUploadDate.format('MMMM D, YYYY')
  }
  return (
    <Container my='xl'>
      <Group align='center'>
        <Title order={2} sx={{ flex: 1 }}>
          Your uploaded images
        </Title>
        <Button component={Link} href='/upload-images' leftIcon={<IconCirclePlus />}>
          Upload More
        </Button>
      </Group>
      <Divider my='lg' />
      {isFetching ? (
        <UploadImageListPlaceholder />
      ) : (
        Object.entries(uploadedImagesByDate ?? {}).map(
          ([imageUploadDate, uploadedImages]) => (
            <Fragment key={imageUploadDate}>
              <Title order={6} mt='xl' mb='md'>
                {formatImageUploadDate(imageUploadDate)}
              </Title>
              <UploadedImageList
                ref={ref}
                isImageLastInArray={isImageLastInArray}
                uploadedImages={uploadedImages}
              />
            </Fragment>
          )
        )
      )}
    </Container>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery([QueryKeys.USER], () => fetchUser())
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
export default HomePage
