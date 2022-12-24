import axios from 'axios'

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
export { axiosClient }
