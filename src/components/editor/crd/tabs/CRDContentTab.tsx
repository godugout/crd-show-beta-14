import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Type, Image, Star, Layers } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDContentTabProps {
  cardTitle: string;
  onCardTitleChange: (title: string) => void;
  cardDescription: string;
  onCardDescriptionChange: (description: string) => void;
  playerImage: string | null;
  onPlayerImageChange: (image: string) => void;
  playerStats: Record<string, string>;
  onPlayerStatsChange: (stats: Record<string, string>) => void;
}

const DEFAULT_STATS = {
  'Position': '',
  'Team': '',
  'Number': '',
  'Season': '2024',
  'Games': '',
  'Average': ''
};

export const CRDContentTab: React.FC<CRDContentTabProps> = ({
  cardTitle,
  onCardTitleChange,
  cardDescription,
  onCardDescriptionChange,
  playerImage,
  onPlayerImageChange,
  playerStats,
  onPlayerStatsChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onPlayerImageChange(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateStat = (key: string, value: string) => {
    onPlayerStatsChange({ ...playerStats, [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Card Information */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Type className="w-4 h-4" />
            Card Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <label className="text-xs text-crd-lightGray block mb-1">Card Title</label>
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => onCardTitleChange(e.target.value)}
              placeholder="Player Name or Card Title"
              className="w-full bg-crd-darkest border border-crd-mediumGray/20 rounded px-3 py-2 text-sm text-crd-white placeholder:text-crd-lightGray/50 focus:border-crd-blue focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-crd-lightGray block mb-1">Description</label>
            <textarea
              value={cardDescription}
              onChange={(e) => onCardDescriptionChange(e.target.value)}
              placeholder="Card description or player biography"
              rows={3}
              className="w-full bg-crd-darkest border border-crd-mediumGray/20 rounded px-3 py-2 text-sm text-crd-white placeholder:text-crd-lightGray/50 focus:border-crd-blue focus:outline-none resize-none"
            />
          </div>
        </CardContent>
      </Card>


      {/* Player Stats */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Star className="w-4 h-4" />
            Player Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries({ ...DEFAULT_STATS, ...playerStats }).map(([key, value]) => (
              <div key={key}>
                <label className="text-xs text-crd-lightGray block mb-1">{key}</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateStat(key, e.target.value)}
                  placeholder={`Enter ${key.toLowerCase()}`}
                  className="w-full bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1 text-sm text-crd-white placeholder:text-crd-lightGray/50 focus:border-crd-blue focus:outline-none"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Asset Library */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Asset Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <CRDButton variant="outline" size="sm" className="text-xs">
              Team Logos
            </CRDButton>
            <CRDButton variant="outline" size="sm" className="text-xs">
              Sports Icons
            </CRDButton>
            <CRDButton variant="outline" size="sm" className="text-xs">
              Decorative
            </CRDButton>
            <CRDButton variant="outline" size="sm" className="text-xs">
              Upload Asset
            </CRDButton>
          </div>
          <p className="text-xs text-crd-lightGray/70">
            Add logos, icons, and decorative elements to enhance your card design.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};