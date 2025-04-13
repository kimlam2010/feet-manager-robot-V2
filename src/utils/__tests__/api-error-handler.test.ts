import axios from 'axios';
import { setupAxiosErrorHandling, setupGlobalErrorHandling, NetworkError, AuthenticationError, ValidationError, NotFoundError } from '../api-error-handler';

// Mock console.error to prevent test output noise
console.error = jest.fn();

describe('API Error Handler', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    setupAxiosErrorHandling();
    setupGlobalErrorHandling();
  });

  describe('Axios Error Handling', () => {
    it('should handle network errors', async () => {
      const mockError = new Error('Network Error');
      mockError.name = 'Error';
      axios.get = jest.fn().mockRejectedValue(mockError);

      try {
        await axios.get('/test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error as Error).toBeInstanceOf(NetworkError);
        expect((error as Error).message).toBe('Network error occurred. Please check your connection.');
      }
    });

    it('should handle 401 authentication errors', async () => {
      const mockError = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      };
      axios.get = jest.fn().mockRejectedValue(mockError);

      try {
        await axios.get('/test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error as Error).toBeInstanceOf(AuthenticationError);
        expect((error as Error).message).toBe('Authentication failed. Please log in again.');
      }
    });

    it('should handle 400 validation errors', async () => {
      const mockError = {
        response: {
          status: 400,
          data: { message: 'Invalid input' }
        }
      };
      axios.get = jest.fn().mockRejectedValue(mockError);

      try {
        await axios.get('/test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error as Error).toBeInstanceOf(ValidationError);
        expect((error as Error).message).toBe('Invalid input');
      }
    });

    it('should handle 404 not found errors', async () => {
      const mockError = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        }
      };
      axios.get = jest.fn().mockRejectedValue(mockError);

      try {
        await axios.get('/test');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error as Error).toBeInstanceOf(NotFoundError);
        expect((error as Error).message).toBe('Requested resource not found.');
      }
    });
  });

  describe('Global Error Handling', () => {
    it('should handle unhandled promise rejections', () => {
      const error = new Error('Unhandled rejection');
      // Create a mock event since PromiseRejectionEvent might not be available in the test environment
      const event = new Event('unhandledrejection') as any;
      event.reason = error;
      event.promise = Promise.reject(error);
      window.dispatchEvent(event);

      expect(console.error).toHaveBeenCalledWith('[Error]', 'Unhandled rejection');
    });

    it('should handle window errors', () => {
      const error = new Error('Runtime error');
      const mockWindow = window as Window;
      if (mockWindow.onerror) {
        mockWindow.onerror('Runtime error', 'test.js', 1, 1, error);
      }

      expect(console.error).toHaveBeenCalledWith('[Error]', 'Runtime error');
    });
  });
}); 