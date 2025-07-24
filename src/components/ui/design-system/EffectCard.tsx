
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const effectCardVariants = cva(
  "p-4 rounded-lg border transition-all duration-200",
  {
    variants: {
      variant: {
        default: "border-editor-border bg-editor-tool hover:border-crd-green/50 hover:bg-editor-tool/80",
        active: "border-crd-green bg-crd-green/10 shadow-sm",
        compact: "p-3 border-editor-border bg-editor-tool hover:border-crd-green/50",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface EffectCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof effectCardVariants> {
  title: string;
  description?: string;
  emoji?: string;
  icon?: React.ComponentType<any>;
  intensity?: number;
  isActive?: boolean;
  badge?: string;
  children?: React.ReactNode;
}

export const EffectCard = React.forwardRef<HTMLDivElement, EffectCardProps>(
  ({ 
    className, 
    variant, 
    title, 
    description, 
    emoji, 
    icon: Icon, 
    intensity = 0, 
    isActive = false,
    badge,
    children,
    ...props 
  }, ref) => {
    const cardVariant = isActive ? 'active' : variant;
    
    return (
      <div
        className={cn(effectCardVariants({ variant: cardVariant }), className)}
        ref={ref}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {emoji && (
              <span className="text-base" role="img" aria-label={title}>
                {emoji}
              </span>
            )}
            {Icon && (
              <Icon className={cn(
                "w-4 h-4",
                isActive ? "text-crd-green" : "text-crd-lightGray"
              )} />
            )}
            <span className={cn(
              "font-medium text-sm",
              isActive ? "text-white" : "text-crd-lightGray"
            )}>
              {title}
            </span>
          </div>
          
          {/* Badges */}
          <div className="flex items-center space-x-2">
            {isActive && intensity > 0 && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5 h-5 bg-crd-green/20 border-crd-green text-crd-green"
              >
                {Math.round(intensity)}%
              </Badge>
            )}
            {badge && (
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5 h-5 border-crd-mediumGray text-crd-lightGray"
              >
                {badge}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Description */}
        {description && (
          <p className="text-xs text-crd-lightGray/80 mb-3 leading-relaxed">
            {description}
          </p>
        )}
        
        {/* Content */}
        {children}
      </div>
    );
  }
);

EffectCard.displayName = "EffectCard";
