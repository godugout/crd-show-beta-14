
import { supabase } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getMemoryQuery = () => {
  try {
    return supabase.from('memories');
  } catch (error) {
    console.error('Error creating memory query:', error);
    // Return a minimal mock that won't cause TypeScript errors
    return {
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null })
      }),
      order: () => ({
        range: () => Promise.resolve({ data: [], error: null, count: 0 })
      })
    } as any;
  }
};
