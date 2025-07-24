
import React from 'react';
import { cn } from '@/lib/utils';

interface ScrollableLayoutProps {
  children: React.ReactNode;
  enableSnapScroll?: boolean;
  className?: string;
}

export const ScrollableLayout: React.FC<ScrollableLayoutProps> = ({
  children,
  enableSnapScroll = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'w-full',
        enableSnapScroll && 'snap-y snap-mandatory overflow-y-auto h-screen',
        className
      )}
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </div>
  );
};
