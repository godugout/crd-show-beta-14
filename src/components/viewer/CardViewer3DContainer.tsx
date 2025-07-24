
import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { CardViewer3D } from './CardViewer3D';
import type { CardData } from '@/types/card';

interface CardViewer3DContainerProps {
  card: CardData;
  environment?: 'studio' | 'city' | 'sunset' | 'dawn';
  interactive?: boolean;
  autoRotate?: boolean;
  className?: string;
}

const CardViewer3DFallback: React.FC<{ card: CardData }> = ({ card }) => (
  <div className="w-full h-full bg-surface-medium flex items-center justify-center rounded-xl">
    <div className="text-center text-white p-8">
      <div className="w-32 h-44 bg-surface-dark rounded-lg mx-auto mb-4 flex items-center justify-center">
        {card.image_url ? (
          <img 
            src={card.image_url} 
            alt={card.title}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-text-muted">Card</span>
        )}
      </div>
      <p className="text-sm text-text-secondary">3D viewer unavailable</p>
    </div>
  </div>
);

const ErrorFallback: React.FC<{ error: Error; retry: () => void; card: CardData }> = ({ card }) => (
  <CardViewer3DFallback card={card} />
);

export const CardViewer3DContainer: React.FC<CardViewer3DContainerProps> = ({
  card,
  environment = 'studio',
  interactive = true,
  autoRotate = false,
  className = ''
}) => {
  return (
    <div className={`w-full h-full ${className}`}>
      <ErrorBoundary fallbackComponent={(props) => <ErrorFallback {...props} card={card} />}>
        <Suspense fallback={<CardViewer3DFallback card={card} />}>
          <CardViewer3D
            card={card}
            environment={environment}
            interactive={interactive}
            autoRotate={autoRotate}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
