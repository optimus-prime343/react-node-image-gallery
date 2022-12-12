import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

import { QueryKeys } from '~types'

import { autoLogout } from '../utils/auth'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const logout = useCallback(() => {
    autoLogout()
    queryClient.setQueryData([QueryKeys.USER], null)
  }, [queryClient])
  return logout
}
