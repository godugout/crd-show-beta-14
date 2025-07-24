import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const typographyVariants = cva(
  "font-dm-sans transition-colors",
  {
    variants: {
      variant: {
        // Hero & Display Text - smaller hero variant for better sizing
        hero: "text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-extrabold leading-tight tracking-[-1.28px] text-crd-white",
        display: "text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight tracking-[-1.28px] text-crd-white", 
        section: "text-[36px] font-extrabold leading-tight tracking-[-0.64px] text-crd-white", // 36px
        
        // Page Structure
        'page-title': "text-3xl font-bold leading-snug text-crd-white",
        component: "text-2xl font-bold leading-snug text-crd-white", 
        card: "text-xl font-semibold leading-snug text-crd-white",
        'small-heading': "text-lg font-semibold leading-normal text-crd-white",
        
        // Body Text
        'large-body': "text-lg leading-relaxed text-crd-white font-medium",
        body: "text-base leading-relaxed text-crd-white font-medium",
        'small-body': "text-sm leading-normal text-crd-lightGray",
        caption: "text-xs leading-snug text-crd-lightGray",
        
        // Interactive Elements - exact spec
        button: "text-lg font-extrabold leading-none text-inherit", // 18px, 800 weight
        link: "text-base font-medium leading-none text-crd-blue hover:text-crd-orange transition-colors",
        label: "text-xs font-semibold leading-none text-crd-lightGray uppercase tracking-wide", // 12px uppercase
        
        // Legacy variants for backward compatibility
        h1: "text-[40px] font-black leading-[48px] tracking-[-0.4px] text-crd-white", // Hero spec
        h2: "text-3xl font-bold text-crd-white", 
        h3: "text-2xl font-bold text-crd-white",
        h4: "text-xl font-semibold text-crd-white",
        accent: "font-semibold crd-text-gradient",
        muted: "text-crd-lightGray",
        code: "font-roboto-mono text-sm text-crd-lightGray bg-crd-darkGray px-1 py-0.5 rounded",
      },
    },
    defaultVariants: {
      variant: "body",
    },
  }
);

export interface TypographyProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
}

export const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, as: Component = "p", ...props }, ref) => {
    return React.createElement(Component, {
      className: cn(typographyVariants({ variant, className })),
      ref,
      ...props
    });
  }
);

Typography.displayName = "Typography";

// Convenience components
export const Heading = ({ level = 1, children, className, ...props }: { 
  level?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLHeadingElement>) => (
  <Typography
    as={`h${level}` as keyof JSX.IntrinsicElements}
    variant={`h${level}` as VariantProps<typeof typographyVariants>['variant']}
    className={className}
    {...props}
  >
    {children}
  </Typography>
);

export const AccentText = ({ children, className, ...props }: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLSpanElement>) => (
  <Typography
    as="span"
    variant="accent"
    className={className}
    {...props}
  >
    {children}
  </Typography>
);
