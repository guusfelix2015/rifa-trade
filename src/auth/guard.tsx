import { Navigate } from 'react-router-dom'
import { isAuthenticated } from './storage'

export function RequireAuth({ children }: { children: JSX.Element }) {
  const isUserAuthenticated = isAuthenticated()
  if (!isUserAuthenticated) return <Navigate to="/sign-in" replace />
  return children
}

export function RequireNotAuth({ children }: { children: JSX.Element }) {
  const isUserAuthenticated = isAuthenticated()
  if (isUserAuthenticated) return <Navigate to="/home" replace />
  return children
}
