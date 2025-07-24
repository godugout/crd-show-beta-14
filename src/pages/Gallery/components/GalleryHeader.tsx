
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter } from 'lucide-react';

interface GalleryHeaderProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="mb-6 sm:mb-10">
      <h1 className="text-2xl sm:text-4xl font-bold text-themed-primary mb-6 sm:mb-8">
        Discover <span className="highlight-themed font-extrabold">Cards & Collectibles</span>
      </h1>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
            <div className="tabs-themed w-full sm:w-auto">
              <div className="flex flex-wrap gap-2 sm:gap-0">
                <button 
                  onClick={() => onTabChange('featured')}
                  className={`px-4 sm:px-6 py-3 rounded-md transition-all duration-200 min-h-[44px] flex-1 sm:flex-none ${
                    activeTab === 'featured' ? 'tab-themed-active' : 'tab-themed-inactive'
                  }`}
                >
                  Featured
                </button>
                <button 
                  onClick={() => onTabChange('trending')}
                  className={`px-4 sm:px-6 py-3 rounded-md transition-all duration-200 min-h-[44px] flex-1 sm:flex-none ${
                    activeTab === 'trending' ? 'tab-themed-active' : 'tab-themed-inactive'
                  }`}
                >
                  Trending
                </button>
                <button 
                  onClick={() => onTabChange('new')}
                  className={`px-4 sm:px-6 py-3 rounded-md transition-all duration-200 min-h-[44px] flex-1 sm:flex-none ${
                    activeTab === 'new' ? 'tab-themed-active' : 'tab-themed-inactive'
                  }`}
                >
                  New
                </button>
              </div>
            </div>
            
            <button className="btn-themed-primary flex items-center gap-2 px-4 sm:px-6 py-3 rounded-md min-h-[44px] w-full sm:w-auto justify-center">
              <Filter size={16} />
              Filter
              <span className="ml-1 bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">×</span>
            </button>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
