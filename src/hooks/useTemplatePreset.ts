import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface TemplatePreset {
  id: string;
  name: string;
  templateId: string;
  camera: {
    position: [number, number, number];
    target: [number, number, number];
    zoom: number;
  };
  materials: {
    styleId: string;
    intensity: number;
    lightingPreset: string;
  };
  metadata?: Record<string, any>;
  userId?: string;
  createdAt: string;
}

export function useTemplatePreset() {
  const [presets, setPresets] = useState<TemplatePreset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const savePreset = useCallback(async (preset: Omit<TemplatePreset, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      // For now, save to localStorage. In future, could save to Supabase
      const presetWithId = {
        ...preset,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      };
      
      const existingPresets = JSON.parse(localStorage.getItem('templatePresets') || '[]');
      const updatedPresets = [...existingPresets, presetWithId];
      localStorage.setItem('templatePresets', JSON.stringify(updatedPresets));
      
      setPresets(updatedPresets);
      return presetWithId;
    } catch (error) {
      console.error('Failed to save template preset:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPresets = useCallback(async () => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem('templatePresets');
      const presets = saved ? JSON.parse(saved) : [];
      setPresets(presets);
      return presets;
    } catch (error) {
      console.error('Failed to load template presets:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePreset = useCallback(async (presetId: string) => {
    try {
      const existingPresets = JSON.parse(localStorage.getItem('templatePresets') || '[]');
      const updatedPresets = existingPresets.filter((p: TemplatePreset) => p.id !== presetId);
      localStorage.setItem('templatePresets', JSON.stringify(updatedPresets));
      setPresets(updatedPresets);
    } catch (error) {
      console.error('Failed to delete template preset:', error);
      throw error;
    }
  }, []);

  const applyPreset = useCallback((preset: TemplatePreset) => {
    return {
      templateConfig: { templateId: preset.templateId, mode: 'cinematic' as const },
      camera: preset.camera,
      materials: preset.materials
    };
  }, []);

  return {
    presets,
    isLoading,
    savePreset,
    loadPresets,
    deletePreset,
    applyPreset
  };
}