# Cardshow Component Examples

## Card3DViewer Component

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Card } from '@/types';

interface Card3DViewerProps {
  card: Card;
  effects?: {
    holographic?: boolean;
    chrome?: boolean;
    foil?: boolean;
  };
}

export function Card3DViewer({ card, effects }: Card3DViewerProps) {
  return (
    <div className="h-[600px] w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} />
        <CardMesh card={card} effects={effects} />
        <OrbitControls enableZoom={false} />
        <Environment preset="studio" />
      </Canvas>
    </div>
  );
}
```

## CardGrid Component

```typescript
interface CardGridProps {
  cards: Card[];
  loading?: boolean;
  onCardClick?: (card: Card) => void;
}

export function CardGrid({ cards, loading, onCardClick }: CardGridProps) {
  if (loading) {
    return <CardGridSkeleton />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {cards.map((card) => (
        <CardThumbnail
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
        />
      ))}
    </div>
  );
}
```

## Error Boundary

```typescript
class ErrorBoundary extends React.Component<{ children: React.ReactNode; fallback?: React.ComponentType }, { hasError: boolean; error?: Error }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to Sentry
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback />;
    }

    return this.props.children;
  }
}
```
