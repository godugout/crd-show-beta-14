import { supabase } from '@/integrations/supabase/client';
import type { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';
import type { PSDFile, CRDElement, CRDFrame } from '@/types/psd';

/**
 * Create CRD Elements from PSD layers
 */
export async function createCRDElements(
  layers: PSDLayer[], 
  psdFile: PSDFile
): Promise<CRDElement[]> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create CRD elements');
    }

    const elements: CRDElement[] = [];

    for (const layer of layers) {
      // Skip layers without image data
      if (!layer.content?.imageData && layer.type !== 'text') {
        continue;
      }

      // Determine element type
      let elementType: CRDElement['elementType'] = 'image';
      if (layer.type === 'text') elementType = 'text';
      else if (layer.type === 'shape') elementType = 'shape';

      // Create element record
      const element: CRDElement = {
        id: crypto.randomUUID(),
        name: layer.name,
        elementType,
        imageUrl: layer.content?.imageData || '', // Would normally be uploaded to storage
        width: layer.bounds.width,
        height: layer.bounds.height,
        config: {
          position: { x: layer.bounds.x, y: layer.bounds.y },
          scale: 1,
          rotation: 0,
          opacity: layer.styleProperties?.opacity || 1,
          blendMode: layer.styleProperties?.blendMode || 'normal',
        },
        metadata: {
          sourceFile: psdFile.name,
          layerName: layer.name,
          extractedAt: new Date(),
          tags: [elementType, 'psd-import'],
        },
        creatorId: user.id,
        isPublic: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      elements.push(element);

      // Save to database
      const { error } = await supabase
        .from('crd_elements')
        .insert({
          name: element.name,
          element_type: element.elementType,
          config: element.config,
          creator_id: element.creatorId,
          is_public: element.isPublic,
        });

      if (error) {
        console.error('Error saving CRD element:', error);
        // Continue with other elements even if one fails
      }
    }

    return elements;
  } catch (error) {
    console.error('Error creating CRD elements:', error);
    throw new Error('Failed to create CRD elements');
  }
}

/**
 * Create a CRD Frame from elements
 */
export async function createCRDFrame(
  elements: CRDElement[], 
  psdFile: PSDFile,
  frameName?: string
): Promise<CRDFrame> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be authenticated to create CRD frames');
    }

    // Create frame configuration
    const frameConfig = {
      width: psdFile.width,
      height: psdFile.height,
      elements: elements.map((element, index) => ({
        elementId: element.id,
        position: element.config.position || { x: 0, y: 0 },
        scale: element.config.scale || 1,
        rotation: element.config.rotation || 0,
        opacity: element.config.opacity || 1,
        zIndex: index,
        locked: false,
      })),
      background: {
        type: 'color' as const,
        value: '#FFFFFF',
      },
      effects: [],
    };

    const frame: CRDFrame = {
      id: crypto.randomUUID(),
      name: frameName || `${psdFile.name} Frame`,
      category: 'psd-import',
      description: `Auto-generated frame from ${psdFile.name}`,
      frameConfig,
      isPublic: false,
      tags: ['psd-import', 'auto-generated'],
      creatorId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to database
    const { data, error } = await supabase
      .from('crd_frames')
      .insert({
        name: frame.name,
        category: frame.category,
        description: frame.description,
        frame_config: frame.frameConfig,
        is_public: frame.isPublic,
        tags: frame.tags,
        creator_id: frame.creatorId,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return { ...frame, id: data.id };
  } catch (error) {
    console.error('Error creating CRD frame:', error);
    throw new Error('Failed to create CRD frame');
  }
}

/**
 * Get user's CRD elements
 */
export async function getUserCRDElements(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('crd_elements')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching CRD elements:', error);
    return [];
  }
}

/**
 * Get user's CRD frames
 */
export async function getUserCRDFrames(userId: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('crd_frames')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching CRD frames:', error);
    return [];
  }
}

/**
 * Get public CRD frames by category
 */
export async function getPublicCRDFrames(category?: string, limit = 20): Promise<any[]> {
  try {
    let query = supabase
      .from('crd_frames')
      .select('*')
      .eq('is_public', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query
      .order('download_count', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching public CRD frames:', error);
    return [];
  }
}