import React from 'react';
import { Lock, Unlock, Star, Zap, Crown, Award } from 'lucide-react';
import { type CRDVisualStyle } from './StyleRegistry';

interface StyleTileProps {
  style: CRDVisualStyle;
  isSelected: boolean;
  onSelect: (styleId: string) => void;
  onUnlock: (styleId: string) => void;
}

export const StyleTile: React.FC<StyleTileProps> = ({
  style,
  isSelected,
  onSelect,
  onUnlock
}) => {
  const handleClick = () => {
    if (style.locked) {
      onUnlock(style.id);
    } else {
      onSelect(style.id);
    }
  };

  const getCategoryIcon = () => {
    switch (style.category) {
      case 'premium':
        return <Crown className="w-3 h-3 text-yellow-400" />;
      case 'signature':
        return <Star className="w-3 h-3 text-purple-400" />;
      case 'effect':
        return <Zap className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const getUnlockCostDisplay = () => {
    if (!style.locked || !style.unlockCost) return null;
    
    switch (style.unlockMethod) {
      case 'points':
        return `${style.unlockCost} CRD`;
      case 'premium':
        return 'Premium';
      case 'achievement':
        return 'Achievement';
      default:
        return null;
    }
  };

  return (
    <div 
      className={`
        relative group cursor-pointer rounded-lg overflow-hidden transition-all duration-200
        ${isSelected 
          ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' 
          : 'hover:scale-102'
        }
        ${style.locked ? 'opacity-60' : ''}
      `}
      onClick={handleClick}
    >
      {/* Preview Background */}
      <div 
        className="aspect-[3/4] w-full"
        style={{ 
          background: style.uiPreviewGradient,
          backgroundSize: '200% 200%',
          animation: style.animationProfile ? 'gradient-shift 3s ease-in-out infinite' : 'none'
        }}
      >
        {/* Category Badge */}
        <div className="absolute top-2 left-2 flex items-center gap-1">
          {getCategoryIcon()}
        </div>

        {/* Lock/Unlock Status */}
        <div className="absolute top-2 right-2">
          {style.locked ? (
            <div className="flex items-center gap-1 bg-black/50 rounded-md px-2 py-1">
              <Lock className="w-3 h-3 text-white" />
              <span className="text-xs text-white font-medium">
                {getUnlockCostDisplay()}
              </span>
            </div>
          ) : (
            <div className="bg-green-500/20 rounded-full p-1">
              <Unlock className="w-3 h-3 text-green-400" />
            </div>
          )}
        </div>

        {/* Performance Indicator */}
        <div className="absolute bottom-2 left-2">
          <div className={`
            w-2 h-2 rounded-full
            ${style.performance.renderCost === 'low' ? 'bg-green-400' : 
              style.performance.renderCost === 'medium' ? 'bg-yellow-400' : 'bg-red-400'}
          `} />
        </div>

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-lg" />
        )}
      </div>

      {/* Style Info */}
      <div className="p-2 bg-card border-t">
        <h4 className="font-medium text-sm text-foreground truncate">
          {style.displayName}
        </h4>
        <p className="text-xs text-muted-foreground truncate mt-1">
          {style.visualVibe}
        </p>
      </div>

      {/* Hover Overlay */}
      {!style.locked && (
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg" />
      )}
    </div>
  );
};

interface StyleSelectorProps {
  selectedStyleId: string;
  onStyleChange: (styleId: string) => void;
  showLockedStyles?: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyleId,
  onStyleChange,
  showLockedStyles = true
}) => {
  const [styles, setStyles] = React.useState<CRDVisualStyle[]>([]);
  const [filter, setFilter] = React.useState<'all' | 'unlocked' | 'premium'>('all');

  React.useEffect(() => {
    // Load styles from registry
    import('./StyleRegistry').then(({ StyleRegistry, CRDVisualStyles }) => {
      const registry = StyleRegistry.getInstance();
      setStyles(CRDVisualStyles);
    });
  }, []);

  const handleStyleSelect = (styleId: string) => {
    // Update registry and notify parent
    import('./StyleRegistry').then(({ StyleRegistry }) => {
      const registry = StyleRegistry.getInstance();
      if (registry.setActiveStyle(styleId)) {
        onStyleChange(styleId);
      }
    });
  };

  const handleStyleUnlock = (styleId: string) => {
    // Implement unlock flow
    console.log('Unlock style:', styleId);
    // This would trigger the unlock modal/flow
  };

  const filteredStyles = styles.filter(style => {
    if (filter === 'unlocked') return !style.locked;
    if (filter === 'premium') return style.category === 'premium';
    if (!showLockedStyles) return !style.locked;
    return true;
  });

  const groupedStyles = filteredStyles.reduce((acc, style) => {
    if (!acc[style.category]) acc[style.category] = [];
    acc[style.category].push(style);
    return acc;
  }, {} as Record<string, CRDVisualStyle[]>);

  return (
    <div className="space-y-4">
      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border">
        {(['all', 'unlocked', 'premium'] as const).map(filterType => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`
              px-3 py-2 text-sm font-medium transition-colors
              ${filter === filterType 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-muted-foreground hover:text-foreground'
              }
            `}
          >
            {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
          </button>
        ))}
      </div>

      {/* Style Grid by Category */}
      <div className="space-y-6">
        {Object.entries(groupedStyles).map(([category, categoryStyles]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-foreground mb-3 capitalize flex items-center gap-2">
              {category === 'premium' && <Crown className="w-4 h-4 text-yellow-400" />}
              {category === 'signature' && <Star className="w-4 h-4 text-purple-400" />}
              {category === 'effect' && <Zap className="w-4 h-4 text-blue-400" />}
              {category === 'material' && <Award className="w-4 h-4 text-green-400" />}
              {category} Styles
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {categoryStyles.map(style => (
                <StyleTile
                  key={style.id}
                  style={style}
                  isSelected={selectedStyleId === style.id}
                  onSelect={handleStyleSelect}
                  onUnlock={handleStyleUnlock}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};