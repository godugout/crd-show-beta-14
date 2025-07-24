import React from 'react';
import { Eye, Image } from 'lucide-react';

interface CollectionStatsProps {
  cardCount: number;
  viewCount: number;
  className?: string;
}

export const CollectionStats: React.FC<CollectionStatsProps> = ({ 
  cardCount, 
  viewCount, 
  className = '' 
}) => {
  return (
    <div className={`flex items-center gap-4 text-xs text-crd-lightGray ${className}`}>
      <div className="flex items-center gap-1">
        <Image className="h-3 w-3" />
        <span>{cardCount} cards</span>
      </div>
      <div className="flex items-center gap-1">
        <Eye className="h-3 w-3" />
        <span>{viewCount} views</span>
      </div>
    </div>
  );
};