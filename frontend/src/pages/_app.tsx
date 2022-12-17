import '../styles/globals.css'

import {
  Center,
  LoadingOverlay,
  MantineProvider,
  MantineProviderProps,
} from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from 'next/app'
import { ReactNode, useMemo } from 'react'

import { LoginForm, useUser } from '~features/auth'

export default function App({ Component, pageProps }: AppProps) {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
    []
  )
  const colorScheme = useColorScheme()

  const mantineTheme = useMemo<MantineProviderProps['theme']>(
    () => ({
      colorScheme,
      primaryColor: 'green',
    }),
    [colorScheme]
  )
  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
        <NotificationsProvider position='top-center'>
          <ModalsProvider>
            <AppAuthWrapper>
              <Hydrate state={pageProps.dehydratedState}>
                <Component {...pageProps} />
              </Hydrate>
            </AppAuthWrapper>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
const AppAuthWrapper = ({ children }: { children: ReactNode }) => {
  const { data: user, isFetching: isUserFetching } = useUser()
  return (
    <>
      <LoadingOverlay visible={isUserFetching} pos='fixed' inset={0} />
      {user ? (
        children
      ) : (
        <Center mih='100vh'>{!isUserFetching ? <LoginForm /> : null}</Center>
      )}
    </>
  )
}
