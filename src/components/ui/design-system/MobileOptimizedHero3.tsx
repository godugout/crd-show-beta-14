import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useAnimationController } from '@/hooks/useAnimationController';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

export interface MobileOptimizedHero3Props {
  caption?: string;
  heading?: string;
  bodyText?: string;
  ctaText?: string;
  ctaLink?: string;
  showFeaturedCards?: boolean;
  featuredCards?: any[];
  onCardClick?: (card: any) => void;
  shouldStartAnimation?: boolean;
}

export const MobileOptimizedHero3: React.FC<MobileOptimizedHero3Props> = ({ 
  caption, 
  heading, 
  bodyText, 
  ctaText, 
  ctaLink, 
  showFeaturedCards = false, 
  featuredCards = [], 
  onCardClick = () => {},
  shouldStartAnimation = false
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [focusedCard, setFocusedCard] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addAnimation, removeAnimation } = useAnimationController();
  const { hapticLight, hapticMedium, hapticSelection, isNative, orientation } = useMobileFeatures();

  // Physics state using refs for smooth animation
  const physicsRef = useRef({
    position: 0,
    velocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartPosition: 0,
    lastMoveX: 0,
    lastMoveTime: 0,
    velocityHistory: [] as number[]
  });

  const [isDragging, setIsDragging] = useState(false);

  // Mobile-optimized physics constants
  const FRICTION = 0.95;
  const VELOCITY_SCALE = 1.5;
  const MIN_VELOCITY = 0.08;
  const CARD_WIDTH = orientation === 'landscape' ? 320 : 280;
  const CARD_GAP = 16;
  const SNAP_THRESHOLD = CARD_WIDTH * 0.3;
  const MAX_VELOCITY_HISTORY = 3;

  const singleSetWidth = featuredCards.length * (CARD_WIDTH + CARD_GAP);

  // Enhanced animation with haptic feedback integration
  const animatePhysics = useCallback((timestamp: number) => {
    const physics = physicsRef.current;
    
    if (!physics.isDragging && Math.abs(physics.velocity) > MIN_VELOCITY) {
      physics.position += physics.velocity;
      physics.velocity *= FRICTION;
      
      // Infinite scroll normalization
      if (physics.position <= -singleSetWidth) {
        physics.position += singleSetWidth;
      }
      if (physics.position > 0) {
        physics.position -= singleSetWidth;
      }
      
      // Update current index for pagination dots
      const newIndex = Math.round(-physics.position / (CARD_WIDTH + CARD_GAP)) % featuredCards.length;
      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex >= 0 ? newIndex : newIndex + featuredCards.length);
        hapticLight(); // Subtle haptic feedback on snap
      }
      
      // Update DOM
      if (carouselRef.current) {
        carouselRef.current.style.transform = `translateX(${physics.position}px)`;
      }
      
      addAnimation('mobile-hero-physics', animatePhysics, 1);
    } else {
      physics.velocity = 0;
      removeAnimation('mobile-hero-physics');
    }
  }, [singleSetWidth, addAnimation, removeAnimation, currentIndex, hapticLight, featuredCards.length]);

  // Enhanced gesture handling for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const physics = physicsRef.current;
    const touch = e.touches[0];
    
    physics.isDragging = true;
    physics.dragStartX = touch.clientX;
    physics.dragStartPosition = physics.position;
    physics.lastMoveX = touch.clientX;
    physics.lastMoveTime = performance.now();
    physics.velocity = 0;
    physics.velocityHistory = [];
    
    setIsDragging(true);
    removeAnimation('mobile-hero-physics');
    hapticSelection(); // Haptic feedback on touch start
  }, [removeAnimation, hapticSelection]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const physics = physicsRef.current;
    if (!physics.isDragging) return;
    
    e.preventDefault();
    const touch = e.touches[0];
    const currentTime = performance.now();
    const deltaX = touch.clientX - physics.dragStartX;
    const newPosition = physics.dragStartPosition + deltaX;
    
    // Calculate velocity for momentum
    const timeDelta = currentTime - physics.lastMoveTime;
    if (timeDelta > 0) {
      const moveDelta = touch.clientX - physics.lastMoveX;
      const instantVelocity = moveDelta / timeDelta * 16;
      
      physics.velocityHistory.push(instantVelocity);
      if (physics.velocityHistory.length > MAX_VELOCITY_HISTORY) {
        physics.velocityHistory.shift();
      }
    }
    
    physics.position = newPosition;
    physics.lastMoveX = touch.clientX;
    physics.lastMoveTime = currentTime;
    
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${newPosition}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const physics = physicsRef.current;
    if (!physics.isDragging) return;

    physics.isDragging = false;
    setIsDragging(false);
    
    if (physics.velocityHistory.length > 0) {
      const avgVelocity = physics.velocityHistory.reduce((sum, v) => sum + v, 0) / physics.velocityHistory.length;
      physics.velocity = avgVelocity * VELOCITY_SCALE;
      
      // Limit velocity
      const maxVelocity = 20;
      physics.velocity = Math.max(-maxVelocity, Math.min(maxVelocity, physics.velocity));
      
      if (Math.abs(physics.velocity) > MIN_VELOCITY) {
        addAnimation('mobile-hero-physics', animatePhysics, 1);
      }
    }
    
    hapticLight(); // Haptic feedback on release
  }, [addAnimation, animatePhysics, hapticLight]);

  // Navigation functions with haptic feedback
  const navigateToCard = useCallback((index: number) => {
    const physics = physicsRef.current;
    if (physics.isDragging) return;
    
    const targetPosition = -(index * (CARD_WIDTH + CARD_GAP));
    physics.position = targetPosition;
    setCurrentIndex(index);
    
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${targetPosition}px)`;
      carouselRef.current.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      setTimeout(() => {
        if (carouselRef.current) {
          carouselRef.current.style.transition = '';
        }
      }, 300);
    }
    
    hapticMedium(); // Stronger haptic for navigation
  }, [hapticMedium]);

  const handlePrevious = useCallback(() => {
    const newIndex = currentIndex === 0 ? featuredCards.length - 1 : currentIndex - 1;
    navigateToCard(newIndex);
  }, [currentIndex, featuredCards.length, navigateToCard]);

  const handleNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % featuredCards.length;
    navigateToCard(newIndex);
  }, [currentIndex, featuredCards.length, navigateToCard]);

  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Mobile-first carousel container */}
      <div className="overflow-hidden relative">
        <div 
          ref={carouselRef}
          className="flex gap-4 select-none will-change-transform"
          style={{ 
            touchAction: 'pan-x',
            cursor: isDragging ? 'grabbing' : 'grab'
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Featured cards carousel"
        >
          {/* Duplicate cards for seamless infinite scroll */}
          {[...featuredCards, ...featuredCards].map((card, index) => (
            <div 
              key={`${card.id}-${index}`}
              className={`flex-shrink-0 ${orientation === 'landscape' ? 'w-80' : 'w-70'}`}
              onPointerEnter={() => !isDragging && setHoveredCard(`${card.id}-${index}`)}
              onPointerLeave={() => setHoveredCard(null)}
              onClick={(e) => e.preventDefault()}
              style={{
                transform: !isDragging && hoveredCard === `${card.id}-${index}` 
                  ? `scale(1.02) translateY(-2px)` 
                  : 'scale(1)',
                transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className="relative bg-crd-dark rounded-2xl overflow-hidden border border-crd-mediumGray/20"
                style={{
                  boxShadow: hoveredCard === `${card.id}-${index}`
                    ? `0 20px 40px -12px rgba(0, 0, 0, 0.4)`
                    : `0 8px 20px -3px rgba(0, 0, 0, 0.15)`,
                  transition: 'box-shadow 0.2s ease-out'
                }}
              >
                {/* Card Image */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  {card.image_url || card.thumbnail_url ? (
                    <img 
                      src={card.image_url || card.thumbnail_url} 
                      alt={card.title}
                      className="w-full h-full object-cover"
                      style={{
                        transform: !isDragging && hoveredCard === `${card.id}-${index}` 
                          ? `scale(1.05)` 
                          : 'scale(1)',
                        transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                        pointerEvents: isDragging ? 'none' : 'auto'
                      }}
                      draggable={false}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-crd-mediumGray/20 to-crd-darkGray flex items-center justify-center">
                      <div className="text-4xl opacity-50">🎨</div>
                    </div>
                  )}
                  
                  {/* Card overlay for mobile */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
                    <h3 className="text-white font-semibold text-sm mb-1">{card.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-crd-lightGray text-xs">by {card.creator_name || 'Unknown'}</p>
                      {card.rarity && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          card.rarity === 'legendary' ? 'bg-crd-orange text-black' :
                          card.rarity === 'rare' ? 'bg-crd-purple text-white' :
                          card.rarity === 'uncommon' ? 'bg-crd-blue text-white' :
                          'bg-crd-mediumGray text-white'
                        }`}>
                          {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modern mobile navigation */}
      <div className="flex items-center justify-between mt-6">
        {/* Navigation arrows - only show on larger mobile screens */}
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={handlePrevious}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20
                       flex items-center justify-center text-white
                       hover:bg-black/30 hover:scale-110 transition-all duration-200
                       active:scale-95"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md border border-white/20
                       flex items-center justify-center text-white
                       hover:bg-black/30 hover:scale-110 transition-all duration-200
                       active:scale-95"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        {/* Pagination dots */}
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          {featuredCards.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-crd-blue w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
          {featuredCards.length > 5 && (
            <MoreHorizontal className="w-4 h-4 text-white/50" />
          )}
        </div>
      </div>
    </div>
  );
};