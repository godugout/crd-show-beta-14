
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const presetCardVariants = cva(
  "relative overflow-hidden rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-2 border-white/20 hover:border-white/40 hover:bg-white/5",
        selected: "shadow-lg",
        loading: "bg-white/5",
      },
      size: {
        sm: "p-2",
        default: "p-3",
        lg: "p-4",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface PresetCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof presetCardVariants> {
  title: string;
  description?: string;
  category?: string;
  icon?: React.ComponentType<any>;
  emoji?: string;
  isSelected?: boolean;
  isLoading?: boolean;
  isDisabled?: boolean;
  badge?: string;
  tooltipContent?: React.ReactNode;
  onSelect?: () => void;
  styleColor?: {
    primary: string;
    border: string;
    bg: string;
    gradient: string;
  };
}

export const PresetCard = React.forwardRef<HTMLButtonElement, PresetCardProps>(
  ({ 
    className, 
    variant, 
    size, 
    title, 
    description, 
    category, 
    icon: Icon, 
    emoji, 
    isSelected = false, 
    isLoading = false, 
    isDisabled = false,
    badge,
    tooltipContent,
    onSelect,
    onClick,
    styleColor,
    ...props 
  }, ref) => {
    const cardVariant = isSelected ? 'selected' : isLoading ? 'loading' : 'default';
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (onSelect) onSelect();
      if (onClick) onClick(e);
    };

    const cardStyle = React.useMemo(() => {
      if (!styleColor) return {};
      
      if (isSelected) {
        return {
          borderColor: styleColor.border,
          backgroundColor: styleColor.bg,
          boxShadow: `0 0 20px ${styleColor.primary}40, 0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 ${styleColor.border}40`,
          '--ring-color': styleColor.primary
        } as React.CSSProperties;
      }
      
      return {
        borderColor: 'rgba(255, 255, 255, 0.2)',
        '--hover-border': styleColor.border,
        '--hover-bg': styleColor.bg
      } as React.CSSProperties;
    }, [styleColor, isSelected]);
    
    const CardContent = (
      <Button
        onClick={handleClick}
        disabled={isDisabled || isLoading}
        variant="ghost"
        style={cardStyle}
        className={cn(
          presetCardVariants({ variant: cardVariant, size }),
          "w-full h-auto text-left p-0 min-h-[80px] hover:scale-[1.02] transition-all duration-200",
          !styleColor && isSelected && "border-crd-green bg-crd-green/10 shadow-lg shadow-crd-green/20",
          styleColor && "hover:border-[var(--hover-border)] hover:bg-[var(--hover-bg)]",
          styleColor && isSelected && "border-2",
          isDisabled && "opacity-50 cursor-not-allowed",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Status Indicators */}
        {isSelected && (
          <div 
            className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center border border-white/20"
            style={{ backgroundColor: styleColor?.primary || '#45B26B' }}
          >
            <Check className="w-2.5 h-2.5 text-white" />
          </div>
        )}
        
        {isLoading && (
          <div className="absolute top-2 left-2">
            <Loader2 
              className="w-3 h-3 animate-spin" 
              style={{ color: styleColor?.primary || '#45B26B' }}
            />
          </div>
        )}

        {/* Content - Tighter spacing */}
        <div className="w-full flex flex-col items-center justify-center space-y-1 py-2">
          {/* Icon Section */}
          {emoji && (
            <span className="text-2xl" role="img" aria-label={title}>
              {emoji}
            </span>
          )}
          
          {/* Title Section */}
          <span className={cn(
            "font-medium text-sm text-center leading-tight",
            isSelected 
              ? "text-white" 
              : "text-crd-lightGray"
          )}>
            {title}
          </span>
        </div>
      </Button>
    );

    if (tooltipContent) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            {CardContent}
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-black border-crd-mediumGray text-white max-w-64 z-50">
            {tooltipContent}
          </TooltipContent>
        </Tooltip>
      );
    }

    return CardContent;
  }
);

PresetCard.displayName = "PresetCard";
