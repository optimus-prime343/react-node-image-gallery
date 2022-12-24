import { Button, Center, Divider, Stack } from '@mantine/core'
import { IconEye } from '@tabler/icons'
import Link from 'next/link'

import { PrivateRoute } from '~features/auth'
import { UploadImages } from '~features/upload-images'

const UploadImagesHomePage = () => {
  return (
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
  )
}
export default UploadImagesHomePage
