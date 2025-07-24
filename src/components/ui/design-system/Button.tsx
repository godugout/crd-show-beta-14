
import React from 'react';
import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-extrabold rounded-pill transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Exact specification buttons with proper styling - all rounded pills
        primary: "btn-themed-primary team-spirit-glow",
        secondary: "btn-themed-secondary team-spirit-glow", 
        outline: "btn-themed-ghost",
        ghost: "btn-themed-ghost",
        action: "p-3 btn-themed-secondary team-spirit-glow",
        // New glass variant for secondary CTAs
        glass: "crd-glass-button",
        // Official Create CTA button with orange-green-blue CRD gradient
        create: "crd-create-button",
        // Official Collective CTA button with orange gradient
        collective: "crd-collective-button",
        // Official Collect CTA button with blue-purple gradient
        collect: "crd-collect-button",
        // Fallback variants - also rounded pills
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "accent-themed underline-offset-4 hover:underline hover:highlight-themed",
      },
      size: {
        default: "text-lg px-6 py-4", /* 18px text, proper padding */
        sm: "text-sm px-4 py-2",
        lg: "text-lg px-8 py-4", /* matches spec */
        xl: "text-xl px-10 py-5", /* 20px text, extra padding for CTAs */
        icon: "h-10 w-10",
        "action-icon": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface CRDButtonProps extends Omit<ShadcnButtonProps, 'variant' | 'size'>, VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
}

export const CRDButton = React.forwardRef<HTMLButtonElement, CRDButtonProps>(
  ({ className, variant, size, icon, children, asChild, ...props }, ref) => {
    return (
      <ShadcnButton
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        asChild={asChild}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </ShadcnButton>
    );
  }
);

CRDButton.displayName = "CRDButton";
