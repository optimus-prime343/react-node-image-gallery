import {
  ActionIcon,
  Container,
  Divider,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  Title,
} from '@mantine/core'
import { closeModal, openConfirmModal } from '@mantine/modals'
import { IconLogout, IconSquarePlus, IconUserCircle } from '@tabler/icons'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import { Fragment } from 'react'

import { PrivateRoute } from '~features/auth'
import { useLogout } from '~features/auth/hooks/use-logout'
import { UploadedImageList, useUploadedImages } from '~features/upload-images'
import { UploadImageListPlaceholder } from '~features/upload-images/components/upload-image-list-placeholder'
import { QueryKeys } from '~types'

const HomePage = () => {
  const queryClient = useQueryClient()
  const {
    ref,
    isImageLastInArray,
    uploadedImagesByDate,
    isLoading: isUploadedImagesLoading,
  } = useUploadedImages<HTMLDivElement>()
  const { mutate: logout, isLoading: isLogoutLoading } = useLogout()

  const formatImageUploadDate = (imageUploadDate: string) => {
    const currentDate = dayjs()
    const dayjsImageUploadDate = dayjs(imageUploadDate)
    if (currentDate.diff(dayjsImageUploadDate, 'day') === 0) return 'Today'
    if (currentDate.diff(dayjsImageUploadDate, 'day') === 1) return 'Yesterday'
    return dayjsImageUploadDate.format('MMMM D, YYYY')
  }
  const handleLogout = () => {
    openConfirmModal({
      modalId: 'confirm-logout-modal',
      title: 'Are you sure you want to logout?',
      children: (
        <Text>
          You will be logged out of your account and will need to login again to
          access your images.
        </Text>
      ),
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      confirmProps: { color: 'red', loading: isLogoutLoading },
      onConfirm: () => {
        logout(undefined, {
          onSuccess: async () => {
            await queryClient.invalidateQueries([QueryKeys.USER])
            closeModal('confirm-logout-modal')
          },
        })
      },
    })
  }
  return (
    <PrivateRoute>
      <LoadingOverlay
        visible={isLogoutLoading}
        pos='fixed'
        inset={0}
        overlayBlur={2}
      />
      <Container my='xl'>
        <Group align='center'>
          <Title order={2} sx={{ flex: 1 }}>
            Your uploaded images
          </Title>
          <Menu position='top-end'>
            <Menu.Target>
              <ActionIcon>
                <IconUserCircle />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                icon={<IconSquarePlus />}
                component={Link}
                href='/upload-images'
              >
                Upload more images
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item color='red' icon={<IconLogout />} onClick={handleLogout}>
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Divider my='lg' />
        {isUploadedImagesLoading ? (
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
    </PrivateRoute>
  )
}
export default HomePage
