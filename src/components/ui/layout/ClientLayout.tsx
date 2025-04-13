'use client';

import { SessionProvider } from 'next-auth/react';
import { Layout } from './Layout';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <SessionProvider
      session={null}
      basePath="/api/auth"
      refetchInterval={0}
      refetchOnWindowFocus={true}
    >
      <Layout>{children}</Layout>
    </SessionProvider>
  );
} 