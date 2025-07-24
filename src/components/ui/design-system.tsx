import React from 'react';

// Re-export all design system components
export { CRDButton } from './design-system/Button';
export { CRDBadge } from './design-system/Badge';
export { Typography, Heading, AccentText } from './design-system/Typography';

// Additional components and placeholders
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { Typography } from './design-system/Typography';
import { CRDButton } from './design-system/Button';

export interface CRDCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CRDCard = React.forwardRef<HTMLDivElement, CRDCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Card 
        ref={ref}
        className={cn("bg-crd-darkGray border-crd-mediumGray", className)}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

CRDCard.displayName = "CRDCard";

// CRD Input Component
export interface CRDInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: string; // Add variant prop to match existing usage
}

export const CRDInput = React.forwardRef<HTMLInputElement, CRDInputProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Input 
        ref={ref}
        className={cn("bg-crd-darkGray border-crd-mediumGray text-crd-white", className)}
        {...props}
      />
    );
  }
);

CRDInput.displayName = "CRDInput";

// Re-export components from their own files to fix import issues
export { Hero3 } from './design-system/Hero3';
export type { Hero3Props } from './design-system/Hero3';
export { FilterButton } from './design-system/FilterButton';
export type { FilterButtonProps } from './design-system/FilterButton';



// Effect Card Component - Enhanced to match existing usage
export interface EffectCardProps {
  title: string;
  description?: string;
  active?: boolean;
  isActive?: boolean; // Add isActive as alias
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  variant?: string;
  emoji?: string;
  intensity?: number;
}

export const EffectCard: React.FC<EffectCardProps> = ({
  title,
  description,
  active,
  isActive,
  onClick,
  className,
  children,
  variant,
  emoji,
  intensity,
  ...props
}) => {
  const isCardActive = active || isActive;
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-lg",
        isCardActive && "border-crd-blue bg-crd-blue/10",
        className
      )}
      onClick={onClick}
      {...props}
    >
      <div className="flex items-center gap-2 mb-2">
        {emoji && <span className="text-lg">{emoji}</span>}
        <h3 className="font-semibold text-crd-white">{title}</h3>
        {intensity !== undefined && (
          <span className="text-xs text-crd-lightGray ml-auto">
            {intensity}%
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-crd-lightGray">{description}</p>
      )}
      {children}
    </Card>
  );
};

// Preset Card Component - Enhanced to match existing usage
export interface PresetCardProps {
  title: string;
  preview?: React.ReactNode;
  onClick?: () => void;
  onSelect?: () => void; // Add onSelect as alias
  className?: string;
  emoji?: string;
  isSelected?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  size?: string;
  styleColor?: any;
}

export const PresetCard: React.FC<PresetCardProps> = ({
  title,
  preview,
  onClick,
  onSelect,
  className,
  emoji,
  isSelected,
  isLoading,
  isDisabled,
  size,
  styleColor,
  ...props
}) => {
  const handleClick = onClick || onSelect;
  
  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all hover:shadow-lg hover:border-crd-blue",
        isSelected && "border-crd-blue bg-crd-blue/10",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={isDisabled ? undefined : handleClick}
      {...props}
    >
      <div className="space-y-2">
        {preview}
        <div className="flex items-center gap-2">
          {emoji && <span className="text-lg">{emoji}</span>}
          <h3 className="text-sm font-semibold text-crd-white">{title}</h3>
          {isLoading && (
            <span className="ml-auto text-xs text-crd-lightGray">Loading...</span>
          )}
        </div>
      </div>
    </Card>
  );
};

// Collapsible Section Component - Enhanced to match existing usage
export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  emoji?: string;
  icon?: React.ComponentType<any>;
  statusText?: string;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
  emoji,
  icon: Icon,
  statusText,
  isOpen: controlledOpen,
  onToggle,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const handleToggle = () => {
    if (isControlled) {
      onToggle?.(!open);
    } else {
      setInternalOpen(!open);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={handleToggle} className={className} {...props}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-4 h-auto text-left"
        >
          <div className="flex items-center gap-2">
            {emoji && <span className="text-lg">{emoji}</span>}
            {Icon && <Icon className="w-4 h-4" />}
            <span className="font-semibold text-crd-white">{title}</span>
            {statusText && (
              <span className="text-xs text-crd-lightGray ml-2">{statusText}</span>
            )}
          </div>
          <span className={cn("transition-transform", open && "rotate-180")}>
            ▼
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
};

// Team Theme Showcase Component
export interface TeamThemeShowcaseProps {
  theme: any;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const TeamThemeShowcase: React.FC<TeamThemeShowcaseProps> = ({
  theme,
  isSelected = false,
  onSelect
}) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border-2 cursor-pointer transition-all",
        isSelected ? "border-crd-blue" : "border-crd-mediumGray hover:border-crd-lightGray"
      )}
      onClick={onSelect}
    >
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-crd-white">{theme.name}</h3>
        <div className="flex space-x-1">
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: theme.primary }}
          />
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: theme.secondary }}
          />
          <div 
            className="w-4 h-4 rounded" 
            style={{ backgroundColor: theme.accent }}
          />
        </div>
      </div>
    </div>
  );
};

// Palette Preview Component
export interface PalettePreviewProps {
  colors: string[];
  title?: string;
}

export const PalettePreview: React.FC<PalettePreviewProps> = ({
  colors,
  title
}) => {
  return (
    <div className="space-y-2">
      {title && <h4 className="text-xs font-medium text-crd-lightGray">{title}</h4>}
      <div className="flex space-x-1">
        {colors.map((color, index) => (
          <div
            key={index}
            className="w-8 h-8 rounded border border-crd-mediumGray"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};