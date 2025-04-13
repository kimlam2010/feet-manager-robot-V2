import axios, { AxiosError } from 'axios';

interface ApiErrorResponse {
  message?: string;
  [key: string]: any;
}

// Custom Error Classes
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

// Core error handling function
export const handleError = (error: Error): void => {
  // Log the error for debugging
  console.error('[Error]', error.message);

  // Here you can add more error handling logic like:
  // - Sending errors to a monitoring service
  // - Showing user-friendly notifications
  // - Logging to analytics
};

// Setup Axios error handling
export const setupAxiosErrorHandling = (): void => {
  axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
      if (!error.response) {
        throw new NetworkError('Network error occurred. Please check your connection.');
      }

      const { status, data } = error.response;
      const message = data?.message || 'An error occurred';

      switch (status) {
        case 401:
          throw new AuthenticationError('Authentication failed. Please log in again.');
        case 400:
          throw new ValidationError(message);
        case 404:
          throw new NotFoundError('Requested resource not found.');
        default:
          throw new Error(message);
      }
    }
  );
};

// Setup global error handling
export const setupGlobalErrorHandling = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    handleError(new Error(event.reason?.message || 'Unhandled rejection'));
  });

  // Handle general JavaScript errors
  window.onerror = (message) => {
    handleError(new Error(message?.toString() || 'Runtime error'));
    return false;
  };
}; 