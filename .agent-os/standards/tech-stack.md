# Cardshow/CRD Tech Stack Standards

## Core Framework

- **Frontend Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Library**: React 18

## 3D & Visualization

- **3D Engine**: Three.js + React Three Fiber + Drei
- **WebGL**: WebGL2 with WebGL1 fallback
- **Animation**: Framer Motion for UI, Three.js for 3D animations

## State Management

- **Client State**: React Context + useState/useReducer
- **Server State**: React Query (TanStack Query)
- **Form State**: React Hook Form + Zod validation

## Backend & Database

- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth (Google, Discord, Apple OAuth)
- **File Storage**: Supabase Storage / Cloudinary
- **Caching**: Redis
- **API**: Next.js API Routes + tRPC (optional)

## Payments & Commerce

- **Payment Processing**: Stripe (including Stripe Connect)
- **Token System**: CRD Tokens (in-app currency)

## Development Tools

- **Package Manager**: npm/pnpm
- **Linting**: ESLint with Next.js config
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged

## Deployment & Infrastructure

- **Hosting**: Vercel
- **CDN**: Cloudflare
- **Monitoring**: Sentry
- **Analytics**: Mixpanel / Vercel Analytics

## Testing

- **Unit Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Component Testing**: Storybook (optional)

## Performance Targets

- Desktop: 60fps 3D rendering, <2s page load
- Mobile: 30fps minimum, <3s page load
- Lighthouse: >90 score
