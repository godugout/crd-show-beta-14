
import React from 'react';
import { cn } from '@/lib/utils';
import { useResponsiveBreakpoints } from '@/hooks/useResponsiveBreakpoints';

interface AdaptiveHeroProps {
  children: React.ReactNode;
  className?: string;
  allowOverlap?: boolean;
}

export const AdaptiveHero: React.FC<AdaptiveHeroProps> = ({
  children,
  className,
  allowOverlap = false,
}) => {
  const { isShortScreen, isMobile, deviceType } = useResponsiveBreakpoints();

  // Determine if we should use overlay mode or separate sections
  const useOverlayMode = allowOverlap && !isShortScreen && !isMobile;

  return (
    <div
      className={cn(
        'relative w-full',
        useOverlayMode ? 'h-screen' : 'min-h-screen',
        className
      )}
      data-device-type={deviceType}
      data-overlay-mode={useOverlayMode}
    >
      {children}
    </div>
  );
};
