
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: [
    // Dynamic color classes for effect sliders
    'bg-purple-400', 'bg-purple-400/20', 'bg-purple-400/40', 'border-purple-400', 'border-purple-400/40', 'shadow-purple-400/50',
    'bg-yellow-400', 'bg-yellow-400/20', 'bg-yellow-400/40', 'border-yellow-400', 'border-yellow-400/40', 'shadow-yellow-400/50',
    'bg-blue-400', 'bg-blue-400/20', 'bg-blue-400/40', 'border-blue-400', 'border-blue-400/40', 'shadow-blue-400/50',
    'bg-gray-400', 'bg-gray-400/20', 'bg-gray-400/40', 'border-gray-400', 'border-gray-400/40', 'shadow-gray-400/50',
    'bg-green-400', 'bg-green-400/20', 'bg-green-400/40', 'border-green-400', 'border-green-400/40', 'shadow-green-400/50',
    'bg-orange-400', 'bg-orange-400/20', 'bg-orange-400/40', 'border-orange-400', 'border-orange-400/40', 'shadow-orange-400/50',
    'bg-cyan-400', 'bg-cyan-400/20', 'bg-cyan-400/40', 'border-cyan-400', 'border-cyan-400/40', 'shadow-cyan-400/50',
    'bg-amber-400', 'bg-amber-400/20', 'bg-amber-400/40', 'border-amber-400', 'border-amber-400/40', 'shadow-amber-400/50',
    // Slider track and thumb classes with dynamic colors
    '[&>span]:bg-purple-400/20', '[&>span]:border-purple-400/40', '[&>span>span]:bg-purple-400/40', '[&>span>span>span]:bg-purple-400', '[&>span>span>span]:border-purple-400', '[&>span>span>span]:shadow-purple-400/50',
    '[&>span]:bg-yellow-400/20', '[&>span]:border-yellow-400/40', '[&>span>span]:bg-yellow-400/40', '[&>span>span>span]:bg-yellow-400', '[&>span>span>span]:border-yellow-400', '[&>span>span>span]:shadow-yellow-400/50',
    '[&>span]:bg-blue-400/20', '[&>span]:border-blue-400/40', '[&>span>span]:bg-blue-400/40', '[&>span>span>span]:bg-blue-400', '[&>span>span>span]:border-blue-400', '[&>span>span>span]:shadow-blue-400/50',
    '[&>span]:bg-gray-400/20', '[&>span]:border-gray-400/40', '[&>span>span]:bg-gray-400/40', '[&>span>span>span]:bg-gray-400', '[&>span>span>span]:border-gray-400', '[&>span>span>span]:shadow-gray-400/50',
    '[&>span]:bg-green-400/20', '[&>span]:border-green-400/40', '[&>span>span]:bg-green-400/40', '[&>span>span>span]:bg-green-400', '[&>span>span>span]:border-green-400', '[&>span>span>span]:shadow-green-400/50',
    '[&>span]:bg-orange-400/20', '[&>span]:border-orange-400/40', '[&>span>span]:bg-orange-400/40', '[&>span>span>span]:bg-orange-400', '[&>span>span>span]:border-orange-400', '[&>span>span>span]:shadow-orange-400/50',
    '[&>span]:bg-cyan-400/20', '[&>span]:border-cyan-400/40', '[&>span>span]:bg-cyan-400/40', '[&>span>span>span]:bg-cyan-400', '[&>span>span>span]:border-cyan-400', '[&>span>span>span]:shadow-cyan-400/50',
    '[&>span]:bg-amber-400/20', '[&>span]:border-amber-400/40', '[&>span>span]:bg-amber-400/40', '[&>span>span>span]:bg-amber-400', '[&>span>span>span]:border-amber-400', '[&>span>span>span]:shadow-amber-400/50',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // CRD Design System - Using CSS variables for proper theming
        crd: {
          // Base colors
          darkest: 'hsl(var(--crd-darkest))',
          darker: 'hsl(var(--crd-darker))',
          dark: 'hsl(var(--crd-dark))',
          darkGray: 'hsl(var(--crd-darkGray))',
          mediumGray: 'hsl(var(--crd-mediumGray))',
          lightGray: 'hsl(var(--crd-lightGray))',
          white: 'hsl(var(--crd-white))',
          
          // Brand colors
          orange: 'hsl(var(--crd-orange))',
          blue: 'hsl(var(--crd-blue))',
          green: 'hsl(var(--crd-green))',
          purple: 'hsl(var(--crd-purple))',
          gold: 'hsl(var(--crd-gold))',
        },
        // Comprehensive theme-aware colors using CSS variables
        themed: {
          // Navigation theming
          'navbar-bg': 'hsl(var(--theme-navbar-bg))',
          'navbar-border': 'hsl(var(--theme-navbar-border))',
          
          // Text theming
          'text-primary': 'hsl(var(--theme-text-primary))',
          'text-secondary': 'hsl(var(--theme-text-secondary))',
          'text-active': 'hsl(var(--theme-text-active))',
          
          // Button theming
          'cta-bg': 'hsl(var(--theme-cta-bg))',
          'cta-text': 'hsl(var(--theme-cta-text))',
          'button-primary': 'hsl(var(--theme-button-primary))',
          'button-secondary': 'hsl(var(--theme-button-secondary))',
          'button-ghost': 'hsl(var(--theme-button-ghost))',
          
          // Core accent colors
          'accent': 'hsl(var(--theme-accent))',
          'accent-hover': 'hsl(var(--theme-accent-hover))',
          'highlight': 'hsl(var(--theme-highlight))',
          
          // Card theming
          'card-bg': 'hsl(var(--theme-card-bg))',
          'card-border': 'hsl(var(--theme-card-border))',
          'card-hover': 'hsl(var(--theme-card-hover))',
          
          // Badge theming
          'badge-primary': 'hsl(var(--theme-badge-primary))',
          'badge-secondary': 'hsl(var(--theme-badge-secondary))',
          'badge-success': 'hsl(var(--theme-badge-success))',
          
          // Tab theming
          'tab-active': 'hsl(var(--theme-tab-active))',
          'tab-inactive': 'hsl(var(--theme-tab-inactive))',
          'tab-bg': 'hsl(var(--theme-tab-bg))',
          
          // Interactive elements
          'filter-bg': 'hsl(var(--theme-filter-bg))',
          'price-text': 'hsl(var(--theme-price-text))',
          'success-text': 'hsl(var(--theme-success-text))',
        },
        // Cardshow colors to match CSS variables
        cardshow: {
          green: 'var(--cardshow-green)',
          orange: 'var(--cardshow-orange)',
          purple: 'var(--cardshow-purple)',
          blue: 'var(--cardshow-blue)',
          white: 'var(--cardshow-white)',
          lightGray: 'var(--cardshow-lightGray)',
          mediumGray: 'var(--cardshow-mediumGray)',
          darkGray: 'var(--cardshow-darkGray)',
          darkest: 'var(--cardshow-darkest)',
        },
        // Editor colors
        editor: {
          dark: 'var(--editor-dark)',
          darker: 'var(--editor-darker)',
          tool: 'var(--editor-tool)',
          border: 'var(--editor-border)',
          canvas: 'var(--editor-canvas)',
        },
      },
      spacing: {
        'xs': '0.5rem',   // 8px
        'sm': '0.75rem',  // 12px
        'md': '1rem',     // 16px
        'lg': '1.5rem',   // 24px
        'xl': '2rem',     // 32px
        '2xl': '3rem',    // 48px
        '3xl': '4rem',    // 64px
      },
      borderRadius: {
        'sm': '0.5rem',   // 8px - buttons, inputs
        'md': '0.75rem',  // 12px - small cards
        'lg': '1rem',     // 16px - main cards
        'xl': '1.5rem',   // 24px - hero sections
        'pill': '5.625rem', // 90px - full rounded buttons
        'circle': '50%',  // avatars, icon buttons
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'fade-in': {
          '0%': {
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-100%)'
          },
          '100%': {
            transform: 'translateX(0)'
          }
        },
        // NEW: Enhanced logo animations
        'logo-shimmer': {
          '0%': {
            backgroundPosition: '-200% 0'
          },
          '100%': {
            backgroundPosition: '200% 0'
          }
        },
        'logo-glow-pulse': {
          '0%, 100%': {
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.0))'
          },
          '50%': {
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3)) drop-shadow(0 0 20px rgba(255, 215, 0, 0.4))'
          }
        },
        'gradient-shift': {
          '0%': {
            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(59, 130, 246, 0.1) 100%)'
          },
          '33%': {
            background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(139, 92, 246, 0.1) 100%)'
          },
          '66%': {
            background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 215, 0, 0.1) 100%)'
          },
          '100%': {
            background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(59, 130, 246, 0.1) 100%)'
          }
        },
        'holographic-flow': {
          '0%': {
            transform: 'translateX(-100%) rotate(45deg)',
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateX(100%) rotate(45deg)',
            opacity: '0'
          }
        },
        'scroll': {
          '0%': {
            transform: 'translateX(0%)'
          },
          '100%': {
            transform: 'translateX(-50%)'
          }
        },
        'scroll-right': {
          '0%': {
            transform: 'translateX(0%)'
          },
          '100%': {
            transform: 'translateX(-50%)'
          }
        },
        'slideDown': {
          '0%': {
            transform: 'translateY(-120%)',
            opacity: '0'
          },
          '50%': {
            opacity: '1'
          },
          '100%': {
            transform: 'translateY(120%)',
            opacity: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        // CRD timing functions
        'fast': 'all 150ms ease-out', // micro-interactions
        'standard': 'all 200ms ease-out', // hover states
        'slow': 'all 300ms ease-out', // page transitions
        'complex': 'all 500ms ease-in-out', // card flips, modals
        // Enhanced animations
        'hover-scale': 'transform 200ms ease-out',
        'button-press': 'transform 150ms ease-out',
        'fade-blur': 'backdrop-filter 300ms ease-out, opacity 300ms ease-out',
        // Enhanced logo animations
        'logo-shimmer': 'logo-shimmer 3s ease-in-out infinite',
        'logo-glow-pulse': 'logo-glow-pulse 4s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease-in-out infinite',
        'holographic-flow': 'holographic-flow 2s ease-in-out infinite',
        'scroll': 'scroll 60s linear infinite',
        'scroll-right': 'scroll-right 60s linear infinite'
      },
      fontFamily: {
        'dm-sans': ['DM Sans', 'sans-serif'], // Primary font
        'roboto-mono': ['Roboto Mono', 'monospace'], // Code/monospace
        'orbitron': ['Orbitron', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'fredoka': ['Fredoka One', 'cursive'], // Fun craft font
        // Digital art themed fonts
        'jetbrains': ['JetBrains Mono', 'monospace'], // Matrix/terminal style
        'press-start': ['Press Start 2P', 'monospace'], // 8-bit/retro arcade style
        'exo': ['Exo 2', 'sans-serif'], // Cyberpunk/futuristic
        'audiowide': ['Audiowide', 'cursive'], // Holographic/sci-fi
        // Additional animated tagline fonts
        'comic': ['Comic Sans MS', 'cursive'],
        'caveat': ['Caveat', 'cursive'],
        'chewy': ['Chewy', 'cursive'],
        'kalam': ['Kalam', 'cursive'], // Handwritten font
        'bouncy': ['Fredoka One', 'cursive'], // alias for fredoka
        'playful': ['Caveat', 'cursive'], // alias for caveat
        'fun': ['Chewy', 'cursive'], // alias for chewy
        'handwritten': ['Kalam', 'Caveat', 'cursive'], // Primary handwritten font
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.1', fontWeight: '800' }], // 48px
        'section': ['2.25rem', { lineHeight: '1.2', fontWeight: '800' }], // 36px
        'page-title': ['1.875rem', { lineHeight: '1.3', fontWeight: '700' }], // 30px
        'component': ['1.5rem', { lineHeight: '1.4', fontWeight: '700' }], // 24px
        'card': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }], // 20px
        'small-heading': ['1.125rem', { lineHeight: '1.5', fontWeight: '600' }], // 18px
        'large-body': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
        'body': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'small-body': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 12px
        'button': ['1.125rem', { lineHeight: '1', fontWeight: '800' }], // 18px
        'link': ['1rem', { lineHeight: '1', fontWeight: '500' }], // 16px
        'label': ['0.75rem', { lineHeight: '1', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }], // 12px
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
