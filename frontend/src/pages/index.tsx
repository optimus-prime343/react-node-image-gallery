import { Center, LoadingOverlay } from '@mantine/core'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'

import { fetchUser, LoginForm, LogoutButton, useUser } from '../features/auth'
import { QueryKeys } from '../types'

const HomePage = () => {
  const { data: user, isFetching } = useUser()

  return (
    <>
      <LoadingOverlay overlayBlur={4} pos='fixed' inset={0} visible={isFetching} />
      <LogoutButton />
      <Center mih='100vh'>{user ? <h1>Welcome</h1> : <LoginForm />}</Center>
    </>
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
