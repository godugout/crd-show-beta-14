# CRD Design System

## Overview

The CRD Design System is a comprehensive design language that provides consistent, accessible, and beautiful components for the CRD platform. It encompasses colors, typography, spacing, components, and interaction patterns.

## Design Principles

### 1. **Democratization**

- Make professional design accessible to everyone
- Provide intuitive tools for non-designers
- Enable rapid iteration and experimentation

### 2. **Authenticity**

- Celebrate real moments and memories
- Support personal expression and creativity
- Maintain human connection in digital spaces

### 3. **Performance**

- 60fps smooth animations
- Mobile-first responsive design
- Optimized for touch interactions

### 4. **Accessibility**

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios

## Color System

### Primary Colors

```css
--crd-blue: #3772ff /* Primary actions, links, focus states */
  --crd-orange: #f97316 /* Cards, creation, highlights */ --crd-green: #45b26b
  /* Success states, collections */ --crd-purple: #9757d7
  /* Premium features, accents */ --crd-gold: #ffd700
  /* CRD tokens, special elements */;
```

### Neutral Colors

```css
--crd-darkest: #121212 /* Main app background */ --crd-darker: #1a1a1a
  /* Secondary backgrounds */ --crd-dark: #23262f /* Card backgrounds */
  --crd-darkGray: #23262f /* Elevated surfaces */ --crd-mediumGray: #353945
  /* Borders, dividers */ --crd-lightGray: #777e90 /* Secondary text */
  --crd-white: #fcfcfd /* Primary text */;
```

### Color Usage Guidelines

#### Primary Actions

- Use `--crd-blue` for main CTAs and primary actions
- Use `--crd-orange` for creation and card-related actions
- Use `--crd-green` for success and collection actions

#### Text Hierarchy

- `--crd-white` for headings and primary text
- `--crd-lightGray` for body content and secondary text
- `--crd-mediumGray` for labels and muted text

#### Backgrounds

- `--crd-darkest` for main app background
- `--crd-darker` for card backgrounds
- `--crd-darkGray` for elevated surfaces and modals

## Typography

### Font Stack

```css
font-family:
  -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
  Arial, sans-serif;
```

### Type Scale

```css
--font-size-xs: 0.75rem /* 12px */ --font-size-sm: 0.875rem /* 14px */
  --font-size-base: 1rem /* 16px */ --font-size-lg: 1.125rem /* 18px */
  --font-size-xl: 1.25rem /* 20px */ --font-size-2xl: 1.5rem /* 24px */
  --font-size-3xl: 1.875rem /* 30px */ --font-size-4xl: 2.25rem /* 36px */;
```

### Font Weights

```css
font-light: 300
font-normal: 400
font-medium: 500
font-semibold: 600
font-bold: 700
font-extrabold: 800
```

### Typography Components

#### CRD Typography

```tsx
<Typography variant="h1">Heading 1</Typography>
<Typography variant="h2">Heading 2</Typography>
<Typography variant="h3">Heading 3</Typography>
<Typography variant="body">Body text</Typography>
<AccentText>Accent text</AccentText>
```

## Spacing System

### Spacing Scale

```css
--spacing-xs: 0.25rem /* 4px */ --spacing-sm: 0.5rem /* 8px */
  --spacing-md: 1rem /* 16px */ --spacing-lg: 1.5rem /* 24px */
  --spacing-xl: 2rem /* 32px */;
```

### Container System

```css
.crd-container {
  @apply container mx-auto p-6 max-w-7xl;
}
```

## Component Library

### Buttons

#### CRD Button Variants

```tsx
<CRDButton variant="primary">Primary Action</CRDButton>
<CRDButton variant="secondary">Secondary Action</CRDButton>
<CRDButton variant="outline">Outline Button</CRDButton>
<CRDButton variant="ghost">Ghost Button</CRDButton>
<CRDButton variant="glass">Glass Button</CRDButton>
<CRDButton variant="create">Create Card</CRDButton>
<CRDButton variant="collective">Join Collective</CRDButton>
<CRDButton variant="collect">Collect Cards</CRDButton>
```

#### Button Guidelines

- Use primary for main actions
- Use secondary for supporting actions
- Use outline for less prominent actions
- Use ghost for subtle interactions
- Use glass for modern, translucent effects
- Use create/collective/collect for specific CRD actions

### Cards

#### Card Variants

```tsx
<CRDCard>
  <div className="p-4">
    <h3>Card Title</h3>
    <p>Card content</p>
  </div>
</CRDCard>

<EffectCard
  title="Effect Name"
  description="Effect description"
  emoji="✨"
  intensity={85}
/>

<PresetCard
  title="Preset Name"
  emoji="📜"
  isSelected={true}
/>
```

#### Card Guidelines

- Use `CRDCard` for general content containers
- Use `EffectCard` for interactive effect selection
- Use `PresetCard` for template/preset selection
- Maintain consistent padding and spacing
- Use hover effects for interactive cards

### Form Elements

#### Input Components

```tsx
<CRDInput placeholder="Enter text..." />
<Input placeholder="Standard input" />
```

#### Form Guidelines

- Use `CRDInput` for CRD-specific styling
- Use standard `Input` for general forms
- Provide clear labels and validation
- Use appropriate input types for data

### Feedback Elements

#### Status Indicators

```tsx
<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<CRDBadge>CRD Badge</CRDBadge>

<Progress value={65} />

<Alert>
  <AlertDescription>Alert message</AlertDescription>
</Alert>
```

## Layout Patterns

### Grid System

```css
/* 12-column grid */
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

/* Responsive breakpoints */
xs: 480px
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1400px
```

### Container Patterns

```css
/* CRD Container */
.crd-container {
  @apply container mx-auto p-6 max-w-7xl;
}

/* Standard Container */
.container {
  @apply container mx-auto px-6;
}
```

