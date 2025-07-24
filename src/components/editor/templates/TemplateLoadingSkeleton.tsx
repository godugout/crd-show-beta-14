import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface TemplateLoadingSkeletonProps {
  count?: number;
  className?: string;
}

export const TemplateLoadingSkeleton: React.FC<TemplateLoadingSkeletonProps> = ({
  count = 6,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 ${className}`}>
      {Array(count).fill(0).map((_, i) => (
        <div key={`template-skeleton-${i}`} className="animate-pulse">
          <div className="bg-crd-darker p-4 rounded-lg border border-crd-mediumGray/20">
            <Skeleton className="aspect-[3/4] rounded-lg bg-crd-mediumGray/20 mb-3" />
            <div className="space-y-2">
              <Skeleton className="h-4 bg-crd-mediumGray/20 rounded" />
              <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-2/3" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-16" />
                <Skeleton className="h-3 bg-crd-mediumGray/20 rounded w-12" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};