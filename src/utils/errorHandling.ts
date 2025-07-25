/**
 * Centralized error handling utilities for the Cardshow application
 */

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

export class CRDError extends Error {
  public code: string;
  public details?: any;
  public timestamp: number;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'CRDError';
    this.code = code;
    this.details = details;
    this.timestamp = Date.now();
  }
}

export const ErrorCodes = {
  // Authentication errors
  AUTH_REQUIRED: 'AUTH_REQUIRED',
  AUTH_FAILED: 'AUTH_FAILED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Card operations
  CARD_SAVE_FAILED: 'CARD_SAVE_FAILED',
  CARD_LOAD_FAILED: 'CARD_LOAD_FAILED',
  CARD_VALIDATION_FAILED: 'CARD_VALIDATION_FAILED',
  
  // Image processing
  IMAGE_UPLOAD_FAILED: 'IMAGE_UPLOAD_FAILED',
  IMAGE_PROCESSING_FAILED: 'IMAGE_PROCESSING_FAILED',
  
  // Network/Database
  NETWORK_ERROR: 'NETWORK_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  
  // Generic
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

export class ErrorHandler {
  private static instance: ErrorHandler;

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  handleError(error: Error | CRDError | any, context?: string): AppError {
    const appError: AppError = {
      code: error instanceof CRDError ? error.code : ErrorCodes.UNKNOWN_ERROR,
      message: error.message || 'An unexpected error occurred',
      details: error instanceof CRDError ? error.details : error,
      timestamp: Date.now()
    };

    // Log error for development
    if (process.env.NODE_ENV === 'development') {
      console.group(`🚨 Error in ${context || 'Application'}`);
      console.error('Error:', appError);
      console.error('Stack:', error.stack);
      console.groupEnd();
    }

    return appError;
  }

  createError(code: string, message: string, details?: any): CRDError {
    return new CRDError(code, message, details);
  }

  // Specific error creators for common scenarios
  authError(message: string = 'Authentication required'): CRDError {
    return new CRDError(ErrorCodes.AUTH_REQUIRED, message);
  }

  cardError(message: string, details?: any): CRDError {
    return new CRDError(ErrorCodes.CARD_SAVE_FAILED, message, details);
  }

  networkError(message: string = 'Network request failed'): CRDError {
    return new CRDError(ErrorCodes.NETWORK_ERROR, message);
  }

  validationError(message: string, details?: any): CRDError {
    return new CRDError(ErrorCodes.CARD_VALIDATION_FAILED, message, details);
  }
}

export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error handling patterns
export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  context?: string
): Promise<{ data?: T; error?: AppError }> => {
  try {
    const data = await operation();
    return { data };
  } catch (error) {
    return { error: errorHandler.handleError(error, context) };
  }
};

export const safeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    errorHandler.handleError(error, context);
    if (fallback !== undefined) {
      return fallback;
    }
    throw error;
  }
};