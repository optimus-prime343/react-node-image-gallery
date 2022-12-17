import { Button, Container, Divider, Group, Title } from '@mantine/core'
import { IconCirclePlus } from '@tabler/icons'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import Link from 'next/link'

import { fetchUser } from '~features/auth'
import { UploadedImageList, useUploadedImages } from '~features/upload-images'
import { QueryKeys } from '~types'

const HomePage = () => {
  const { data: uploadedImages } = useUploadedImages()

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
      <UploadedImageList uploadedImages={uploadedImages} />
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
