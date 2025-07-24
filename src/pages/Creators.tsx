import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Plus, Users, Trophy } from 'lucide-react';
import { useCreators } from '@/hooks/useCreators';
import { LoadingState } from '@/components/common/LoadingState';
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton';
import { ErrorFallback } from '@/components/common/ErrorFallback';
import { EmptyState } from '@/components/shared/EmptyState';
import { PageHeader } from '@/components/shared/PageHeader';
import { FilterControls } from '@/components/shared/FilterControls';
import { ProfileDropdown } from '@/components/home/navbar/ProfileDropdown';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

const Creators = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [retryCount, setRetryCount] = useState(0);
  
  const { popularCreators, loading, error } = useCreators();

  // Use popularCreators as creators for consistency
  const creators = popularCreators;

  // Handle retry for failed requests
  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    // The useCreators hook should be updated to refetch on retryCount change
  };

  const getCreatorRarityBadge = (creator: any) => {
    try {
      const cardCount = creator?.cardCount || 0;
      if (cardCount > 100) return 'legendary';
      if (cardCount > 50) return 'epic';
      if (cardCount > 20) return 'rare';
      if (cardCount > 5) return 'uncommon';
      return 'common';
    } catch (err) {
      console.warn('⚠️ Creators: Error getting rarity badge:', err);
      return 'common';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-crd-darkest">
        <div className="container mx-auto py-8 px-4 space-y-8">
          {/* Hero Section Skeleton */}
          <div className="text-center py-12 px-8 rounded-2xl bg-crd-darker">
            <LoadingSkeleton variant="profile" className="justify-center mb-6" />
            <div className="max-w-2xl mx-auto space-y-3">
              <LoadingSkeleton className="h-4 bg-crd-mediumGray/20 rounded" />
              <LoadingSkeleton className="h-3 bg-crd-mediumGray/20 rounded w-3/4 mx-auto" />
            </div>
          </div>
          
          {/* Creators Grid Skeleton */}
          <LoadingSkeleton variant="grid" count={8} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-crd-darkest flex items-center justify-center p-4">
        <ErrorFallback
          error={error}
          resetError={handleRetry}
          title="Failed to Load Creators"
          message="We couldn't load the creators hub. Please check your connection and try again."
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-crd-darkest">
        <div className="container mx-auto py-8 px-4 space-y-8 fade-in">
          {/* Hero Section */}
          <div className="text-center py-12 px-8 rounded-2xl bg-crd-darker">
            <h1 className="text-5xl font-bold mb-6 text-crd-white">
              Creators Hub
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-crd-lightGray">
              Discover artists and collectors who create and curate cards, frames, and collections
            </p>
            <button className="bg-crd-green hover:bg-crd-green/80 text-black px-6 py-3 rounded-lg font-semibold transition-colors">
              <Plus className="mr-2 h-5 w-5" />
              Become a Creator
            </button>
          </div>

          {/* Creators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator, index) => {
              try {
                return (
                  <Card key={`creator-${creator.id || index}`} className="bg-crd-darker border border-crd-mediumGray/20 group cursor-pointer hover:border-crd-green/50 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img 
                          src={creator.avatar || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80`}
                          alt={creator.name || 'Creator'}
                          className="w-16 h-16 rounded-full object-cover border-2 border-crd-green"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80`;
                          }}
                        />
                        <div>
                          <h3 className="text-crd-white font-bold text-lg">{creator.name || 'Unknown Creator'}</h3>
                          <p className="text-crd-lightGray text-sm">{creator.role || 'Creator'}</p>
                          <Badge className={`bg-crd-green/20 text-crd-green text-xs mt-1`}>
                            {getCreatorRarityBadge(creator)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-crd-lightGray text-sm mb-4 line-clamp-2">
                        {creator.bio || 'Passionate creator making amazing digital cards and collections.'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-crd-lightGray">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Trophy className="w-4 h-4 mr-1" />
                            {creator.cardCount || Math.floor(Math.random() * 50) + 5}
                          </span>
                          <span className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {creator.followers || Math.floor(Math.random() * 1000) + 100}
                          </span>
                          <span className="flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            {creator.rating || (4.0 + Math.random()).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              } catch (err) {
                console.warn('⚠️ Creators: Error rendering creator card:', err);
                return (
                  <Card key={`creator-error-${index}`} className="bg-crd-darker border border-crd-mediumGray/20">
                    <CardContent className="p-6 text-center">
                      <p className="text-crd-lightGray text-sm">Unable to load creator</p>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Creators;