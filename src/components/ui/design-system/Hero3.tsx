import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useAnimationController } from '@/hooks/useAnimationController';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

export interface Hero3Props {
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

export const Hero3: React.FC<Hero3Props> = ({ 
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

  // Mobile-responsive physics constants
  const FRICTION = isNative ? 0.95 : 0.965;
  const VELOCITY_SCALE = isNative ? 1.5 : 1.2;
  const MIN_VELOCITY = isNative ? 0.08 : 0.05;
  const CARD_WIDTH = window.innerWidth >= 1024 ? 512 : window.innerWidth >= 768 ? 384 : window.innerWidth >= 640 ? 256 : 128;
  const CARD_GAP = window.innerWidth >= 1024 ? 32 : window.innerWidth < 640 ? 12 : 16;
  const MAX_VELOCITY_HISTORY = isNative ? 3 : 5;

  // Calculate single set width for infinite scroll
  const singleSetWidth = featuredCards.length * (CARD_WIDTH + CARD_GAP);

  // Smooth animation loop using RAF and refs
  const animatePhysics = useCallback((timestamp: number) => {
    const physics = physicsRef.current;
    
    if (!physics.isDragging && Math.abs(physics.velocity) > MIN_VELOCITY) {
      // Apply momentum with smooth deceleration
      physics.position += physics.velocity;
      physics.velocity *= FRICTION;
      
      // Infinite scroll normalization
      if (physics.position <= -singleSetWidth) {
        physics.position += singleSetWidth;
      }
      if (physics.position > 0) {
        physics.position -= singleSetWidth;
      }
      
        // Update current index for mobile pagination
        const newIndex = Math.round(-physics.position / (CARD_WIDTH + CARD_GAP)) % featuredCards.length;
        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex >= 0 ? newIndex : newIndex + featuredCards.length);
          if (isNative) hapticLight(); // Mobile haptic feedback
        }
        
        // Update DOM directly for smoothness
        if (carouselRef.current) {
          carouselRef.current.style.transform = `translateX(${physics.position}px)`;
        }
      
      // Continue animation
      addAnimation('hero3-physics', animatePhysics, 1);
    } else {
      // Stop animation when velocity is too low
      physics.velocity = 0;
      removeAnimation('hero3-physics');
    }
  }, [singleSetWidth, addAnimation, removeAnimation, currentIndex, hapticLight, featuredCards.length, isNative]);

  // Enhanced gesture recognition for smooth velocity calculation
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const physics = physicsRef.current;
    
    physics.isDragging = true;
    physics.dragStartX = e.clientX;
    physics.dragStartPosition = physics.position;
    physics.lastMoveX = e.clientX;
    physics.lastMoveTime = performance.now();
    physics.velocity = 0;
    physics.velocityHistory = [];
    
