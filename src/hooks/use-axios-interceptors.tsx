import { getAccessToken } from '@/auth';
import { api } from '@/config';

export const useAxiosInterceptors = () => {
  api.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const code = error?.response?.data?.message;
      const allowlist = ['INVALID_CREDENTIALS'];
      if (error.response?.status === 401 && !allowlist.includes(code)) {
        // logout()
      }
      return await Promise.reject(error);
    },
  );
};
