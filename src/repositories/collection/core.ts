
import { supabase } from '@/integrations/supabase/client';

export const calculateOffset = (page = 1, pageSize = 10): number => {
  return (page - 1) * pageSize;
};

export const getCollectionQuery = () => {
  try {
    return supabase.from('collections');
  } catch (error) {
    console.error('Error creating collection query:', error);
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

export const getCollectionItemsQuery = () => {
  try {
    return supabase.from('collection_cards');
  } catch (error) {
    console.error('Error creating collection items query:', error);
    return {
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null })
      })
    } as any;
  }
};
