import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { RecoverPage, ResetPasswordPage, SigninPage, SignupPage } from './pages/auth';
import { HomePage } from '@/pages';
import { RequireAuth, RequireNotAuth } from './auth';
import { ProfilePage } from './pages/app/account';
import { CreateCampaignPage } from './pages/app/campaigns';

export const Routes = () => {
  const router = createBrowserRouter([
    {
      path: '/home',
      element: (
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      ),
    },
    {
      path: '/profile',
      element: (
        <RequireAuth>
          <ProfilePage />
        </RequireAuth>
      ),
    },
    {
      path: '/sign-in',
      element: (
        <RequireNotAuth>
          <SigninPage />
        </RequireNotAuth>
      ),
    },
    {
      path: '/reset-password/:token',
      element: (
        <RequireNotAuth>
          <ResetPasswordPage />
        </RequireNotAuth>
      ),
    },
    {
      path: '/sign-up',
      element: (
        <RequireNotAuth>
          <SignupPage />
        </RequireNotAuth>
      ),
    },
    {
      path: '/recover',
      element: (
        <RequireNotAuth>
          <RecoverPage />
        </RequireNotAuth>
      ),
    },
    {
      path: '/create-campaign',
      children: [
        {
          path: '',
          index: true,
          element: (
            <RequireAuth>
              <CreateCampaignPage />
            </RequireAuth>
          ),
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/home" replace />,
    },
  ]);
  return <RouterProvider router={router} />;
};
