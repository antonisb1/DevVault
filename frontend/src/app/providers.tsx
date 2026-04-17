import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, type ReactNode } from 'react';

import { refreshSession } from '../api/client';
import { useAuthStore } from '../stores/auth-store';
import { useTheme } from '../hooks/use-theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AuthBootstrap() {
  const hydrated = useAuthStore((state) => state.hydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!hydrated || accessToken) return;
    refreshSession().catch(() => undefined);
  }, [hydrated, accessToken]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: { colorPrimary: '#4f46e5', borderRadius: 16 },
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <AuthBootstrap />
          {children}
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>
  );
}
