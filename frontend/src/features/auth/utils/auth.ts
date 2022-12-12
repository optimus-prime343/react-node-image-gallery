import nookies from 'nookies'

import { axiosClient } from '~utils'

export const autoLogin = (accessToken: string) => {
  axiosClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`
  nookies.set(undefined, 'accessToken', accessToken)
}
export const autoLogout = () => {
  axiosClient.defaults.headers.common.Authorization = ''
  delete axiosClient.defaults.headers.common.Authorization
  nookies.destroy(undefined, 'accessToken')
}
