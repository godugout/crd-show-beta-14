import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { CRDFrame, CRDElement, CRDVisualStyle } from '@/types/crd-frame';
import type { Database } from '@/integrations/supabase/types';

export const useCRDFrame = () => {
  const [frames, setFrames] = useState<CRDFrame[]>([]);
  const [elements, setElements] = useState<CRDElement[]>([]);
  const [visualStyles, setVisualStyles] = useState<CRDVisualStyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load CRD Frames
  const loadFrames = useCallback(async (category?: string) => {
    try {
      setLoading(true);
      let query = supabase
        .from('crd_frames')
        .select('*')
        .eq('is_public', true)
        .order('rating_average', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Map database rows to CRDFrame type with proper bounds transformation
      const mappedFrames: CRDFrame[] = (data || []).map(row => {
        // Transform the frame_config to match the expected structure
        const frameConfig = row.frame_config as any;
        
        // Transform regions to have bounds object
        if (frameConfig?.regions) {
          frameConfig.regions = frameConfig.regions.map((region: any) => {
            // If region has x, y, width, height directly, move them to bounds
            if (region.x !== undefined || region.y !== undefined) {
              const { x = 0, y = 0, width = 100, height = 100, ...otherProps } = region;
              return {
                ...otherProps,
                bounds: { x, y, width, height }
              };
            }
            // If bounds already exists, keep as is
            return region;
          });
        }
        
        return {
          ...row,
          version: (row as any).version || '1.0.0',
          frame_config: frameConfig,
          category: row.category || '',
          name: row.name || '',
          is_public: row.is_public || false,
          price_cents: row.price_cents || 0,
          rating_average: row.rating_average || 0,
          rating_count: row.rating_count || 0,
          download_count: row.download_count || 0,
          tags: row.tags || [],
          included_elements: row.included_elements || []
        };
      });

      setFrames(mappedFrames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load frames');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load CRD Elements
  const loadElements = useCallback(async (type?: string) => {
    try {
      let query = supabase
        .from('crd_elements')
        .select('*')
        .eq('is_public', true)
        .order('rating_average', { ascending: false });

      if (type) {
        query = query.eq('element_type', type);
      }

      const { data, error } = await query;
      if (error) throw error;

      setElements(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load elements');
    }
  }, []);

  // Load Visual Styles
  const loadVisualStyles = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('crd_visual_styles')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;

      // Map database rows to CRDVisualStyle type
      const mappedStyles: CRDVisualStyle[] = (data || []).map(row => ({
        ...row,
        category: row.category as 'base' | 'finish' | 'effect' | 'animation',
        unlock_method: (row.unlock_method === 'marketplace' ? 'purchase' : 
          row.unlock_method === 'premium_template' ? 'premium' :
          row.unlock_method === 'achievement' ? 'achievement' : 'free') as 'free' | 'purchase' | 'achievement' | 'premium'
      }));

      setVisualStyles(mappedStyles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load visual styles');
    }
  }, []);

  // Create a new frame
  const createFrame = useCallback(async (frameData: Omit<CRDFrame, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const dbFrameData = {
        ...frameData,
        frame_config: frameData.frame_config as any
      };

      const { data, error } = await supabase
        .from('crd_frames')
        .insert([dbFrameData])
        .select()
        .single();

      if (error) throw error;

      // Transform frame_config for consistency
      const frameConfig = data.frame_config as any;
      if (frameConfig?.regions) {
        frameConfig.regions = frameConfig.regions.map((region: any) => {
          if (region.x !== undefined || region.y !== undefined) {
            const { x = 0, y = 0, width = 100, height = 100, ...otherProps } = region;
            return {
              ...otherProps,
              bounds: { x, y, width, height }
            };
          }
          return region;
        });
      }

      const mappedFrame: CRDFrame = {
        ...data,
        version: (data as any).version || '1.0.0',
        frame_config: frameConfig,
        category: data.category || '',
        name: data.name || '',
        is_public: data.is_public || false,
        price_cents: data.price_cents || 0,
        rating_average: data.rating_average || 0,
        rating_count: data.rating_count || 0,
        download_count: data.download_count || 0,
        tags: data.tags || [],
        included_elements: data.included_elements || []
      };

      setFrames(prev => [mappedFrame, ...prev]);
      return mappedFrame;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to create frame');
    }
  }, []);

  // Update frame
  const updateFrame = useCallback(async (id: string, updates: Partial<CRDFrame>) => {
    try {
      const dbUpdates = {
        ...updates,
        frame_config: updates.frame_config ? updates.frame_config as any : undefined
      };

      const { data, error } = await supabase
        .from('crd_frames')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Transform frame_config for consistency
      const frameConfig = data.frame_config as any;
      if (frameConfig?.regions) {
        frameConfig.regions = frameConfig.regions.map((region: any) => {
          if (region.x !== undefined || region.y !== undefined) {
            const { x = 0, y = 0, width = 100, height = 100, ...otherProps } = region;
            return {
              ...otherProps,
              bounds: { x, y, width, height }
            };
          }
          return region;
        });
      }
      
      const mappedFrame: CRDFrame = {
        ...data,
        version: (data as any).version || '1.0.0',
        frame_config: frameConfig,
        category: data.category || '',
        name: data.name || '',
        is_public: data.is_public || false,
        price_cents: data.price_cents || 0,
        rating_average: data.rating_average || 0,
        rating_count: data.rating_count || 0,
        download_count: data.download_count || 0,
        tags: data.tags || [],
        included_elements: data.included_elements || []
      };

      setFrames(prev => prev.map(frame => 
        frame.id === id ? { ...frame, ...mappedFrame } : frame
      ));
      return mappedFrame;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update frame');
    }
  }, []);

  // Get frame by ID
  const getFrame = useCallback(async (id: string): Promise<CRDFrame | null> => {
    try {
      const { data, error } = await supabase
        .from('crd_frames')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform frame_config for consistency
      const frameConfig = data.frame_config as any;
      if (frameConfig?.regions) {
        frameConfig.regions = frameConfig.regions.map((region: any) => {
          if (region.x !== undefined || region.y !== undefined) {
            const { x = 0, y = 0, width = 100, height = 100, ...otherProps } = region;
            return {
              ...otherProps,
              bounds: { x, y, width, height }
            };
          }
          return region;
        });
      }
      
      const mappedFrame: CRDFrame = {
        ...data,
        version: (data as any).version || '1.0.0',
        frame_config: frameConfig,
        category: data.category || '',
        name: data.name || '',
        is_public: data.is_public || false,
        price_cents: data.price_cents || 0,
        rating_average: data.rating_average || 0,
        rating_count: data.rating_count || 0,
        download_count: data.download_count || 0,
        tags: data.tags || [],
        included_elements: data.included_elements || []
      };
      
      return mappedFrame;
    } catch (err) {
      console.error('Failed to get frame:', err);
      return null;
    }
  }, []);

  // Increment download count
  const incrementDownload = useCallback(async (id: string) => {
    try {
      // Get current download count and increment
      const { data: currentFrame } = await supabase
        .from('crd_frames')
        .select('download_count')
        .eq('id', id)
        .single();

      if (currentFrame) {
        await supabase
          .from('crd_frames')
          .update({ download_count: (currentFrame.download_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (err) {
      console.error('Failed to increment download count:', err);
    }
  }, []);

  useEffect(() => {
    loadFrames();
    loadElements();
    loadVisualStyles();
  }, [loadFrames, loadElements, loadVisualStyles]);

  return {
    frames,
    elements,
    visualStyles,
    loading,
    error,
    loadFrames,
    loadElements,
    loadVisualStyles,
    createFrame,
    updateFrame,
    getFrame,
    incrementDownload
  };
};