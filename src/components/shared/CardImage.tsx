import React from 'react';
import { OptimizedImage } from '@/components/shared/OptimizedImage';
import { useOptimizedImage } from '@/hooks/useOptimizedImage';

interface CardImageProps {
  imageUrl: string;
  title: string;
  context: 'grid' | 'single' | 'studio' | 'list';
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({ 
  imageUrl, 
  title, 
  context,
  className = '' 
}) => {
  const { preloadSizes } = useOptimizedImage({ 
    src: imageUrl, 
    context 
  });

  // Preload common sizes on hover for better UX
  const handleMouseEnter = () => {
    if (context === 'grid') {
      // Preload medium size for when user clicks to view single card
      preloadSizes(['medium']);
    } else if (context === 'single') {
      // Preload large size for studio view
      preloadSizes(['large']);
    }
  };

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
    >
      <OptimizedImage
        src={imageUrl}
        alt={title}
        context={context}
        className="w-full h-full rounded-lg"
        enableLazyLoading={context === 'grid' || context === 'list'}
        enableProgressiveLoading={true}
      />
      
      {/* Context-specific overlays */}
      {context === 'grid' && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg" />
      )}
    </div>
  );
};

// Usage examples:
export const CardImageExamples = () => {
  const sampleImageUrl = "https://example.com/card-image.jpg";
  
  return (
    <div className="space-y-8 p-4">
      {/* Grid view - uses thumbnail size */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardImage
            key={i}
            imageUrl={sampleImageUrl}
            title={`Card ${i + 1}`}
            context="grid"
            className="aspect-[3/4]"
          />
        ))}
      </div>
      
      {/* List view - uses thumbnail size */}
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 bg-crd-dark rounded-lg">
            <CardImage
              imageUrl={sampleImageUrl}
              title={`List Card ${i + 1}`}
              context="list"
              className="w-16 h-22 flex-shrink-0"
            />
            <div className="flex-1">
              <h3 className="text-crd-white font-semibold">Card Title</h3>
              <p className="text-crd-lightGray text-sm">Card description...</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Single view - uses medium size */}
      <div className="max-w-md mx-auto">
        <CardImage
          imageUrl={sampleImageUrl}
          title="Single Card View"
          context="single"
          className="aspect-[3/4]"
        />
      </div>
      
      {/* Studio view - uses large size */}
      <div className="max-w-2xl mx-auto">
        <CardImage
          imageUrl={sampleImageUrl}
          title="Studio Card View"
          context="studio"
          className="aspect-[3/4]"
        />
      </div>
    </div>
  );
};