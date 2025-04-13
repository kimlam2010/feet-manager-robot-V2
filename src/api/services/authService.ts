import { apiClient } from '../client';

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  token: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/auth/register', data);
  },

  async logout(): Promise<void> {
    return apiClient.post('/auth/logout');
  },

  async refreshToken(): Promise<{ token: string }> {
    return apiClient.post('/auth/refresh-token');
  },

  async forgotPassword(email: string): Promise<void> {
    return apiClient.post('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    return apiClient.post('/auth/reset-password', { token, newPassword });
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    return apiClient.post('/auth/change-password', { oldPassword, newPassword });
  },

  async verifyEmail(token: string): Promise<void> {
    return apiClient.post('/auth/verify-email', { token });
  },
}; 