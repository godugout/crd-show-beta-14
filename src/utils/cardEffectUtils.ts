
// Image processing utilities for card effects
export const processImageFile = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        
        // Optimize dimensions for card display
        const maxWidth = 1024;
        const maxHeight = 1024;
        let { width, height } = img;
        
        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw optimized image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Return optimized data URL
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

// Generate unique card IDs
export const generateCardId = (): string => {
  return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Rarity system utilities
export const getRarityColor = (rarity: string): string => {
  const colors = {
    common: '#9CA3AF',
    uncommon: '#22C55E', 
    rare: '#3B82F6',
    'ultra-rare': '#8B5CF6',
    legendary: '#F59E0B',
  };
  return colors[rarity as keyof typeof colors] || colors.common;
};

// Format stats for display
export const formatPlayerStats = (stats: Record<string, any>): string => {
  return Object.entries(stats)
    .map(([key, value]) => `${key}: ${value}`)
    .join(' • ');
};
