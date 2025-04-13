import { logger } from './logger';

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string, details?: any) {
    super('NETWORK_ERROR', message, details);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string, details?: any) {
    super('AUTH_ERROR', message, details);
    this.name = 'AuthenticationError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super('VALIDATION_ERROR', message, details);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super('DB_ERROR', message, details);
    this.name = 'DatabaseError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string, details?: any) {
    super('NOT_FOUND', message, details);
    this.name = 'NotFoundError';
  }
}

export function handleError(error: Error | AppError | any): void {
  if (error instanceof AppError) {
    logger.error(`[${error.code}] ${error.message}`, {
      details: error.details,
      stack: error.stack,
    });
  } else if (error instanceof Error) {
    logger.error(error.message, {
      stack: error.stack,
    });
  } else {
    logger.error('An unknown error occurred', error);
  }
}

export function isAppError(error: any): error is AppError {
  return error instanceof AppError;
}

export function createError(code: string, message: string, details?: any): AppError {
  return new AppError(code, message, details);
}

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
