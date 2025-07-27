# Cardshow/CRD Best Practices

## Mobile-First Development

- Design for 320px minimum width
- Touch targets minimum 44px
- Test on real devices regularly
- Use responsive units (rem, %, vw)

## Performance Optimization

### Image Handling

- Use Next.js Image component everywhere
- Provide width and height props
- Generate thumbnails for card grids
- Use WebP/AVIF formats with fallbacks

### 3D Performance

- Lazy load Three.js libraries
- Implement LOD (Level of Detail) for complex models
- Dispose of Three.js resources properly
- Target 60fps desktop, 30fps mobile

### Code Splitting

```typescript
// Lazy load heavy components
const Card3DViewer = dynamic(() => import('@/components/Card3DViewer'), {
  loading: () => <Card3DViewerSkeleton />,
  ssr: false
});
```

## Data Fetching Patterns

### Server Components (Preferred)

```typescript
// app/cards/page.tsx
export default async function CardsPage() {
  const cards = await getCards(); // Direct database call
  return <CardGrid cards={cards} />;
}
```

### Client-Side Fetching

```typescript
// Use React Query for client-side needs
const { data, error, isLoading } = useQuery({
  queryKey: ['cards', userId],
  queryFn: () => fetchUserCards(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

## Security Practices

- Validate all user inputs with Zod
- Use parameterized queries (Prisma handles this)
- Implement rate limiting on API routes
- Sanitize file uploads
- Never expose sensitive keys client-side

## Accessibility (WCAG 2.1 AA)

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Color contrast ratio 4.5:1 minimum
- Focus indicators visible

## Testing Strategy

- Unit test utilities and hooks
- Integration test API routes
- Component test with user interactions
- E2E test critical user flows
- Visual regression for 3D components

## Error Handling Philosophy

- Fail gracefully with fallbacks
- Log errors to Sentry
- Show user-friendly error messages
- Provide recovery actions
- Never expose stack traces to users

## State Management Rules

1. Local state for component-specific data
2. Context for cross-component state
3. URL state for shareable app state
4. Server state with React Query
5. No global state pollution

## Database Patterns

- Use database transactions for related operations
- Implement soft deletes for user content
- Add indexes for frequently queried fields
- Use connection pooling in production
- Regular backups and point-in-time recovery
