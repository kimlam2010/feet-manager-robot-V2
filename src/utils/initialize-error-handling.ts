import { setupAxiosErrorHandling, setupGlobalErrorHandling } from './api-error-handler';

export function initializeErrorHandling() {
  // Set up API error handling
  setupAxiosErrorHandling();
  
  // Set up global error handling
  setupGlobalErrorHandling();
  
  console.log('Error handling system initialized');
} 