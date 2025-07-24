
import { useState, useEffect } from 'react';

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isShortScreen: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'large-desktop';
}

const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  desktop: 1440,
  shortScreen: 700, // Height breakpoint for short screens
} as const;

export function useResponsiveBreakpoints(): ResponsiveBreakpoints {
  const [breakpoints, setBreakpoints] = useState<ResponsiveBreakpoints>(() => {
    if (typeof window === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isLargeDesktop: false,
        isShortScreen: false,
        screenWidth: 1024,
        screenHeight: 768,
        orientation: 'landscape',
        deviceType: 'desktop',
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return calculateBreakpoints(width, height);
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setBreakpoints(calculateBreakpoints(width, height));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoints;
}

function calculateBreakpoints(width: number, height: number): ResponsiveBreakpoints {
  const isMobile = width < BREAKPOINTS.mobile;
  const isTablet = width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
  const isDesktop = width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop;
  const isLargeDesktop = width >= BREAKPOINTS.desktop;
  const isShortScreen = height < BREAKPOINTS.shortScreen;
  const orientation = width > height ? 'landscape' : 'portrait';

  let deviceType: ResponsiveBreakpoints['deviceType'];
  if (isMobile) deviceType = 'mobile';
  else if (isTablet) deviceType = 'tablet';
  else if (isLargeDesktop) deviceType = 'large-desktop';
  else deviceType = 'desktop';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isShortScreen,
    screenWidth: width,
    screenHeight: height,
    orientation,
    deviceType,
  };
}
