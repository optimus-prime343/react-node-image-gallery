import {
  Button,
  Card,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm, zodResolver } from '@mantine/form'
import { closeModal, openConfirmModal } from '@mantine/modals'
import { showNotification } from '@mantine/notifications'
import { IconMail, IconPassword } from '@tabler/icons'
import { useQueryClient } from '@tanstack/react-query'

import { QueryKeys } from '~types'

import { useLogin } from '../hooks/use-login'
import { useSignup } from '../hooks/use-signup'
import { AuthPayload, authSchema } from '../schemas/auth-schema'

const confirmSignupModalId = 'confirm-signup-modal'

export const LoginForm = () => {
  const queryClient = useQueryClient()
  const { mutate: loginMutation, isLoading: isLoginLoading } = useLogin()
  const { mutate: signupMutation, isLoading: isSignupLoading } = useSignup()

  const form = useForm<AuthPayload>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: zodResolver(authSchema),
    validateInputOnChange: true,
  })

  const handleCreateAccount = (signupPayload: AuthPayload) => {
    signupMutation(signupPayload, {
      onSuccess: async message => {
        await queryClient.invalidateQueries([QueryKeys.USER])
        showNotification({
          title: 'Account created',
          message,
        })
        closeModal(confirmSignupModalId)
      },
      onError: error => {
        showNotification({
          title: 'Error',
          message: error.message,
          color: 'red',
        })
      },
    })
  }

  // A modal asking user whether they want to create a new account with the same login credentials if no account exist
  const openConfirmSignupModal = (payload: AuthPayload) => {
    openConfirmModal({
      modalId: confirmSignupModalId,
      title: "Account doesn't exist",
      children: (
        <Text color='dimmed'>
          <Text>
            Do you want to create a new account with the given credentials?
          </Text>
        </Text>
      ),
      labels: { confirm: 'Create account', cancel: 'Cancel' },
      confirmProps: { loading: isSignupLoading },
      closeOnConfirm: false, //close modal only after signup is complete
      onConfirm: () => handleCreateAccount(payload),
      onCancel: form.reset,
    })
  }

  const handleSubmit = (values: AuthPayload) => {
    loginMutation(values, {
      onSuccess: async message => {
        await queryClient.invalidateQueries([QueryKeys.USER])
        showNotification({
          title: 'Login successful',
          message,
        })
      },
      onError: error => {
        if (error.message === 'No user found') {
          openConfirmSignupModal(values)
          return
        }
        showNotification({
          title: 'Error',
          message: error.message,
        })
      },
    })
  }

  return (
    <Card miw='25vw' maw='25vw'>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <Title order={4}>Login to your account</Title>
          <Text>
            Login to your existing account or simply create a new one with the same
            credentials.
          </Text>
          <Divider />
          <TextInput
            withAsterisk
            type='email'
            icon={<IconMail />}
            label='Email address'
            {...form.getInputProps('email')}
          />
          <PasswordInput
            withAsterisk
            icon={<IconPassword />}
            label='Password'
            {...form.getInputProps('password')}
          />
          <Button type='submit' loading={isLoginLoading}>
            Login
          </Button>
        </Stack>
      </form>
    </Card>
  )
}
