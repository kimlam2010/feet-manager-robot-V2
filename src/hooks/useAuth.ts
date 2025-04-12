import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { setToken, removeToken } from '@/utils/auth';
import { api } from '@/utils/api';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(() => {
    removeToken();
    router.push('/login');
  }, [router]);

  return { login, logout, loading, error };
}; 