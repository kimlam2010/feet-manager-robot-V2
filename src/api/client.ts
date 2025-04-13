import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '../config/env';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

export class ApiClient {
  private static instance: ApiClient;
  private axiosInstance: AxiosInstance;
  private retryCount: number = 0;
  private readonly maxRetries: number = 3;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: env.API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = store.getState().auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            originalRequest._retry = true;

            try {
              // Attempt to refresh token
              const response = await this.refreshToken();
              const newToken = response.data.token;
              store.dispatch({ type: 'auth/updateToken', payload: newToken });
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.axiosInstance(originalRequest);
            } catch (refreshError) {
              // If refresh fails, logout user
              store.dispatch(logout());
              return Promise.reject(refreshError);
            }
          }
        }

        // Handle offline mode
        if (!navigator.onLine) {
          // Queue request for later
          this.queueRequest(originalRequest);
          throw new Error('No internet connection');
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken(): Promise<AxiosResponse> {
    return this.axiosInstance.post('/auth/refresh-token');
  }

  private queueRequest(request: AxiosRequestConfig): void {
    // Implement request queueing for offline support
    // This could be stored in IndexedDB or localStorage
    const queue = JSON.parse(localStorage.getItem('requestQueue') || '[]');
    queue.push(request);
    localStorage.setItem('requestQueue', JSON.stringify(queue));
  }

  public async processQueue(): Promise<void> {
    if (navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem('requestQueue') || '[]');
      localStorage.setItem('requestQueue', '[]');

      for (const request of queue) {
        try {
          await this.axiosInstance(request);
        } catch (error) {
          console.error('Failed to process queued request:', error);
        }
      }
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  public async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }
}

export const apiClient = ApiClient.getInstance(); 