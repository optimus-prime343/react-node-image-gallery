import { Center, LoadingOverlay } from '@mantine/core'
import { ReactNode } from 'react'

import { LoginForm } from '../components/login-form'
import { useUser } from '../hooks/use-user'

export interface PrivateRouteProps {
  children: ReactNode
}
export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { data: user, isLoading: isUserLoading } = useUser()
  return (
    <>
      <LoadingOverlay
        visible={isUserLoading}
        pos='fixed'
        inset={0}
        overlayBlur={2}
      />
      {user ? (
        <>{children}</>
      ) : (
        <Center mih='100vh'>{!isUserLoading ? <LoginForm /> : null}</Center>
      )}
    </>
  )
}
