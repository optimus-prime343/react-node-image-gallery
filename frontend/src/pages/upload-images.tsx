import { Button, Center, Divider, Stack } from '@mantine/core'
import { IconEye } from '@tabler/icons'
import Link from 'next/link'

import { Layout } from '~components/layout'
import { PrivateRoute, useUser } from '~features/auth'
import { UploadImages } from '~features/upload-images'

const UploadImagesHomePage = () => {
  const { data: user } = useUser()
  const pageTitle = user ? `Upload Images` : 'Login to upload and share your images'
  return (
    <Layout title={pageTitle}>
      <PrivateRoute>
        <Center mih='100vh'>
          <Stack align='center' spacing='xs'>
            <UploadImages />
            <Divider my='md' w='100%' />
            <Button leftIcon={<IconEye />} component={Link} href='/'>
              View Uploaded Images
            </Button>
          </Stack>
        </Center>
      </PrivateRoute>
    </Layout>
  )
}
export default UploadImagesHomePage
