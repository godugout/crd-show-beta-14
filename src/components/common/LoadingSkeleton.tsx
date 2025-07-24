import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSkeletonProps {
  variant?: 'card' | 'profile' | 'template' | 'list' | 'grid';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'card',
  count = 1,
  className = ''
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'card':
        return (
          <div className={`animate-pulse ${className}`}>
            <Skeleton className="aspect-[3/4] rounded-t-lg bg-crd-mediumGray/20" />
            <div className="bg-crd-darker p-4 rounded-b-lg space-y-2">
              <Skeleton className="h-4 bg-crd-mediumGray/20 rounded" />
              <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-2/3" />
              <div className="flex justify-between mt-3">
                <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-16" />
                <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-20" />
              </div>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className={`flex items-center space-x-4 animate-pulse ${className}`}>
            <Skeleton className="w-16 h-16 rounded-full bg-crd-mediumGray/20" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 bg-crd-mediumGray/20 rounded w-3/4" />
              <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-1/2" />
              <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-1/4" />
            </div>
          </div>
        );

      case 'template':
        return (
          <div className={`animate-pulse ${className}`}>
            <Skeleton className="aspect-[3/4] rounded-lg bg-crd-mediumGray/20 mb-3" />
            <Skeleton className="h-4 bg-crd-mediumGray/20 rounded mb-2" />
            <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-2/3" />
          </div>
        );

      case 'list':
        return (
          <div className={`flex items-center space-x-3 animate-pulse ${className}`}>
            <Skeleton className="w-12 h-12 rounded bg-crd-mediumGray/20" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 bg-crd-mediumGray/20 rounded" />
              <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-3/4" />
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
            {Array(count).fill(0).map((_, i) => (
              <div key={`grid-skeleton-${i}`} className="animate-pulse">
                <Skeleton className="aspect-[3/4] rounded-lg bg-crd-mediumGray/20 mb-3" />
                <Skeleton className="h-4 bg-crd-mediumGray/20 rounded mb-2" />
                <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-2/3" />
              </div>
            ))}
          </div>
        );

      default:
        return <Skeleton className={`bg-crd-mediumGray/20 ${className}`} />;
    }
  };

  if (count === 1) {
    return renderSkeleton();
  }

  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <div key={`skeleton-${i}`}>
          {renderSkeleton()}
        </div>
      ))}
    </div>
  );
};