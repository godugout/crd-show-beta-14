# Cardshow/CRD Code Style Standards

## TypeScript Conventions

### Interfaces over Types

```typescript
// ✅ Preferred
interface Card {
  id: string;
  title: string;
  imageUrl: string;
}

// ❌ Avoid
type Card = {
  id: string;
  title: string;
  imageUrl: string;
};
```

### Explicit Return Types

```typescript
// ✅ Always specify return types
export async function getCard(id: string): Promise<Card | null> {
  // implementation
}
```

## Component Patterns

### Functional Components with TypeScript

```typescript
interface ComponentProps {
  card: Card;
  onAction?: (card: Card) => void;
  className?: string;
}

export default function CardDisplay({
  card,
  onAction,
  className = '',
}: ComponentProps) {
  // implementation
}
```

### File Naming

- Components: PascalCase (e.g., `CardDisplay.tsx`)
- Utilities: camelCase (e.g., `formatCurrency.ts`)
- Types: PascalCase with `.types.ts` suffix
- Constants: SCREAMING_SNAKE_CASE in `.constants.ts` files

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable components
│   ├── ui/          # Base UI components
│   ├── cards/       # Card-specific components
│   └── layout/      # Layout components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── constants/       # App constants
```

## CSS & Styling

### Tailwind Classes Order

1. Layout (display, position)
2. Spacing (margin, padding)
3. Sizing (width, height)
4. Typography
5. Visual (background, border)
6. Effects (shadow, transform)
7. States (hover, focus)

```jsx
<div className="flex items-center justify-between p-4 w-full text-white bg-crd-surface rounded-lg shadow-md hover:shadow-lg transition-shadow">
```

### Component Classes

```typescript
// Use cn() utility for conditional classes
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  className // Allow override
)} />
```

## Error Handling

### Always Use Error Boundaries

```typescript
<ErrorBoundary fallback={<ErrorFallback />}>
  <Component />
</ErrorBoundary>
```

### API Error Responses

```typescript
try {
  // operation
} catch (error) {
  return NextResponse.json(
    { success: false, error: 'Human-readable message' },
    { status: 500 }
  );
}
```

## Git Commit Messages

- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test additions/changes
- chore: Build/tooling changes

Example: `feat: add 3D card rotation animation`
