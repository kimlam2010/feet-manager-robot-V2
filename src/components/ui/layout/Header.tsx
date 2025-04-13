'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="bg-white border-b">
      <div className="h-16 px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary-600">
          Feet Manager Robot
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm hover:text-primary-600">
            Dashboard
          </Link>
          <Link href="/robots" className="text-sm hover:text-primary-600">
            Robots
          </Link>
          <Link href="/worksets" className="text-sm hover:text-primary-600">
            Worksets
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="text-sm bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
} 