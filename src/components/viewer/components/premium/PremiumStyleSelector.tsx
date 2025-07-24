import React, { useState } from 'react';
import { Lock, Unlock, Crown, Gem, Zap, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePremiumVisualStyles } from '@/hooks/usePremiumVisualStyles';
import type { CRDVisualStyle, VisualStyleCategory, UnlockMethod } from '@/types/premiumVisualStyles';

interface PremiumStyleSelectorProps {
  selectedStyleId?: string;
  onStyleSelect: (styleId: string) => void;
  onStyleUnlock?: (styleId: string) => void;
  className?: string;
}

const getCategoryIcon = (category: VisualStyleCategory) => {
  switch (category) {
    case 'premium': return Crown;
    case 'specialty': return Gem;
    case 'metallic': return Zap;
    case 'atmospheric': return Star;
    default: return Star;
  }
};

const getUnlockMethodBadge = (method: UnlockMethod, cost: number) => {
  switch (method) {
    case 'free':
      return <Badge variant="secondary" className="text-xs">Free</Badge>;
    case 'subscription':
      return <Badge variant="default" className="text-xs bg-crd-orange">Premium</Badge>;
    case 'points':
      return <Badge variant="outline" className="text-xs">{cost} pts</Badge>;
    case 'marketplace':
      return <Badge variant="outline" className="text-xs border-crd-green text-crd-green">Market</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">Unlock</Badge>;
  }
};

export const PremiumStyleSelector: React.FC<PremiumStyleSelectorProps> = ({
  selectedStyleId,
  onStyleSelect,
  onStyleUnlock,
  className
}) => {
  const { 
    styles, 
    availableStyles, 
    lockedStyles, 
    isStyleUnlocked, 
    unlockStyle, 
    loading 
  } = usePremiumVisualStyles();

  const [unlockingStyles, setUnlockingStyles] = useState<Set<string>>(new Set());

  const handleStyleClick = (style: CRDVisualStyle) => {
    if (isStyleUnlocked(style.id)) {
      onStyleSelect(style.id);
    }
  };

  const handleUnlockClick = async (style: CRDVisualStyle, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!onStyleUnlock) return;
    
    setUnlockingStyles(prev => new Set(prev).add(style.id));
    
    try {
      // For now, just call the callback - implement actual unlock logic
      onStyleUnlock(style.id);
      
      // In a real implementation, this would trigger payment flow, point deduction, etc.
      // await unlockStyle(style.id, style.unlockMethod);
    } finally {
      setUnlockingStyles(prev => {
        const newSet = new Set(prev);
        newSet.delete(style.id);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-crd-mediumGray/20 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const sortedStyles = [...availableStyles, ...lockedStyles];

  return (
    <div className={cn("space-y-3", className)}>
      {/* Available Styles */}
      {availableStyles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-crd-lightGray">Available Styles</h4>
          {availableStyles.map((style) => {
            const IconComponent = getCategoryIcon(style.category);
            const isSelected = selectedStyleId === style.id;
            
            return (
              <div
                key={style.id}
                onClick={() => handleStyleClick(style)}
                className={cn(
                  "relative p-4 rounded-lg border cursor-pointer transition-all group",
                  "hover:border-crd-blue/50 hover:bg-crd-dark/30",
                  isSelected 
                    ? "border-crd-blue bg-crd-blue/10" 
                    : "border-crd-mediumGray/30 bg-crd-darkGray/20"
                )}
                style={{
                  background: `linear-gradient(135deg, ${style.uiPreviewGradient}), var(--crd-darkGray)`
                }}
              >
                {/* Style preview gradient overlay */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-20"
                  style={{ background: style.uiPreviewGradient }}
                />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-black/40 rounded-lg">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h5 className="font-medium text-white">{style.displayName}</h5>
                      <p className="text-xs text-crd-lightGray/80">{style.visualVibe}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getUnlockMethodBadge(style.unlockMethod, style.unlockCost)}
                    <Unlock className="w-4 h-4 text-crd-green" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Locked Styles */}
      {lockedStyles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-crd-lightGray">Premium Styles</h4>
          {lockedStyles.map((style) => {
            const IconComponent = getCategoryIcon(style.category);
            const isUnlocking = unlockingStyles.has(style.id);
            
            return (
              <div
                key={style.id}
                className={cn(
                  "relative p-4 rounded-lg border transition-all group",
                  "border-crd-mediumGray/20 bg-crd-darkGray/10",
                  "hover:border-crd-orange/30"
                )}
              >
                {/* Locked overlay */}
                <div className="absolute inset-0 bg-black/60 rounded-lg" />
                
                {/* Style preview gradient (dimmed) */}
                <div 
                  className="absolute inset-0 rounded-lg opacity-10"
                  style={{ background: style.uiPreviewGradient }}
                />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-black/60 rounded-lg">
                      <IconComponent className="w-4 h-4 text-crd-lightGray/60" />
                    </div>
                    <div>
                      <h5 className="font-medium text-crd-lightGray/80">{style.displayName}</h5>
                      <p className="text-xs text-crd-lightGray/50">{style.visualVibe}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getUnlockMethodBadge(style.unlockMethod, style.unlockCost)}
                    
                    {onStyleUnlock && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleUnlockClick(style, e)}
                        disabled={isUnlocking}
                        className="border-crd-orange text-crd-orange hover:bg-crd-orange hover:text-white"
                      >
                        {isUnlocking ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Lock className="w-3 h-3 mr-1" />
                            Unlock
                          </>
                        )}
                      </Button>
                    )}
                    
                    {!onStyleUnlock && <Lock className="w-4 h-4 text-crd-lightGray/40" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {styles.length === 0 && !loading && (
        <div className="text-center py-8 text-crd-lightGray/60">
          <Gem className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No visual styles available</p>
        </div>
      )}
    </div>
  );
};