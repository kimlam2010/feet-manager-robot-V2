import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public status: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = {
  handle(error: Error | AppError): void {
    if (error instanceof AppError) {
      logger.error(error.message, {
        code: error.code,
        status: error.status,
        details: error.details,
      });
    } else {
      logger.error(error.message, {
        stack: error.stack,
      });
    }
  },

  createError(
    message: string,
    code: string,
    status: number = 500,
    details?: Record<string, unknown>
  ): AppError {
    return new AppError(message, code, status, details);
  },
};

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  ROBOT_ERROR: 'ROBOT_ERROR',
  WORKSET_ERROR: 'WORKSET_ERROR',
};
