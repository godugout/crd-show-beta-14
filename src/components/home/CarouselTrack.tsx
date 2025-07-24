import React, { memo, useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePerformanceMarks } from '@/hooks/usePerformanceMarks';

interface Card {
  id: string;
  title: string;
  image_url?: string;
  thumbnail_url?: string;
  rarity?: string;
  creator_id?: string;
}

interface CardItemProps {
  card: Card;
}

interface EnhancedCardItemProps {
  card: Card;
  scrollVelocity: number;
  position: number;
  isVisible: boolean;
}

const EnhancedCardItem = memo(({ card, scrollVelocity, position, isVisible }: EnhancedCardItemProps) => {
  const imageUrl = card.image_url || card.thumbnail_url || '/placeholder.svg';
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Physics-based animations
  const parallaxOffset = position * 0.1;
  const rotationY = Math.max(-15, Math.min(15, scrollVelocity * 0.8));
  const shadowIntensity = Math.abs(scrollVelocity) * 0.3 + (isHovered ? 0.6 : 0.2);
  const depth = isHovered ? 8 : Math.abs(scrollVelocity) * 2;
  
  return (
    <Link 
      to={`/card/${card.id}`}
      className="carousel-card flex-shrink-0 relative group cursor-pointer"
      style={{
        transform: `translateX(${parallaxOffset}px) rotateY(${rotationY}deg) translateZ(${depth}px)`,
        filter: isVisible ? 'none' : 'blur(2px)',
        transition: 'filter 0.3s ease-out',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="w-32 h-44 md:w-40 md:h-56 bg-crd-darker rounded-lg border border-crd-darkGray/20 overflow-hidden transition-all duration-500 ease-out"
        style={{
          borderColor: isHovered ? 'hsl(var(--crd-blue) / 0.6)' : 'hsl(var(--crd-darkGray) / 0.2)',
          boxShadow: `
            0 ${4 + depth}px ${12 + depth * 2}px -4px hsl(var(--crd-blue) / ${shadowIntensity * 0.3}),
            0 ${2 + depth * 0.5}px ${8 + depth}px -2px hsl(0 0% 0% / ${0.4 + shadowIntensity * 0.2}),
            inset 0 1px 0 hsl(255 255% 255% / 0.1)
          `,
          transform: isHovered ? 'scale(1.05) rotateX(5deg)' : 'scale(1)',
        }}
      >
        {/* Card Image */}
        <div className="w-full h-30 md:h-40 bg-crd-dark flex items-center justify-center overflow-hidden relative">
          {!isLoaded && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-crd-dark via-crd-darker to-crd-dark animate-pulse"
              style={{
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite linear',
              }}
            />
          )}
          <img 
            src={imageUrl}
            alt={card.title}
            className="w-full h-full object-cover transition-all duration-500 ease-out"
            style={{
              transform: isHovered ? 'scale(1.1) rotateZ(1deg)' : 'scale(1)',
              filter: isHovered ? 'brightness(1.1) contrast(1.05)' : 'brightness(1)',
            }}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          />
          
          {/* Hover gradient overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-crd-blue/20 via-transparent to-transparent opacity-0 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          />
        </div>
        
        {/* Card Info */}
        <div className="p-2 md:p-3 h-14 md:h-16 flex flex-col justify-center relative">
          <h3 
            className="text-xs md:text-sm font-medium text-crd-white truncate transition-all duration-300"
            style={{
              transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
              color: isHovered ? 'hsl(var(--crd-blue))' : 'hsl(var(--crd-white))',
            }}
          >
            {card.title}
          </h3>
          {card.rarity && (
            <p 
              className="text-xs text-crd-mediumGray mt-1 transition-all duration-300"
              style={{
                transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                opacity: isHovered ? 0.8 : 0.6,
              }}
            >
              {card.rarity}
            </p>
          )}
          
          {/* Subtle shine effect on hover */}
          {isHovered && (
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{
                transform: 'skewX(-20deg)',
                animation: 'shine 0.6s ease-out',
              }}
            />
          )}
        </div>
      </div>
    </Link>
  );
});

