'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert } from '@/components/ui/feedback/Alert';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error === 'SessionRequired') {
      // Redirect to login page if session is required
      window.location.href = '/auth/login';
    }
  }, [error]);

  if (error === 'SessionRequired') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
        </div>
        <div className="mt-8">
          <Alert variant="error" title="Error">
            {error === 'CredentialsSignin'
              ? 'Invalid email or password'
              : 'An error occurred during authentication'}
          </Alert>
        </div>
      </div>
    </div>
  );
} 