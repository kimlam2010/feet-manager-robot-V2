import { config } from '@/config';

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(config.auth.tokenKey);
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(config.auth.tokenKey, token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(config.auth.tokenKey);
  }
};

export const isAuthenticated = () => {
  return !!getToken();
}; 