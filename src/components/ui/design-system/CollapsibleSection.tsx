
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const collapsibleSectionVariants = cva(
  "space-y-3",
  {
    variants: {
      variant: {
        default: "",
        compact: "space-y-2",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface CollapsibleSectionProps extends VariantProps<typeof collapsibleSectionVariants> {
  title: string;
  icon?: React.ComponentType<any>;
  emoji?: string;
  statusText?: string;
  statusCount?: number;
  isOpen?: boolean;
  onToggle?: (isOpen: boolean) => void;
  className?: string;
  children: React.ReactNode;
  alwaysOpen?: boolean;
}

export const CollapsibleSection = React.forwardRef<HTMLDivElement, CollapsibleSectionProps>(
  ({ 
    className, 
    variant,
    title, 
    icon: Icon, 
    emoji, 
    statusText, 
    statusCount,
    isOpen = false, 
    onToggle,
    alwaysOpen = false,
    children,
    ...props 
  }, ref) => {
    const handleToggle = (open: boolean) => {
      if (!alwaysOpen && onToggle) {
        onToggle(open);
      }
    };

    const TriggerContent = (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          {emoji && (
            <span className="text-base" role="img" aria-label={title}>
              {emoji}
            </span>
          )}
          {Icon && (
            <Icon className="w-4 h-4 text-crd-green" />
          )}
          <div className="flex items-center space-x-2">
            <span className="text-white font-medium text-sm">{title}</span>
            {statusText && (
              <span className="text-crd-lightGray text-xs">
                • {statusText}
              </span>
            )}
            {statusCount !== undefined && statusCount > 0 && (
              <span className="bg-crd-green/20 text-crd-green px-2 py-0.5 rounded-full text-xs font-medium">
                {statusCount}
              </span>
            )}
          </div>
        </div>
        
        {!alwaysOpen && (
          <ChevronDown className={cn(
            "w-4 h-4 text-crd-lightGray transition-transform duration-200",
            isOpen && "rotate-180"
          )} />
        )}
      </div>
    );

    if (alwaysOpen) {
      return (
        <div 
          ref={ref}
          className={cn(collapsibleSectionVariants({ variant }), className)}
          {...props}
        >
          <div className="pb-2">
            {TriggerContent}
          </div>
          <div>
            {children}
          </div>
        </div>
      );
    }

    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={handleToggle}
        className={cn(collapsibleSectionVariants({ variant }), className)}
        ref={ref}
        {...props}
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full h-auto p-3 justify-start hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
          >
            {TriggerContent}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-3">
          <div className="px-3">
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
);

CollapsibleSection.displayName = "CollapsibleSection";