EnhancedCardItem.displayName = 'EnhancedCardItem';

interface CarouselTrackProps {
  cards: Card[];
}

// Enhanced physics-based carousel with momentum scrolling
export const CarouselTrack = memo(({ cards }: CarouselTrackProps) => {
  usePerformanceMarks('CarouselTrack');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [momentum, setMomentum] = useState(0);
  const animationRef = useRef<number>();
  const lastScrollTime = useRef(Date.now());
  const lastScrollLeft = useRef(0);

  // Physics-based momentum scrolling
  const updateMomentum = useCallback(() => {
    if (!trackRef.current || isDragging) return;
    
    const currentTime = Date.now();
    const deltaTime = currentTime - lastScrollTime.current;
    const currentScroll = trackRef.current.scrollLeft;
    const deltaScroll = currentScroll - lastScrollLeft.current;
    
    if (deltaTime > 0) {
      const velocity = deltaScroll / deltaTime;
      setScrollVelocity(velocity);
      
      // Apply momentum decay
      if (Math.abs(momentum) > 0.1) {
        trackRef.current.scrollLeft += momentum;
        setMomentum(momentum * 0.95); // Natural deceleration
      } else {
        setMomentum(0);
      }
    }
    
    lastScrollTime.current = currentTime;
    lastScrollLeft.current = currentScroll;
    
    animationRef.current = requestAnimationFrame(updateMomentum);
  }, [momentum, isDragging]);

  // Mouse/touch handlers for natural dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
    setMomentum(0);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    trackRef.current.scrollLeft = scrollLeft - walk;
  }, [isDragging, startX, scrollLeft]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setMomentum(scrollVelocity * 20); // Convert velocity to momentum
  }, [scrollVelocity]);

  // Wheel scrolling with natural velocity mapping
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!trackRef.current) return;
    e.preventDefault();
    
    const scrollAmount = e.deltaY * 0.8;
    trackRef.current.scrollLeft += scrollAmount;
    setMomentum(scrollAmount * 0.3);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!trackRef.current) return;
    
    const cardWidth = 140; // Updated for smaller responsive card width
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        trackRef.current.scrollLeft -= cardWidth;
        setMomentum(-cardWidth * 0.2);
        break;
      case 'ArrowRight':
        e.preventDefault();
        trackRef.current.scrollLeft += cardWidth;
        setMomentum(cardWidth * 0.2);
        break;
    }
  }, []);

  // Set up momentum animation
  useEffect(() => {
    animationRef.current = requestAnimationFrame(updateMomentum);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [updateMomentum]);

  // Reduced motion support
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setMomentum(0);
      setScrollVelocity(0);
    }
  }, []);

  if (!cards || cards.length === 0) {
    return null;
  }

  const duplicatedCards = [...cards, ...cards];

  return (
    <div 
      ref={containerRef}
      className="carousel-container relative overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      <div 
        ref={trackRef}
        className="enhanced-carousel-track flex gap-4 overflow-x-auto scrollbar-hide pb-4"
        style={{
          scrollBehavior: isDragging ? 'auto' : 'smooth',
          cursor: isDragging ? 'grabbing' : 'grab',
          transform: `rotateX(${Math.abs(scrollVelocity) * 2}deg)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out',
          animation: 'none', // Override any CSS animations
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Featured cards carousel"
      >
        {duplicatedCards.map((card, i) => {
          const position = i - cards.length / 2;
          const isVisible = Math.abs(position) < 10;
          
          return (
            <EnhancedCardItem 
              key={`${card.id}-${i}`} 
              card={card} 
              scrollVelocity={scrollVelocity}
              position={position}
              isVisible={isVisible}
            />
          );
        })}
      </div>
      
      {/* Gradient overlays for depth */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-crd-darker to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-crd-darker to-transparent pointer-events-none" />
      
      <style>{`
        .enhanced-carousel-track {
          animation: none !important;
          will-change: transform;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-20deg); }
          100% { transform: translateX(300%) skewX(-20deg); }
        }
      `}</style>
    </div>
  );
});

CarouselTrack.displayName = 'CarouselTrack';