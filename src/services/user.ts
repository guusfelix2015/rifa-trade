import { api } from '@/config';
import { User } from '@/store';



export const getMe = async () => {
  const response = await api.get<User>('/api/me');
  return response.data;
};

export const updateUser = async ({ id, ...rest }) => {
  const response = await api.put<User>(`/api/users/${id}`, rest);
  return response.data;
};
