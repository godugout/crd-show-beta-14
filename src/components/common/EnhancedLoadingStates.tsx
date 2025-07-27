import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'shimmer' | 'dots';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

interface CardGridSkeletonProps {
  count?: number;
  className?: string;
}

interface CardSkeletonProps {
  showImage?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  showBadge?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  size = 'md',
  message = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return <Loader2 className={cn('animate-spin', sizeClasses[size])} />;
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'bg-current rounded-full animate-pulse',
                  size === 'sm' ? 'w-1 h-1' : 'w-2 h-2'
                )}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );
      case 'pulse':
        return (
          <div className={cn('bg-current rounded-full animate-pulse', sizeClasses[size])} />
        );
      case 'shimmer':
        return (
          <div className={cn('bg-gradient-to-r from-transparent via-current to-transparent animate-pulse', sizeClasses[size])} />
        );
      default:
        return <Loader2 className={cn('animate-spin', sizeClasses[size])} />;
    }
  };

  return (
    <div className={cn('flex items-center justify-center space-x-2', className)}>
      {renderLoader()}
      {message && (
        <span className="text-sm text-crd-lightGray animate-pulse">
          {message}
        </span>
      )}
    </div>
  );
};

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  showImage = true,
  showTitle = true,
  showDescription = true,
  showBadge = true,
  className = ''
}) => {
  return (
    <div className={cn('bg-crd-darker rounded-lg overflow-hidden border border-crd-mediumGray/20', className)}>
      {showImage && (
        <div className="aspect-[3/4] relative">
          <Skeleton className="absolute inset-0 bg-crd-mediumGray/20" />
          {showBadge && (
            <div className="absolute top-2 right-2">
              <Skeleton className="w-12 h-6 rounded-full bg-crd-mediumGray/30" />
            </div>
          )}
        </div>
      )}
      
      <div className="p-4 space-y-3">
        {showTitle && (
          <Skeleton className="h-4 bg-crd-mediumGray/20 rounded w-3/4" />
        )}
        {showDescription && (
          <div className="space-y-2">
            <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-full" />
            <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-2/3" />
          </div>
        )}
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-16" />
          <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-20" />
        </div>
      </div>
    </div>
  );
};

export const CardGridSkeleton: React.FC<CardGridSkeletonProps> = ({
  count = 8,
  className = ''
}) => {
  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const MarketplaceSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero skeleton */}
      <div className="bg-crd-darker rounded-2xl p-8">
        <Skeleton className="h-8 bg-crd-mediumGray/20 rounded w-1/3 mb-4" />
        <Skeleton className="h-4 bg-crd-mediumGray/20 rounded w-1/2 mb-6" />
        <div className="flex gap-4">
          <Skeleton className="h-12 bg-crd-mediumGray/20 rounded-lg flex-1" />
          <Skeleton className="h-12 bg-crd-mediumGray/20 rounded-lg w-32" />
        </div>
      </div>
      
      {/* Filters skeleton */}
      <div className="flex gap-4">
        <Skeleton className="h-10 bg-crd-mediumGray/20 rounded-lg w-24" />
        <Skeleton className="h-10 bg-crd-mediumGray/20 rounded-lg w-32" />
        <Skeleton className="h-10 bg-crd-mediumGray/20 rounded-lg w-28" />
      </div>
      
      {/* Cards grid */}
      <CardGridSkeleton count={12} />
    </div>
  );
};

export const StudioSkeleton: React.FC = () => {
  return (
    <div className="h-screen bg-crd-darkest flex">
      {/* Sidebar skeleton */}
      <div className="w-80 bg-crd-darker border-r border-crd-mediumGray/20 p-6">
        <Skeleton className="h-8 bg-crd-mediumGray/20 rounded w-1/2 mb-6" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 bg-crd-mediumGray/20 rounded-lg" />
          ))}
        </div>
      </div>
      
      {/* Main content skeleton */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-6 bg-crd-mediumGray/20 rounded w-48" />
          <Skeleton className="h-10 bg-crd-mediumGray/20 rounded-lg w-32" />
        </div>
        
        <div className="aspect-[3/4] bg-crd-mediumGray/10 rounded-lg border border-crd-mediumGray/20 flex items-center justify-center">
          <LoadingState type="spinner" size="lg" message="Loading studio..." />
        </div>
      </div>
    </div>
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="bg-crd-darker rounded-2xl p-8">
        <div className="flex items-center space-x-6">
          <Skeleton className="w-24 h-24 bg-crd-mediumGray/20 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 bg-crd-mediumGray/20 rounded w-1/3" />
            <Skeleton className="h-4 bg-crd-mediumGray/20 rounded w-1/2" />
            <div className="flex space-x-4">
              <Skeleton className="h-8 bg-crd-mediumGray/20 rounded-lg w-24" />
              <Skeleton className="h-8 bg-crd-mediumGray/20 rounded-lg w-24" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-crd-darker rounded-lg p-6">
            <Skeleton className="h-4 bg-crd-mediumGray/20 rounded w-1/2 mb-2" />
            <Skeleton className="h-8 bg-crd-mediumGray/20 rounded w-1/3" />
          </div>
        ))}
      </div>
      
      {/* Cards grid */}
      <CardGridSkeleton count={6} />
    </div>
  );
}; 