### Flexbox Patterns

```css
/* Horizontal layout */
.flex.justify-between.items-center

/* Vertical layout */
.flex.flex-col.space-y-2

/* Centered content */
.flex.items-center.justify-center
```

## Animation & Effects

### Transitions

```css
/* Standard transition */
transition-all duration-200

/* Smooth hover effects */
hover:bg-crd-blue/80 transition-colors

/* Card hover effects */
hover:shadow-lg transition-all
```

### Loading States

```tsx
<LoadingState
  fullPage
  message='Loading...'
  size='lg'
  className='bg-crd-darkest'
/>
```

### Glass Morphism

```css
.crd-glass-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
}
```

## Theme System

### Theme Variables

```css
:root {
  --theme-navbar-bg: var(--crd-blue);
  --theme-navbar-border: var(--crd-purple);
  --theme-accent: var(--crd-blue);
}
```

### Theme Presets

- **CRD Default**: Standard dark theme
- **CRD Light**: Light theme variant
- **CRD Vintage**: Retro/vintage theme
- **CRD Neon**: Cyberpunk/neon theme

### Theme Customization

```tsx
// Apply theme tokens
document.documentElement.style.setProperty('--crd-blue', '#3772FF');

// Export/import themes
const themeData = {
  name: 'Custom Theme',
  tokens: { '--crd-blue': '#3772FF' },
};
```

## Accessibility Guidelines

### Color Contrast

- Minimum 4.5:1 ratio for normal text
- Minimum 3:1 ratio for large text
- Use color contrast checkers for validation

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Provide visible focus indicators
- Support tab navigation order

### Screen Reader Support

- Use semantic HTML elements
- Provide ARIA labels and roles
- Include alt text for images
- Use proper heading hierarchy

### Touch Targets

- Minimum 44px touch targets on mobile
- Adequate spacing between interactive elements
- Support for touch gestures

## Performance Guidelines

### Animation Performance

- Use CSS transforms and opacity for animations
- Avoid animating layout properties
- Use `will-change` sparingly
- Support `prefers-reduced-motion`

### Image Optimization

- Use WebP format when possible
- Implement lazy loading
- Provide appropriate image sizes
- Use responsive images

### Code Splitting

- Lazy load non-critical components
- Split routes for better performance
- Use dynamic imports for heavy features

## Mobile-First Design

### Breakpoint Strategy

```css
/* Mobile first approach */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
```

### Touch Interactions

- Large touch targets (44px minimum)
- Swipe gestures for navigation
- Pull-to-refresh patterns
- Haptic feedback support

### Responsive Typography

```css
/* Fluid typography */
.text-responsive {
  font-size: clamp(1rem, 4vw, 2rem);
}
```

## Component Best Practices

### Composition

- Build components from smaller, reusable pieces
- Use composition over inheritance
- Keep components focused and single-purpose
- Provide flexible prop interfaces

### State Management

- Use React Query for server state
- Use local state for UI interactions
- Implement optimistic updates
- Handle loading and error states

### Error Handling

- Provide meaningful error messages
- Implement error boundaries
- Graceful degradation
- Retry mechanisms for failed requests

### Testing

- Unit tests for component logic
- Integration tests for user flows
- Visual regression testing
- Accessibility testing

## Design Tokens

### CSS Custom Properties

```css
:root {
  /* Colors */
  --crd-blue: #3772ff;
  --crd-orange: #f97316;

  /* Spacing */
  --spacing-md: 1rem;

  /* Typography */
  --font-size-base: 1rem;

  /* Effects */
  --border-radius-md: 0.5rem;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

### Token Categories

1. **Colors**: Brand colors, neutrals, semantic colors
2. **Spacing**: Consistent spacing scale
3. **Typography**: Font sizes, weights, line heights
4. **Effects**: Shadows, borders, radius
5. **Layout**: Breakpoints, containers, grids

## Implementation Guidelines

### File Organization

```
src/
├── components/
│   ├── ui/              # Base UI components
│   ├── design-system/   # Design system components
│   └── [feature]/       # Feature-specific components
├── styles/
│   ├── base.css         # Base styles
│   ├── components.css   # Component styles
│   └── theme.css        # Theme variables
└── docs/
    └── DESIGN_SYSTEM.md # This documentation
```

### Naming Conventions

- Components: PascalCase (`CRDButton`)
- Files: PascalCase (`DesignGuide.tsx`)
- CSS classes: kebab-case (`crd-container`)
- CSS variables: kebab-case (`--crd-blue`)

### Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier rules
- Write self-documenting code
- Include JSDoc comments for complex components

## Resources

### Design Tools

- [Figma Design System](https://figma.com)
- [Storybook Component Library](https://storybook.js.org)
- [Theme Tester Component](./ThemeTester.tsx)

### Documentation

- [Design Guide Page](./DesignGuide.tsx)
- [Component API Documentation](./components/ui/)
- [Theme System Documentation](./lib/completeLogoThemes.ts)

### Testing

- [Accessibility Testing](https://www.deque.com/axe/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Performance Testing](https://web.dev/vitals/)

## Contributing

### Adding New Components

1. Create component in appropriate directory
2. Add TypeScript interfaces
3. Include accessibility features
4. Write unit tests
5. Update documentation
6. Add to design system showcase

### Updating Design Tokens

1. Update CSS custom properties
2. Test across all components
3. Update theme presets
4. Validate accessibility
5. Update documentation

### Theme Customization

1. Use ThemeTester component for experimentation
2. Export custom themes as JSON
3. Share themes with team
4. Document theme usage patterns

---

This design system is living documentation that evolves with the CRD platform. Regular updates ensure consistency, accessibility, and performance across all user experiences.
