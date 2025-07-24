
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ColorTheme {
  id: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  text_color: string;
  primary_example_team: string;
  teams?: Team[];
}

export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  league: string;
  sport: string;
}

export const useColorThemes = () => {
  const [colorThemes, setColorThemes] = useState<ColorTheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchColorThemes = async () => {
      try {
        setLoading(true);
        
        // Fetch color themes with their associated teams
        const { data: themes, error: themesError } = await supabase
          .from('color_themes')
          .select(`
            *,
            teams (*)
          `)
          .order('name');

        if (themesError) {
          throw themesError;
        }

        setColorThemes(themes || []);
      } catch (err) {
        console.error('Error fetching color themes:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch color themes');
      } finally {
        setLoading(false);
      }
    };

    fetchColorThemes();
  }, []);

  return { colorThemes, loading, error };
};
