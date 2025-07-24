import React from 'react';
import { ChevronLeft, ChevronRight, Crown } from 'lucide-react';
import { TradingCard } from './TradingCard';

interface FeaturedCarouselProps {
  featuredCards: Array<{
    id: string;
    title: string;
    imageUrl?: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    creator: {
      name: string;
      avatar?: string;
    };
    favorites: number;
    views: number;
  }>;
  onCardClick: (cardId: string) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  featuredCards,
  onCardClick
}) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(1, featuredCards.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(1, featuredCards.length - 2)) % Math.max(1, featuredCards.length - 2));
  };

  if (!featuredCards.length) return null;

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-crd-yellow" />
          <h2 className="font-dm-sans text-section font-bold text-crd-text">
            Featured Cards
          </h2>
        </div>
        
        {/* Navigation */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={prevSlide}
            className="p-2 bg-crd-surface border border-crd-border rounded-lg hover:bg-crd-surface-light
                     transition-colors duration-200 text-crd-text"
            disabled={featuredCards.length <= 3}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 bg-crd-surface border border-crd-border rounded-lg hover:bg-crd-surface-light
                     transition-colors duration-200 text-crd-text"
            disabled={featuredCards.length <= 3}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-6"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            width: `${Math.max(100, (featuredCards.length / 3) * 100)}%`
          }}
        >
          {featuredCards.map((card) => (
            <div 
              key={card.id} 
              className="flex-shrink-0"
              style={{ width: `${100 / featuredCards.length}%`, minWidth: '280px' }}
            >
              <TradingCard
                {...card}
                onClick={() => onCardClick(card.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Dots Indicator */}
      {featuredCards.length > 3 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.max(1, featuredCards.length - 2) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-crd-orange' : 'bg-crd-border'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};