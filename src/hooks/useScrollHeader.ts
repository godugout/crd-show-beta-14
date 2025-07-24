import { useState, useEffect } from 'react';

interface UseScrollHeaderProps {
  threshold?: number;
  hideOffset?: number;
}

export const useScrollHeader = ({ 
  threshold = 10, 
  hideOffset = 100 
}: UseScrollHeaderProps = {}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set scrolled state for styling
      setIsScrolled(currentScrollY > threshold);
      
      // Determine visibility based on scroll direction
      if (currentScrollY <= threshold) {
        // Always show at the top
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up - show header
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 5 && currentScrollY > hideOffset) {
        // Scrolling down and past hide offset - hide header
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [lastScrollY, threshold, hideOffset]);

  return { isVisible, isScrolled };
};