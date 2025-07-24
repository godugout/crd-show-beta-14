
import { useEffect, useRef } from 'react';

interface UseScrollResistanceProps {
  resistanceThreshold?: number;
  resistanceMultiplier?: number;
}

export const useScrollResistance = ({
  resistanceThreshold = 100,
  resistanceMultiplier = 3
}: UseScrollResistanceProps = {}) => {
  const scrollVelocityRef = useRef(0);
  const lastScrollTimeRef = useRef(0);
  const accumulatedScrollRef = useRef(0);

  useEffect(() => {
    let isOnResistanceSection = false;

    const handleScroll = (event: WheelEvent) => {
      // Check if we're in the scroll priority zone (bottom 180px)
      const bottomScrollZone = window.innerHeight - 180;
      if (event.clientY > bottomScrollZone) {
        // Allow normal scrolling in the priority zone - no resistance
        return;
      }

      const animationSection = document.getElementById('animation-section');
      if (!animationSection) return;

      const rect = animationSection.getBoundingClientRect();
      isOnResistanceSection = rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (isOnResistanceSection) {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastScrollTimeRef.current;
        
        // Calculate scroll velocity
        scrollVelocityRef.current = Math.abs(event.deltaY) / (deltaTime || 1);
        
        // Accumulate scroll attempts
        accumulatedScrollRef.current += Math.abs(event.deltaY);
        
        // Apply resistance if scroll velocity is below threshold
        if (scrollVelocityRef.current < resistanceThreshold && accumulatedScrollRef.current < 500) {
          event.preventDefault();
          event.stopPropagation();
          
          // Visual feedback - subtle shake
          animationSection.style.transform = `translateY(${Math.sin(Date.now() * 0.01) * 2}px)`;
          setTimeout(() => {
            animationSection.style.transform = '';
          }, 100);
        } else {
          // Reset accumulation when user scrolls with force
          accumulatedScrollRef.current = 0;
        }
        
        lastScrollTimeRef.current = currentTime;
      } else {
        // Reset when not on resistance section
        accumulatedScrollRef.current = 0;
      }
    };

    // Only apply on short screens
    const isShortScreen = window.innerHeight < 700;
    if (isShortScreen) {
      window.addEventListener('wheel', handleScroll, { passive: false });
    }

    return () => {
      if (isShortScreen) {
        window.removeEventListener('wheel', handleScroll);
      }
    };
  }, [resistanceThreshold, resistanceMultiplier]);
};
