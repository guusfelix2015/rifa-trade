import { useEffect } from 'react'
import { getAccessToken, setAccessTokenToApiClient } from '@/auth/storage'

export const useInitAuthenticatedUser = () => {
  useEffect(() => {
    const accessToken = getAccessToken()
    if (!accessToken) return
    setAccessTokenToApiClient(accessToken)
  }, [])
}
