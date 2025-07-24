
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Star, TrendingUp, Clock } from 'lucide-react';
import { Typography, CRDButton } from '@/components/ui/design-system';
import { ThemedPage } from '@/components/ui/design-system/ThemedLayout';
import { StandardHero } from '@/components/shared/StandardHero';
import { PixelDigital } from '@/components/ui/PixelDigital';

const Collections: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Hero Section */}
      <StandardHero
        label="DISCOVER, COLLECT & CONNECT"
        title={
          <>
            <span className="font-light">Your gateway to the</span><br />
            <span className="gradient-text-green-blue-purple whitespace-nowrap">
              world of <PixelDigital className="animate-pulse">digital</PixelDigital> cards
            </span>
          </>
        }
        description="Explore thousands of unique cards, build your personal collections, and connect with creators and collectors worldwide."
        primaryCta={{
          text: "Explore Gallery",
          link: "/collections/gallery"
        }}
        secondaryCta={{
          text: "Create Collection",
          link: "/collections/create"
        }}
        fullWidth={true}
        heroVariant="hero"
      />

      {/* Gallery Preview Section */}
      <section className="mb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Typography variant="h2" className="text-crd-white mb-2">
              Featured CRDs
            </Typography>
            <Typography variant="body" className="text-crd-lightGray">
              Discover the most popular cards in our gallery
            </Typography>
          </div>
          <Link to="/collections/gallery">
            <CRDButton variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </CRDButton>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
            <div key={card} className="mobile-card bg-crd-darker p-4">
              <div className="aspect-[3/4] bg-gradient-to-br from-crd-blue/20 to-crd-purple/20 rounded-lg mb-3 flex items-center justify-center">
                <Typography variant="small-body" className="text-crd-lightGray">
                  Card {card}
                </Typography>
              </div>
              <Typography variant="small-body" className="text-crd-white font-medium">
                Featured Card {card}
              </Typography>
              <Typography variant="caption" className="text-crd-lightGray">
                By Creator {card}
              </Typography>
            </div>
          ))}
        </div>
      </section>

      {/* Your Collections Section */}
      <section className="mb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Typography variant="h2" className="text-crd-white mb-2">
              Your Collections
            </Typography>
            <Typography variant="body" className="text-crd-lightGray">
              Manage and organize your personal card collections
            </Typography>
          </div>
          <CRDButton variant="outline">
            Manage All
          </CRDButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((collection) => (
            <div key={collection} className="mobile-card bg-crd-darker p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-crd-green/20 to-crd-blue/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-crd-green" />
                </div>
                <div>
                  <Typography variant="body" className="text-crd-white font-medium">
                    My Collection {collection}
                  </Typography>
                  <Typography variant="small-body" className="text-crd-lightGray">
                    24 cards
                  </Typography>
                </div>
              </div>
              <Typography variant="small-body" className="text-crd-lightGray mb-4">
                A curated collection of my favorite cards from various creators.
              </Typography>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-crd-orange" />
                <Typography variant="caption" className="text-crd-lightGray">
                  12 followers
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Collections Section */}
      <section className="mb-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Typography variant="h2" className="text-crd-white mb-2">
              Trending Collections
            </Typography>
            <Typography variant="body" className="text-crd-lightGray">
              Popular collections from the community
            </Typography>
          </div>
          <CRDButton variant="outline">
            View All
          </CRDButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((collection) => (
            <div key={collection} className="mobile-card bg-crd-darker p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-crd-purple/20 to-crd-orange/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-crd-purple" />
                </div>
                <div>
                  <Typography variant="body" className="text-crd-white font-medium">
                    Trending Collection {collection}
                  </Typography>
                  <Typography variant="small-body" className="text-crd-lightGray">
                    By @creator{collection}
                  </Typography>
                </div>
              </div>
              <Typography variant="small-body" className="text-crd-lightGray mb-4">
                Hot collection featuring the latest cards from emerging artists.
              </Typography>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-crd-orange" />
                  <Typography variant="caption" className="text-crd-lightGray">
                    {150 + collection * 23} followers
                  </Typography>
                </div>
                <Typography variant="caption" className="text-crd-green">
                  +{collection * 12}% this week
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Community Activity Section */}
      <section className="mb-16 px-4 sm:px-6 lg:px-8">
        <Typography variant="h2" className="text-crd-white mb-8">
          Community Activity
        </Typography>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((activity) => (
            <div key={activity} className="mobile-card bg-crd-darker p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-crd-blue/20 to-crd-green/20 rounded-full flex items-center justify-center">
                  <Clock className="h-5 w-5 text-crd-blue" />
                </div>
                <div className="flex-1">
                  <Typography variant="small-body" className="text-crd-white">
                    <span className="text-crd-blue">@creator{activity}</span> added 3 new cards to <span className="text-crd-green">"Best of 2024"</span>
                  </Typography>
                  <Typography variant="caption" className="text-crd-lightGray">
                    {activity} hours ago
                  </Typography>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Collections;