    setIsDragging(true);
    removeAnimation('hero3-physics');
    if (isNative) hapticSelection(); // Mobile haptic feedback on touch
  }, [removeAnimation, hapticSelection, isNative]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const physics = physicsRef.current;
    if (!physics.isDragging) return;
    
    e.preventDefault();
    const currentTime = performance.now();
    const deltaX = e.clientX - physics.dragStartX;
    const newPosition = physics.dragStartPosition + deltaX;
    
    // Calculate instantaneous velocity
    const timeDelta = currentTime - physics.lastMoveTime;
    if (timeDelta > 0) {
      const moveDelta = e.clientX - physics.lastMoveX;
      const instantVelocity = moveDelta / timeDelta * 16; // Normalize to 60fps
      
      // Keep velocity history for smooth release
      physics.velocityHistory.push(instantVelocity);
      if (physics.velocityHistory.length > MAX_VELOCITY_HISTORY) {
        physics.velocityHistory.shift();
      }
    }
    
    physics.position = newPosition;
    physics.lastMoveX = e.clientX;
    physics.lastMoveTime = currentTime;
    
    // Update DOM immediately
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(${newPosition}px)`;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    const physics = physicsRef.current;
    if (!physics.isDragging) return;

    physics.isDragging = false;
    setIsDragging(false);
    
    // Calculate release velocity from recent movements
    if (physics.velocityHistory.length > 0) {
      // Average recent velocities for smooth momentum
      const recentVelocities = physics.velocityHistory.slice(-3);
      const avgVelocity = recentVelocities.reduce((sum, v) => sum + v, 0) / recentVelocities.length;
      physics.velocity = avgVelocity * VELOCITY_SCALE;
      
      // Limit extreme velocities
      const maxVelocity = 25;
      physics.velocity = Math.max(-maxVelocity, Math.min(maxVelocity, physics.velocity));
      
      // Start momentum animation if there's velocity
      if (Math.abs(physics.velocity) > MIN_VELOCITY) {
        addAnimation('hero3-physics', animatePhysics, 1);
      }
    }
  }, [addAnimation, animatePhysics]);

  // Wheel handler for smooth scrolling
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const physics = physicsRef.current;
    
    if (!physics.isDragging) {
      // Add wheel velocity to existing momentum
      const wheelVelocity = -e.deltaY * 0.02;
      physics.velocity += wheelVelocity;
      
      // Limit velocity
      const maxVelocity = 20;
      physics.velocity = Math.max(-maxVelocity, Math.min(maxVelocity, physics.velocity));
      
      // Start animation if not already running
      if (Math.abs(physics.velocity) > MIN_VELOCITY) {
        addAnimation('hero3-physics', animatePhysics, 1);
      }
    }
  }, [addAnimation, animatePhysics]);

  // Navigation arrow handlers
  const handleLeftArrow = useCallback(() => {
    const physics = physicsRef.current;
    if (!physics.isDragging) {
      physics.velocity = 15; // Positive velocity moves right (reveals more left cards)
      addAnimation('hero3-physics', animatePhysics, 1);
    }
  }, [addAnimation, animatePhysics]);

  const handleRightArrow = useCallback(() => {
    const physics = physicsRef.current;
    if (!physics.isDragging) {
      physics.velocity = -15; // Negative velocity moves left (reveals more right cards)
      addAnimation('hero3-physics', animatePhysics, 1);
    }
  }, [addAnimation, animatePhysics]);

  // Global mouse events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Initial position setup
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.style.transform = `translateX(0px)`;
    }
  }, []);

  if (!showFeaturedCards || featuredCards.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden relative group" ref={containerRef}>
      <div 
        ref={carouselRef}
        className="flex gap-4 lg:gap-8 select-none will-change-transform"
        style={{ 
          touchAction: 'pan-x',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        tabIndex={0}
        role="region"
        aria-label="Featured cards carousel"
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Duplicate cards for seamless infinite scroll */}
        {[...featuredCards, ...featuredCards].map((card, index) => (
          <div 
            key={`${card.id}-${index}`}
            className="flex-shrink-0 w-32 h-44 sm:w-64 sm:h-[358px] md:w-96 md:h-[538px] lg:w-[512px] lg:h-[717px]"
            onPointerEnter={() => !isDragging && setHoveredCard(`${card.id}-${index}`)}
            onPointerLeave={() => setHoveredCard(null)}
            onFocus={() => setFocusedCard(`${card.id}-${index}`)}
            onBlur={() => setFocusedCard(null)}
            onClick={(e) => e.preventDefault()}
            style={{
              transform: !isDragging && hoveredCard === `${card.id}-${index}` 
                ? `scale(1.02) translateY(-2px)` 
                : !isDragging && focusedCard === `${card.id}-${index}`
                ? `scale(1.01) translateY(-1px)`
                : 'scale(1)',
              transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              transformStyle: 'preserve-3d'
            }}
          >
            <div 
              className="relative bg-crd-dark rounded-xl overflow-hidden border border-crd-mediumGray/20"
              style={{
                boxShadow: hoveredCard === `${card.id}-${index}`
                  ? `
                    0 20px 40px -12px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1)
                  `
                  : `
                    0 8px 20px -3px rgba(0, 0, 0, 0.15),
                    0 4px 6px -2px rgba(0, 0, 0, 0.1)
                  `,
                transition: 'box-shadow 0.25s ease-out'
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
                        ? `scale(1.03)` 
                        : 'scale(1)',
                      transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      filter: !isDragging && hoveredCard === `${card.id}-${index}` 
                        ? 'brightness(1.03) contrast(1.01) saturate(1.02)' 
                        : 'brightness(1)',
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
                
                {/* Enhanced Overlay */}
                {hoveredCard === `${card.id}-${index}` && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
                    style={{
                      opacity: hoveredCard === `${card.id}-${index}` ? 1 : 0,
                      transition: 'opacity 0.25s ease-out'
                    }}
                  >
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-crd-lightGray">Creator: {card.creator_name || 'Unknown'}</p>
                        </div>
                        <div className="text-right">
                          {card.rarity && (
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
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
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Camouflaged Glass Navigation Arrows */}
      <button
        onClick={handleLeftArrow}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full 
                   opacity-30 group-hover:opacity-70 hover:!opacity-100
                   bg-black/20 backdrop-blur-md border border-white/15
                   flex items-center justify-center text-white
                   transition-all duration-500 ease-out
                   hover:bg-black/30 hover:backdrop-blur-lg hover:border-white/25
                   hover:scale-110 hover:shadow-lg hover:shadow-black/20
                   z-10"
        aria-label="Previous cards"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={handleRightArrow}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full 
                   opacity-30 group-hover:opacity-70 hover:!opacity-100
                   bg-black/20 backdrop-blur-md border border-white/15
                   flex items-center justify-center text-white
                   transition-all duration-500 ease-out
                   hover:bg-black/30 hover:backdrop-blur-lg hover:border-white/25
                   hover:scale-110 hover:shadow-lg hover:shadow-black/20
                   z-10"
        aria-label="Next cards"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};
