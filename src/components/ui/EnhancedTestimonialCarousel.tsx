import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  featured?: boolean;
}

interface EnhancedTestimonialCarouselProps {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showNavigation?: boolean;
  showDots?: boolean;
  className?: string;
}

interface CarouselState {
  currentIndex: number;
  isAnimating: boolean;
  isDragging: boolean;
  velocity: number;
  momentum: number;
  dragStartX: number;
  dragCurrentX: number;
  translateX: number;
}

const TestimonialCard = memo(({ 
  testimonial, 
  index, 
  currentIndex, 
  translateX, 
  velocity,
  isVisible 
}: {
  testimonial: Testimonial;
  index: number;
  currentIndex: number;
  translateX: number;
  velocity: number;
  isVisible: boolean;
}) => {
  const distance = Math.abs(index - currentIndex);
  const isActive = index === currentIndex;
  const isAdjacent = distance === 1;
  
  // Physics-based animations
  const parallaxOffset = (index - currentIndex) * 0.5;
  const rotationAngle = velocity * 0.1 * (index - currentIndex);
  const scaleValue = isActive ? 1 : isAdjacent ? 0.95 : 0.9;
  const opacityValue = isActive ? 1 : isAdjacent ? 0.8 : 0.6;
  
  // Multi-layered shadows based on position and velocity
  const shadowIntensity = Math.abs(velocity) * 0.1 + (isActive ? 1 : 0.3);
  const shadowBlur = Math.abs(velocity) * 2 + (isActive ? 20 : 10);
  const shadowOffset = velocity * 0.5;
  
  const cardStyle = {
    transform: `
      translateX(${translateX + parallaxOffset}px) 
      translateZ(${isActive ? 0 : -distance * 50}px)
      rotateY(${rotationAngle}deg)
      scale(${scaleValue})
    `,
    opacity: opacityValue,
    filter: `blur(${distance > 1 ? 2 : 0}px)`,
    boxShadow: `
      0 ${4 + shadowOffset}px ${shadowBlur}px rgba(0, 0, 0, ${0.1 * shadowIntensity}),
      0 ${8 + shadowOffset * 2}px ${shadowBlur * 2}px rgba(0, 0, 0, ${0.08 * shadowIntensity}),
      0 ${16 + shadowOffset * 3}px ${shadowBlur * 3}px rgba(0, 0, 0, ${0.06 * shadowIntensity})
    `,
    transition: velocity === 0 ? 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
  };

  return (
    <div
      className={cn(
        "absolute top-0 left-1/2 w-80 bg-background rounded-xl border border-border p-6",
        "will-change-transform backface-hidden",
        isActive && "z-10"
      )}
      style={cardStyle}
      role="tabpanel"
      aria-hidden={!isActive}
      tabIndex={isActive ? 0 : -1}
    >
      {/* Quote icon */}
      <Quote className="w-8 h-8 text-primary/20 mb-4" />
      
      {/* Rating stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: 5 }, (_, i) => (
          <Star 
            key={i}
            className={cn(
              "w-4 h-4",
              i < testimonial.rating 
                ? "text-yellow-400 fill-current" 
                : "text-muted-foreground"
            )}
          />
        ))}
      </div>
      
      {/* Content */}
      <blockquote className="text-foreground/90 mb-6 leading-relaxed">
        "{testimonial.content}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center gap-3">
        {testimonial.avatar ? (
          <img 
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold">
              {testimonial.name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <div className="font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-sm text-muted-foreground">
            {testimonial.role} at {testimonial.company}
          </div>
        </div>
      </div>
    </div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';

export const EnhancedTestimonialCarousel = memo(({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 5000,
  showNavigation = true,
  showDots = true,
  className
}: EnhancedTestimonialCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const autoPlayTimerRef = useRef<number>();
  
  const [state, setState] = useState<CarouselState>({
    currentIndex: 0,
    isAnimating: false,
    isDragging: false,
    velocity: 0,
    momentum: 0,
    dragStartX: 0,
    dragCurrentX: 0,
    translateX: 0
  });

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Momentum physics calculation
  const updateMomentum = useCallback(() => {
    if (!state.isDragging && Math.abs(state.momentum) > 0.1) {
      setState(prev => {
        const newMomentum = prev.momentum * 0.95; // Natural deceleration
        const newVelocity = newMomentum * 0.1;
        
        if (Math.abs(newMomentum) < 0.1) {
          return { ...prev, momentum: 0, velocity: 0 };
        }
        
        return {
          ...prev,
          momentum: newMomentum,
          velocity: newVelocity,
          translateX: prev.translateX + newMomentum
        };
      });
    }
  }, [state.isDragging, state.momentum]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      updateMomentum();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    if (!prefersReducedMotion) {
      animate();
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateMomentum, prefersReducedMotion]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !state.isDragging && !prefersReducedMotion) {
      autoPlayTimerRef.current = window.setTimeout(() => {
        goToNext();
      }, autoPlayInterval);
    }
    
    return () => {
      if (autoPlayTimerRef.current) {
        clearTimeout(autoPlayTimerRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, state.currentIndex, state.isDragging, prefersReducedMotion]);

  const goToSlide = useCallback((index: number) => {
    const clampedIndex = Math.max(0, Math.min(testimonials.length - 1, index));
    setState(prev => ({
      ...prev,
      currentIndex: clampedIndex,
      isAnimating: true,
      momentum: 0,
      velocity: 0,
      translateX: 0
    }));
    
    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, 600);
  }, [testimonials.length]);

  const goToNext = useCallback(() => {
    goToSlide((state.currentIndex + 1) % testimonials.length);
  }, [state.currentIndex, testimonials.length, goToSlide]);

  const goToPrev = useCallback(() => {
    goToSlide((state.currentIndex - 1 + testimonials.length) % testimonials.length);
  }, [state.currentIndex, testimonials.length, goToSlide]);

  // Touch/Mouse event handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const clientX = e.clientX;
    setState(prev => ({
      ...prev,
      isDragging: true,
      dragStartX: clientX,
      dragCurrentX: clientX,
      momentum: 0,
      velocity: 0
    }));
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!state.isDragging) return;
    
    const clientX = e.clientX;
    const deltaX = clientX - state.dragCurrentX;
    const velocity = deltaX * 0.1;
    
    setState(prev => ({
      ...prev,
      dragCurrentX: clientX,
      velocity,
      translateX: prev.translateX + deltaX,
      momentum: deltaX
    }));
  }, [state.isDragging, state.dragCurrentX]);

  const handlePointerUp = useCallback(() => {
    if (!state.isDragging) return;
    
    const dragDistance = state.dragCurrentX - state.dragStartX;
    const threshold = 50;
    
    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        goToPrev();
      } else {
        goToNext();
      }
    } else {
      // Snap back with elastic feel
      setState(prev => ({
        ...prev,
        isDragging: false,
        translateX: 0,
        momentum: -prev.translateX * 0.1
      }));
    }
  }, [state.isDragging, state.dragCurrentX, state.dragStartX, goToNext, goToPrev]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        goToPrev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        goToNext();
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(testimonials.length - 1);
        break;
    }
  }, [goToNext, goToPrev, goToSlide, testimonials.length]);

  if (!testimonials.length) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-muted-foreground">
        No testimonials available
      </div>
    );
  }

  return (
    <div 
      className={cn("relative w-full h-96 overflow-hidden", className)}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="tablist"
      aria-label="Customer testimonials carousel"
      style={{ perspective: '1000px' }}
    >
      {/* Testimonial cards */}
      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
            currentIndex={state.currentIndex}
            translateX={state.translateX}
            velocity={state.velocity}
            isVisible={Math.abs(index - state.currentIndex) <= 1}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      {showNavigation && (
        <>
          <button
            onClick={goToPrev}
            className={cn(
              "absolute left-4 top-1/2 -translate-y-1/2 z-20",
              "w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm",
              "border border-border hover:bg-background",
              "flex items-center justify-center",
              "transition-all duration-200 hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={goToNext}
            className={cn(
              "absolute right-4 top-1/2 -translate-y-1/2 z-20",
              "w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm",
              "border border-border hover:bg-background",
              "flex items-center justify-center",
              "transition-all duration-200 hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots indicator */}
      {showDots && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                index === state.currentIndex
                  ? "bg-primary w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

EnhancedTestimonialCarousel.displayName = 'EnhancedTestimonialCarousel';