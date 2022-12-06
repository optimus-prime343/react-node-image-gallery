import '../styles/globals.css'

import { MantineProvider, MantineProviderProps } from '@mantine/core'
import { useColorScheme } from '@mantine/hooks'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import type { AppProps } from 'next/app'
import { useMemo } from 'react'

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
      primaryColor: 'violet',
    }),
    [colorScheme]
  )
  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools />
      <MantineProvider withGlobalStyles withNormalizeCSS theme={mantineTheme}>
        <NotificationsProvider>
          <ModalsProvider>
            <Hydrate state={pageProps.dehydratedState}>
              <Component {...pageProps} />
            </Hydrate>
          </ModalsProvider>
        </NotificationsProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}
