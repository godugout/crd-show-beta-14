import React from 'react';
import { cn } from '@/lib/utils';
import { CRDCard } from '@/components/ui/design-system/Card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Typography } from '@/components/ui/design-system/Typography';

interface AuctionCardProps {
  title: string;
  currentBid: number;
  timeLeft: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  imageUrl: string;
  className?: string;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({
  title,
  currentBid,
  timeLeft,
  imageUrl,
  className
}) => {
  return (
    <CRDCard 
      variant="interactive" 
      padding="default"
      className={cn("w-full max-w-[352px] text-center", className)}
    >
      {/* Featured Image */}
      <div className="aspect-[0.8] w-full mb-6 overflow-hidden rounded-lg">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title */}
      <Typography variant="component" className="mb-4">
        {title}
      </Typography>

      {/* Current Bid */}
      <div className="mb-6">
        <Typography variant="caption" className="text-crd-lightGray uppercase mb-1">
          Current Bid
        </Typography>
        <Typography variant="section" className="text-crd-green">
          ${currentBid.toLocaleString()}
        </Typography>
      </div>

      {/* Timer */}
      <div className="flex justify-between gap-4 mb-8">
        <div className="w-16 text-center">
          <Typography variant="section" className="leading-none">
            {String(timeLeft.hours).padStart(2, '0')}
          </Typography>
          <Typography variant="body" className="text-crd-lightGray">
            Hours
          </Typography>
        </div>
        <div className="w-16 text-center">
          <Typography variant="section" className="leading-none">
            {String(timeLeft.minutes).padStart(2, '0')}
          </Typography>
          <Typography variant="body" className="text-crd-lightGray">
            Minutes
          </Typography>
        </div>
        <div className="w-16 text-center">
          <Typography variant="section" className="leading-none">
            {String(timeLeft.seconds).padStart(2, '0')}
          </Typography>
          <Typography variant="body" className="text-crd-lightGray">
            Seconds
          </Typography>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <CRDButton variant="primary" size="lg" className="flex-1">
          Place Bid
        </CRDButton>
        <CRDButton variant="outline" size="lg" className="flex-1">
          View
        </CRDButton>
      </div>
    </CRDCard>
  );
};