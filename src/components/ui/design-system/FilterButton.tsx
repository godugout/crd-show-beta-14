
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const filterButtonVariants = cva(
  "h-8 px-3 text-xs font-medium rounded-full transition-all duration-200 border",
  {
    variants: {
      variant: {
        default: "bg-transparent border-crd-mediumGray text-crd-lightGray hover:border-crd-green hover:text-white hover:bg-crd-green/10",
        active: "bg-crd-green border-crd-green text-black hover:bg-crd-green/90",
        count: "bg-transparent border-crd-mediumGray text-crd-lightGray hover:border-crd-green hover:text-white hover:bg-crd-green/10",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof filterButtonVariants> {
  isActive?: boolean;
  count?: number;
  children: React.ReactNode;
}

export const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ className, variant, isActive = false, count, children, ...props }, ref) => {
    const buttonVariant = isActive ? 'active' : (count !== undefined ? 'count' : 'default');
    
    return (
      <Button
        variant="ghost"
        className={cn(filterButtonVariants({ variant: buttonVariant }), className)}
        ref={ref}
        {...props}
      >
        <span>{children}</span>
        {count !== undefined && count > 0 && (
          <span className={cn(
            "ml-2 px-1.5 py-0.5 rounded-full text-xs leading-none",
            isActive 
              ? "bg-black/20 text-black" 
              : "bg-crd-green/20 text-crd-green"
          )}>
            {count}
          </span>
        )}
      </Button>
    );
  }
);

FilterButton.displayName = "FilterButton";
