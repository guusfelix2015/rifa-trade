import { ACCESS_TOKEN_STORAGE_KEY, api } from '@/config'
import { getNow, parseDate } from '@/utils/date'

export interface AccessTokenContext {
  token: string
}

export const isAuthenticated = () => {
  const accessToken = getAccessToken()
  return !!accessToken
}

export const getAccessToken = (): string | undefined => {
  const credentials = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  if (!credentials) return
  const { token } = JSON.parse(credentials) as AccessTokenContext
  return token
}

export const setAccessToken = (accessToken: string) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken)
}

export const saveAccessToken = (context: AccessTokenContext) => {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, JSON.stringify(context))
}

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export const setAccessTokenToApiClient = (accessToken: string) => {
  api.defaults.headers.common.Authorization = `Bearer ${accessToken}`
}

export const isExpired = (expiresAt: Date): boolean => {
  const now = getNow()
  const expires = parseDate(expiresAt)
  return now.isAfter(expires)
}

