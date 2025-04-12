import axios from 'axios';
import { config } from '@/config';

export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common['Authorization'];
};

export const handleApiError = (error: any) => {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
    };
  }
  return {
    status: 500,
    data: { message: 'Internal Server Error' },
  };
}; 