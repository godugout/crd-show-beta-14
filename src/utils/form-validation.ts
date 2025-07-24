
import { z } from 'zod';

// Common validation schemas
export const emailSchema = z.string().email('Please enter a valid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const usernameSchema = z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters');

// Card validation schemas
export const cardTitleSchema = z.string().min(1, 'Card title is required').max(100, 'Title must be less than 100 characters');
export const cardDescriptionSchema = z.string().max(500, 'Description must be less than 500 characters').optional();

// Collection validation schemas
export const collectionTitleSchema = z.string().min(1, 'Collection title is required').max(80, 'Title must be less than 80 characters');

// Form validation helpers
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { isValid: false, error: error.errors[0]?.message };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

export const validateForm = <T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>, 
  data: T
): { isValid: boolean; errors: Partial<Record<keyof T, string>> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Partial<Record<keyof T, string>> = {};
      error.errors.forEach((err) => {
        const path = err.path[0] as keyof T;
        if (path) {
          errors[path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: {} };
  }
};
