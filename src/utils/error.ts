import { ERROR_CODES } from '@/constants';

export class AppError extends Error {
  code: number;
  data?: any;

  constructor(message: string, code: number = 500, data?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.data = data;
  }
}

export const handleError = (error: any) => {
  if (error instanceof AppError) {
    return error;
  }

  if (error.response) {
    return new AppError(
      error.response.data.message || 'Server Error',
      error.response.status,
      error.response.data
    );
  }

  return new AppError('Internal Server Error', ERROR_CODES.INTERNAL_SERVER_ERROR);
}; 