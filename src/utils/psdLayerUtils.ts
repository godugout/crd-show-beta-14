import { PSDLayer } from '@/components/editor/crd/import/CRDPSDProcessor';

/**
 * Determines which layers should be visible by default based on their content and importance
 */
export const getEssentialLayers = (layers: PSDLayer[]): Set<string> => {
  const essentialLayers = new Set<string>();
  
  const processLayers = (layerList: PSDLayer[]) => {
    for (const layer of layerList) {
      // Score layer importance
      const importance = calculateLayerImportance(layer);
      
      // Include layers with high importance scores
      if (importance >= 3) {
        essentialLayers.add(layer.id);
        console.log(`✅ Essential layer: ${layer.name} (score: ${importance})`);
      } else {
        console.log(`⏸️ Hidden layer: ${layer.name} (score: ${importance})`);
      }
      
      // Process child layers recursively
      if (layer.children && layer.children.length > 0) {
        processLayers(layer.children);
      }
    }
  };
  
  processLayers(layers);
  
  // Ensure at least one layer is visible
  if (essentialLayers.size === 0 && layers.length > 0) {
    const firstLayer = layers[0];
    essentialLayers.add(firstLayer.id);
    console.log(`🔄 Fallback: Making first layer visible: ${firstLayer.name}`);
  }
  
  return essentialLayers;
};

/**
 * Calculate importance score for a layer (0-5 scale)
 */
function calculateLayerImportance(layer: PSDLayer): number {
  let score = 0;
  const name = layer.name.toLowerCase();
  
  // Layer type scoring
  switch (layer.type) {
    case 'image':
      score += 2; // Images are usually important
      break;
    case 'text':
      score += 1.5; // Text is moderately important
      break;
    case 'shape':
      score += 1; // Shapes are less important
      break;
    case 'group':
      score += 0.5; // Groups are structural
      break;
  }
  
  // Content-based scoring
  if (layer.content) {
    if (layer.content.imageData) {
      score += 1.5; // Has actual image data
    }
    if (layer.content.text && layer.content.text.trim().length > 0) {
      score += 1; // Has meaningful text
    }
  }
  
  // Name-based importance hints
  const importantKeywords = [
    'main', 'primary', 'hero', 'title', 'player', 'character',
    'logo', 'brand', 'portrait', 'face', 'photo', 'image'
  ];
  
  const unimportantKeywords = [
    'background', 'bg', 'decoration', 'border', 'frame',
    'shadow', 'effect', 'overlay', 'texture', 'pattern'
  ];
  
  // Boost score for important content
  if (importantKeywords.some(keyword => name.includes(keyword))) {
    score += 1;
  }
  
  // Reduce score for decorative content
  if (unimportantKeywords.some(keyword => name.includes(keyword))) {
    score -= 0.5;
  }
  
  // Size-based scoring (larger elements are often more important)
  const area = layer.bounds.width * layer.bounds.height;
  if (area > 50000) { // Large elements
    score += 0.5;
  } else if (area < 1000) { // Very small elements
    score -= 0.5;
  }
  
  // Visibility boost
  if (layer.visible) {
    score += 0.5;
  }
  
  // Opacity consideration
  if (layer.styleProperties?.opacity && layer.styleProperties.opacity < 0.3) {
    score -= 1; // Very transparent layers are less important
  }
  
  return Math.max(0, Math.min(5, score)); // Clamp to 0-5 range
}

/**
 * Get layer statistics for debugging
 */
export const getLayerStats = (layers: PSDLayer[]) => {
  const stats = {
    total: 0,
    byType: { image: 0, text: 0, shape: 0, group: 0 },
    withContent: 0,
    visible: 0
  };
  
  const countLayers = (layerList: PSDLayer[]) => {
    for (const layer of layerList) {
      stats.total++;
      stats.byType[layer.type]++;
      
      if (layer.content && (layer.content.imageData || layer.content.text)) {
        stats.withContent++;
      }
      
      if (layer.visible) {
        stats.visible++;
      }
      
      if (layer.children) {
        countLayers(layer.children);
      }
    }
  };
  
  countLayers(layers);
  return stats;
};