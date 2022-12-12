import { Center, LoadingOverlay } from '@mantine/core'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import nookies from 'nookies'

import { useLogout } from '~features/auth/hooks/use-logout'

import { fetchUser, LoginForm, useUser } from '../features/auth'
import { QueryKeys } from '../types'

const HomePage = () => {
  const logout = useLogout()
  const { data: user, isFetching } = useUser()

  return (
    <>
      <LoadingOverlay overlayBlur={4} pos='fixed' inset={0} visible={isFetching} />
      <Center mih='100vh'>{user ? <h1>Welcome</h1> : <LoginForm />}</Center>
    </>
  )
}
export const getServerSideProps: GetServerSideProps = async ctx => {
  const queryClient = new QueryClient()
  const { accessToken } = nookies.get(ctx, 'accessToken')
  await queryClient.prefetchQuery([QueryKeys.USER], () => fetchUser(accessToken))
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
export default HomePage
