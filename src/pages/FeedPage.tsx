
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FeedPage = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-crd-white mb-2">Community Feed</h1>
          <p className="text-crd-lightGray">Discover the latest cards from the community</p>
        </div>

        {/* Content */}
        <Card className="bg-crd-darker border-crd-mediumGray/20">
          <CardHeader>
            <CardTitle className="text-crd-white">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-crd-lightGray">
              The community feed is under development. Check back soon to see the latest cards from other creators!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FeedPage;
