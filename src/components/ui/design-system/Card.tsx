
import React from 'react';
import { Card as ShadcnCard, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const cardVariants = cva(
  "card-themed overflow-hidden",
  {
    variants: {
      variant: {
        default: "hover:shadow-lg",
        interactive: "cursor-pointer hover-glow team-spirit-glow",
        elevated: "shadow-lg hover-glow",
        flat: "shadow-none",
      },
      padding: {
        none: "p-0",
        sm: "p-4", 
        default: "p-8", /* 32px as per spec */
        lg: "p-10", /* larger option */
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "default",
    },
  }
);

export interface CRDCardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const CRDCard = React.forwardRef<HTMLDivElement, CRDCardProps>(
  ({ className, variant, padding, header, footer, children, ...props }, ref) => {
    return (
      <ShadcnCard
        ref={ref}
        className={cn(cardVariants({ variant, className }))}
        {...props}
      >
        {header && (
          <CardHeader className={cn(padding === "none" ? "p-0" : "p-6 border-b border-crd-mediumGray")}>
            {header}
          </CardHeader>
        )}
        <CardContent className={cn(
          padding === "none" ? "p-0" : 
          padding === "sm" ? "p-4" :
          padding === "lg" ? "p-8" : "p-6"
        )}>
          {children}
        </CardContent>
        {footer && (
          <CardFooter className={cn(padding === "none" ? "p-0" : "p-6 border-t border-crd-mediumGray")}>
            {footer}
          </CardFooter>
        )}
      </ShadcnCard>
    );
  }
);

CRDCard.displayName = "CRDCard";
