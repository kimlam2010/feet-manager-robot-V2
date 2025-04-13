'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: `${window.location.origin}/auth/login`,
      redirect: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 