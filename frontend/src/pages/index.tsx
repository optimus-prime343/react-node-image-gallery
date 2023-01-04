import {
  ActionIcon,
  Box,
  Container,
  createStyles,
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
  const { classes } = useStyles()

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
                <Box className={classes.titleContainer} my='xl'>
                  <Text className={classes.title}>
                    {formatImageUploadDate(imageUploadDate)}
                  </Text>
                </Box>
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
const useStyles = createStyles(theme => ({
  titleContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '&::before': {
      position: 'absolute',
      content: "''",
      left: 0,
      top: '60%',
      transform: 'translateY(-60%)',
      width: '100%',
      height: 1,
      backgroundColor: theme.colors.gray[9],
      zIndex: -1,
    },
  },
  title: {
    textAlign: 'center',
    display: 'inline-flex',
    backgroundColor: theme.colors.dark[7],
    padding: '0 15px',
  },
}))
export default HomePage
