// Material fallback system for template engine
export interface MaterialFallback {
  styleId: string;
  intensity: number;
  lightingPreset: string;
  foilIntensity?: number;
  glossiness?: number;
}

export const DEFAULT_MATERIAL: MaterialFallback = {
  styleId: 'matte',
  intensity: 1.0,
  lightingPreset: 'studio',
  foilIntensity: 0.5,
  glossiness: 0.3
};

export const TEMPLATE_MATERIALS: Record<string, MaterialFallback> = {
  cosmic: {
    styleId: 'holoBurst',
    intensity: 1.2,
    lightingPreset: 'dramatic',
    foilIntensity: 0.8,
    glossiness: 0.7
  },
  // Add more template-specific materials here
};

export function getMaterialForTemplate(templateId: string): MaterialFallback {
  return TEMPLATE_MATERIALS[templateId] || DEFAULT_MATERIAL;
}

export function ensureMaterialPersistence(
  currentMaterial: Partial<MaterialFallback>, 
  templateId?: string
): MaterialFallback {
  const templateDefault = templateId ? getMaterialForTemplate(templateId) : DEFAULT_MATERIAL;
  
  return {
    styleId: currentMaterial.styleId || templateDefault.styleId,
    intensity: currentMaterial.intensity ?? templateDefault.intensity,
    lightingPreset: currentMaterial.lightingPreset || templateDefault.lightingPreset,
    foilIntensity: currentMaterial.foilIntensity ?? templateDefault.foilIntensity,
    glossiness: currentMaterial.glossiness ?? templateDefault.glossiness
  };
}