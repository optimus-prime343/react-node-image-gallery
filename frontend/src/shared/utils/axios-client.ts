import axios from 'axios'
import nookies from 'nookies'

const getApiEndpoint = (): string => {
  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT
  if (apiEndpoint === undefined) {
    throw new Error(
      'Please specify NEXT_PUBLIC_API_ENDPOINT in your environment variable'
    )
  }
  return apiEndpoint
}

const axiosClient = axios.create({
  baseURL: getApiEndpoint(),
  withCredentials: true,
})
axiosClient.interceptors.request.use(config => {
  const { accessToken } = nookies.get(undefined, 'accessToken')
  if (accessToken) {
    return {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${accessToken}` },
    }
  }
  return config
})
export { axiosClient }
