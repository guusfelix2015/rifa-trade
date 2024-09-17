import { api } from "@/config"

export interface SignupData {
  email: string
  password: string
  name: string
}

export interface SigninResponse {
  token: string
}

export interface SigninData {
  email: string
  password: string
}

export interface ResetPasswordData {
  password: string
  confirm_password: string
}

export const signup = async (data: SignupData) => {
  const response = await api.post<SignupData>('/api/users', data)
  return response.data
}

export const signin = async (data: SigninData) => {
  const response = await api.post<SigninResponse>('/api/auth/login', data)
  return response.data
}

export const logout = async () => {
  const response = await api.get('/api/auth/logout')
  return response.data
}

export const forgetPassword = async (email: string) => {
  const response = await api.post('/api/auth/forget-password', { email })
  return response.data
}

export const resetPassword = async (token: string, data: ResetPasswordData) => {
  const response = await api.put(`/api/auth/confirm-remember/${token}`, data)
  return response.data
}


