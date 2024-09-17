import ReactDOM from 'react-dom/client';
import './styles/global.css';
import { LoadingIndicator } from '@/components/ui';
import { Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/config';
import { App } from './App';
import { AuthProvider } from '@/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </>,
);
