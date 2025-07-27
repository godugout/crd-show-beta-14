import { z } from 'zod';

// Enhanced validation schemas
export const cardValidationSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, 'Title contains invalid characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']),
  visibility: z.enum(['public', 'private', 'unlisted']).default('private'),
  tags: z.array(z.string().min(1).max(20)).max(10, 'Maximum 10 tags allowed'),
  image_url: z.string().url('Please provide a valid image URL').optional(),
});

export const userProfileSchema = z.object({
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be less than 20 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
  full_name: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name must be less than 50 characters'),
  bio: z.string()
    .max(200, 'Bio must be less than 200 characters')
    .optional(),
  avatar_url: z.string().url('Please provide a valid avatar URL').optional(),
});

export const marketplaceListingSchema = z.object({
  title: z.string()
    .min(1, 'Listing title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  price: z.number()
    .min(0.01, 'Price must be greater than 0')
    .max(10000, 'Price cannot exceed $10,000'),
  listing_type: z.enum(['fixed_price', 'auction', 'bundle']),
  auction_end_time: z.date().optional(),
  card_id: z.string().uuid('Invalid card ID'),
});

// Enhanced validation functions
export const validateField = <T>(
  schema: z.ZodSchema<T>, 
  value: unknown, 
  fieldName: string
): { isValid: boolean; error?: string; suggestions?: string[] } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => 
        err.path.includes(fieldName) || err.path.length === 0
      );
      
      if (fieldError) {
        return { 
          isValid: false, 
          error: fieldError.message,
          suggestions: getValidationSuggestions(fieldName, value)
        };
      }
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

export const validateForm = <T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>, 
  data: T
): { isValid: boolean; errors: Partial<Record<keyof T, string>>; suggestions: Partial<Record<keyof T, string[]>> } => {
  try {
    schema.parse(data);
    return { isValid: true, errors: {}, suggestions: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Partial<Record<keyof T, string>> = {};
      const suggestions: Partial<Record<keyof T, string[]>> = {};
      
      error.errors.forEach((err) => {
        const path = err.path[0] as keyof T;
        if (path) {
          errors[path] = err.message;
          suggestions[path] = getValidationSuggestions(path as string, data[path]);
        }
      });
      
      return { isValid: false, errors, suggestions };
    }
    return { isValid: false, errors: {}, suggestions: {} };
  }
};

// Smart validation suggestions
const getValidationSuggestions = (fieldName: string, value: unknown): string[] => {
  const suggestions: string[] = [];
  
  switch (fieldName) {
    case 'title':
      if (typeof value === 'string') {
        if (value.length === 0) {
          suggestions.push('Try adding a descriptive title');
        } else if (value.length > 100) {
          suggestions.push('Consider shortening the title');
        }
      }
      break;
      
    case 'username':
      if (typeof value === 'string') {
        if (value.length < 3) {
          suggestions.push('Add more characters to make it unique');
        } else if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
          suggestions.push('Use only letters, numbers, underscores, and hyphens');
        }
      }
      break;
      
    case 'price':
      if (typeof value === 'number') {
        if (value <= 0) {
          suggestions.push('Price must be greater than 0');
        } else if (value > 10000) {
          suggestions.push('Consider a more reasonable price');
        }
      }
      break;
      
    case 'tags':
      if (Array.isArray(value)) {
        if (value.length > 10) {
          suggestions.push('Remove some tags to stay within the limit');
        }
        if (value.some(tag => tag.length > 20)) {
          suggestions.push('Shorten tags to 20 characters or less');
        }
      }
      break;
  }
  
  return suggestions;
};

// Real-time validation hooks
export const useFieldValidation = <T>(
  schema: z.ZodSchema<T>,
  fieldName: keyof T,
  value: unknown
) => {
  const validation = validateField(schema, value, fieldName as string);
  
  return {
    isValid: validation.isValid,
    error: validation.error,
    suggestions: validation.suggestions,
    hasError: !validation.isValid,
  };
};

// Form state management
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Set<keyof T>;
  isSubmitting: boolean;
  isValid: boolean;
  suggestions: Partial<Record<keyof T, string[]>>;
}

export const useFormValidation = <T extends Record<string, unknown>>(
  schema: z.ZodSchema<T>,
  initialValues: T
) => {
  const [state, setState] = React.useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: new Set(),
    isSubmitting: false,
    isValid: false,
    suggestions: {},
  });

  const validateFormData = React.useCallback((data: T) => {
    const validation = validateForm(schema, data);
    setState(prev => ({
      ...prev,
      errors: validation.errors,
      isValid: validation.isValid,
      suggestions: validation.suggestions,
    }));
    return validation.isValid;
  }, [schema]);

  const setFieldValue = React.useCallback((field: keyof T, value: unknown) => {
    setState(prev => {
      const newValues = { ...prev.values, [field]: value };
      const isValid = validateFormData(newValues);
      return {
        ...prev,
        values: newValues,
        isValid,
      };
    });
  }, [validateFormData]);

  const setFieldTouched = React.useCallback((field: keyof T) => {
    setState(prev => ({
      ...prev,
      touched: new Set([...prev.touched, field]),
    }));
  }, []);

  const resetForm = React.useCallback(() => {
    setState({
      values: initialValues,
      errors: {},
      touched: new Set(),
      isSubmitting: false,
      isValid: false,
      suggestions: {},
    });
  }, [initialValues]);

  return {
    ...state,
    setFieldValue,
    setFieldTouched,
    resetForm,
    validateFormData,
  };
}; 