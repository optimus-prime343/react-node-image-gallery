import { Center, LoadingOverlay } from '@mantine/core'
import { dehydrate, QueryClient } from '@tanstack/react-query'
import { GetServerSideProps } from 'next'
import nookies from 'nookies'

import { fetchUser, LoginForm, useUser } from '../features/auth'
import { QueryKeys } from '../shared'

const HomePage = () => {
  const { data: user, fetchStatus } = useUser()
  return (
    <>
      <LoadingOverlay
        overlayBlur={2}
        pos='fixed'
        inset={0}
        visible={fetchStatus === 'fetching'}
      />
      <Center mih='100vh'>
        {user !== undefined ? <h1>Welcome</h1> : <LoginForm />}
      </Center>
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
