import { Button, Text } from '@mantine/core'
import { closeModal, openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconLogout } from '@tabler/icons'
import { useQueryClient } from '@tanstack/react-query'

import { QueryKeys } from '~types'

import { useLogout } from '../hooks/use-logout'

const LOGOUT_MODAL_ID = 'logout-modal'
export const LogoutButton = () => {
  const queryClient = useQueryClient()
  const { mutate: logoutMutation, isLoading } = useLogout()

  const handleLogout = () => {
    openConfirmModal({
      modalId: LOGOUT_MODAL_ID,
      title: 'Logout',
      children: <Text>Are you sure you want to logout from your account ?</Text>,
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      confirmProps: { loading: isLoading },
      onConfirm: () => {
        logoutMutation(undefined, {
          onSuccess: async message => {
            await queryClient.invalidateQueries([QueryKeys.USER])
            showNotification({ title: 'Success', message })
            closeModal(LOGOUT_MODAL_ID)
          },
          onError: error => {
            showNotification({
              color: 'red',
              message: error.message,
            })
          },
        })
      },
    })
  }
  return (
    <Button loading={isLoading} leftIcon={<IconLogout />} onClick={handleLogout}>
      Logout
    </Button>
  )
}
