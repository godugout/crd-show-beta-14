import { useState, useEffect, useRef } from 'react';

interface UseScrollTriggerProps {
  threshold?: number;
  rootMargin?: string;
}

export const useScrollTrigger = ({
  threshold = 0.1,
  rootMargin = '0px'
}: UseScrollTriggerProps = {}) => {
  const [isVisible, setIsVisible] = useState(true);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin
      }
    );

    const currentTarget = targetRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [threshold, rootMargin]);

  return { targetRef, isVisible };
};