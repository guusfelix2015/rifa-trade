import { type ReactNode, createContext, useContext, useReducer } from 'react'
import { removeAccessToken } from '@/auth'

export interface User {
  id: number
  name: string
  document: null | string
  birthday: null | string
  phone: null | string
  email: string
  email_verified_at: null | string
  photo: null | string
  nickname: string | null
  domain: any
  instagram_url: string | null
  facebook_url: string | null
  tiktok_url: string | null
  youtube_url: string | null
  whatsapp_group_url: string | null
  telegram_group_url: string | null
  created_at: string
  updated_at: string
  deleted_at: any
}

export interface AuthState {
  isAuthenticated: boolean
  user?: User
  dispatch?: React.Dispatch<AuthAction>
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: undefined,
  dispatch: undefined,
}

export const AuthContext = createContext<AuthState>(initialState)

export const useAuth = () => {
  const { isAuthenticated, user, dispatch } = useContext(AuthContext)
  if (!dispatch) throw new Error('useAuth must be used within AuthProvider')
  return { isAuthenticated, user, dispatch }
}

export enum AuthActionType {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SET_USER = 'SET_USER',
}

export interface AuthAction {
  type: AuthActionType
  payload?: User
}

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  if (action.type === AuthActionType.LOGIN) {
    return { ...state, isAuthenticated: true, user: action.payload ?? state.user }
  }
  if (action.type === AuthActionType.SET_USER) {
    return { ...state, user: action.payload }
  }
  if (action.type === AuthActionType.LOGOUT) {
    removeAccessToken()
    return { isAuthenticated: false, user: undefined }
  }
  return state
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  return <AuthContext.Provider value={{ ...state, dispatch }}>{children}</AuthContext.Provider>
}
