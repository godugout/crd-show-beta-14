import { supabase } from '@/integrations/supabase/client';

export const checkIfDatabaseHasCards = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select('id')
      .limit(1);

    if (error) {
      console.error('Error checking database for cards:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Error in checkIfDatabaseHasCards:', error);
    return false;
  }
};

export const seedDatabaseWithSampleCards = async () => {
  // This function would seed the database with sample cards
  // For now, we'll just return a promise that resolves
  return Promise.resolve();
};
