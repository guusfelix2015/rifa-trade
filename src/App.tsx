import { LoadingIndicator, Toaster, TooltipProvider } from '@/components/ui';
import { Routes } from './routes';
import { useAxiosInterceptors } from '@/hooks';
import { ThemeProvider } from '@/components';
import { useEffect, useState } from 'react';
import { AuthActionType, useAuth } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { getMe } from '@/services';
import { isAuthenticated as checkIsAuthenticated } from '@/auth';

export const App = () => {
  useAxiosInterceptors();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isAuthenticated, dispatch } = useAuth();
  const { refetch: fetchUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await getMe().catch((error) => {
        setIsLoaded(true);
        throw error;
      });
      dispatch({ type: AuthActionType.LOGIN, payload: user });
      setIsLoaded(true);
      return user;
    },
    enabled: false,
  });

  useEffect(() => {
    const hasAccessToken = checkIsAuthenticated();
    if (!hasAccessToken) {
      setIsLoaded(true);
      return;
    }
    dispatch({ type: AuthActionType.LOGIN });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUser();
  }, [isAuthenticated]);

  return (
    <ThemeProvider storageKey="pizzashop-theme" defaultTheme="dark">
      <TooltipProvider delayDuration={100} skipDelayDuration={100}>
        {!isLoaded && (
          <div className="flex h-screen w-full items-center justify-center">
            <LoadingIndicator className="h-10 w-10 text-[#3a4655]" />
          </div>
        )}
        <Routes />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
};
