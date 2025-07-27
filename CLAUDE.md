# CRD Show Beta 14 - Claude Documentation

## Agent OS Documentation

### Product Context
- **Mission & Vision:** @.agent-os/product/mission.md
- **Technical Architecture:** @.agent-os/product/tech-stack.md
- **Development Roadmap:** @.agent-os/product/roadmap.md
- **Decision History:** @.agent-os/product/decisions.md

### Development Standards
- **Code Style:** @~/.agent-os/standards/code-style.md
- **Best Practices:** @~/.agent-os/standards/best-practices.md

### Project Management
- **Active Specs:** @.agent-os/specs/
- **Spec Planning:** Use `@~/.agent-os/instructions/create-spec.md`
- **Tasks Execution:** Use `@~/.agent-os/instructions/execute-tasks.md`

## Workflow Instructions

When asked to work on this codebase:

1. **First**, check @.agent-os/product/roadmap.md for current priorities
2. **Then**, follow the appropriate instruction file:
   - For new features: @.agent-os/instructions/create-spec.md
   - For tasks execution: @.agent-os/instructions/execute-tasks.md
3. **Always**, adhere to the standards in the files listed above

## Important Notes

- Product-specific files in `.agent-os/product/` override any global standards
- User's specific instructions override (or amend) instructions found in `.agent-os/specs/...`
- Always adhere to established patterns, code style, and best practices documented above.

## Project Overview

CRD Show Beta 14 is a revolutionary digital card creation platform that democratizes professional-grade card design, enabling anyone to create, share, and monetize collectible cards without traditional licensing barriers.

### Core Mission
**Democratize sports card creation** by providing professional-grade tools to photographers, parents, fans, and artists to create personalized trading cards that capture deeply personal memories and generate income.

## Current Status

### ✅ Completed Features (Phase 0)
- **Secure Authentication**: Enterprise-grade auth with rate limiting
- **Card Creation Tools**: Multiple modes (Quick, Guided, Advanced)
- **CRD Collectibles**: Professional design with 3D effects
- **Gallery & Collections**: User galleries and social features
- **Marketplace**: Card listings and transactions
- **PSD Import**: Photoshop file processing
- **AI Integration**: Claude Code and Agent OS setup
- **Mobile Ready**: Capacitor integration
- **Print Optimization**: Physical printing preparation

### 🚧 Current Development (Phase 1)
- **Enhanced 3D Effects**: Advanced lighting and particles
- **Social Features**: Trading rooms and community
- **Creator Monetization**: Improved revenue sharing
- **Performance Optimization**: Mobile 60fps target

### 📋 Planned Features (Phase 2)
- **3D Animation System**: Immersive card viewing
- **Physical Bridge (2026)**: Seamless physical production
- **Enterprise Features**: White-label solutions
- **Advanced Social Trading**: Physics-based trading

## Technology Stack

### Frontend
- **React 18.3.1**: Latest React with concurrent features
- **TypeScript 5.5.3**: Type-safe development
- **Vite 5.4.1**: Fast build tooling
- **Tailwind CSS 3.4.11**: Utility-first styling
- **shadcn/ui**: High-quality component library
- **Three.js 0.178.0**: 3D graphics and rendering

### Backend & Database
- **Supabase**: PostgreSQL with real-time features
- **Row Level Security**: Comprehensive data protection
- **SecureAuthProvider**: Custom secure authentication
- **Real-time Subscriptions**: Live data updates

### Mobile & Deployment
- **Capacitor 7.4.2**: Cross-platform mobile deployment
- **Progressive Web App**: Offline capabilities
- **Mobile-First Design**: Touch-optimized experience

### Development Tools
- **Claude Code**: AI-powered development assistance
- **Agent OS**: Structured development framework
- **Cursor**: Enhanced IDE integration

## Key Architecture Decisions

### Authentication
- **SecureAuthProvider**: Custom wrapper around Supabase Auth
- **Rate Limiting**: Protection against abuse
- **Password Validation**: Strong password policies
- **Row Level Security**: Database-level data protection

### Performance
- **React 18 Concurrent Features**: Smooth 60fps performance
- **Mobile-First Design**: Optimized for touch interactions
- **Progressive Loading**: Optimized asset delivery
- **Code Splitting**: Lazy loading of components

### 3D Graphics
- **Three.js with React Three Fiber**: High-quality 3D rendering
- **Framer Motion**: Advanced animations
- **Touch Optimization**: Responsive gesture controls

## Business Model

### Revenue Streams
- **Component Marketplace**: 70% creator, 30% platform
- **Premium Features**: Advanced effects and tools
- **Enterprise Solutions**: White-label packages
- **Physical Production**: Print-on-demand (2026)

### Creator Economics
- **70% Revenue Share**: Industry-leading compensation
- **Weekly Payments**: Consistent creator income
- **CRD Token Economy**: Virtual engagement points
- **No Pay-to-Win**: Success based on activity

## Development Guidelines

### Code Style
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent formatting
- **Component Structure**: Modular, reusable components

### File Organization
```
src/
├── components/          # React components
├── features/           # Feature-specific code
├── hooks/             # Custom React hooks
├── services/          # Business logic
├── types/             # TypeScript definitions
├── utils/             # Utility functions
└── styles/            # CSS and styling
```

### Naming Conventions
- **Components**: PascalCase (e.g., `CardCreator`)
- **Hooks**: camelCase with 'use' prefix (e.g., `useCardEditor`)
- **Services**: camelCase (e.g., `cardService`)
- **Types**: PascalCase with descriptive names (e.g., `CardData`)

### State Management
- **React Query**: Server state management
- **React Context**: Local state management
- **Local Storage**: Persistent user preferences
- **Supabase Real-time**: Live data updates

## Common Patterns

### Authentication Flow
```typescript
import { useSecureAuth } from '@/features/auth/providers/SecureAuthProvider';

const { user, signIn, signUp, signOut } = useSecureAuth();
```

### Card Creation
```typescript
import { useCardEditor } from '@/hooks/card-editor/useCardEditor';

const { cardData, updateCard, saveCard } = useCardEditor();
```

### Database Operations
```typescript
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase
  .from('cards')
  .select('*')
  .eq('creator_id', user.id);
```

### 3D Components
```typescript
import { Canvas } from '@react-three/fiber';
import { Card3D } from '@/components/3d/Card3D';

<Canvas>
  <Card3D cardData={cardData} />
</Canvas>
```

## Performance Considerations

### Mobile Optimization
- **60fps Target**: Smooth animations on mobile
- **Touch Gestures**: Responsive touch controls
- **Battery Optimization**: Efficient resource usage
- **Offline Support**: Progressive Web App features

### Loading Optimization
- **Lazy Loading**: Code splitting for routes
- **Image Optimization**: WebP and responsive images
- **Bundle Optimization**: Tree shaking and minification
- **Caching Strategy**: Intelligent data caching

## Security Guidelines

### Data Protection
- **Row Level Security**: Database-level access control
- **Input Validation**: Sanitize all user inputs
- **Rate Limiting**: Prevent abuse and attacks
- **Content Moderation**: AI-powered safety systems

### Authentication
- **Secure Tokens**: JWT with proper expiration
- **Password Policies**: Strong password requirements
- **Multi-factor Auth**: Enhanced security (planned)
- **Session Management**: Secure token handling

## Testing Strategy

### Unit Testing
- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing
- **TypeScript**: Type checking as testing
- **Code Coverage**: Target 90% coverage

### Integration Testing
- **API Testing**: Supabase function testing
- **Database Testing**: RLS policy verification
- **Authentication Testing**: Auth flow validation
- **Performance Testing**: Load and stress testing

## Deployment

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_ENV=development
```

### Build Commands
```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Code linting
```

### Mobile Deployment
```bash
npm run capacitor:add:ios     # Add iOS platform
npm run capacitor:add:android # Add Android platform
npm run capacitor:build       # Build mobile apps
```

## Common Issues & Solutions

### Authentication Issues
- **Problem**: "useAuth must be used within an AuthProvider"
- **Solution**: Ensure component is wrapped with SecureAuthProvider

### Performance Issues
- **Problem**: Slow 3D rendering on mobile
- **Solution**: Implement level-of-detail (LOD) system

### Database Issues
- **Problem**: RLS policy blocking legitimate access
- **Solution**: Verify user authentication and policy configuration

### Build Issues
- **Problem**: Vite configuration errors
- **Solution**: Check PostCSS and Tailwind configuration

## Future Development

### Immediate Priorities
1. **Enhanced 3D Effects**: Advanced lighting and particles
2. **Social Features**: Trading rooms and community
3. **Creator Monetization**: Improved revenue sharing
4. **Performance Optimization**: Mobile 60fps target

### Long-term Vision
1. **3D Animation System**: Immersive card viewing
2. **Physical Bridge (2026)**: Seamless physical production
3. **Enterprise Features**: White-label solutions
4. **Global Expansion**: Multi-language and currency support

## Resources

### Documentation
- [Agent OS Documentation](https://github.com/buildermethods/agent-os)
- [Supabase Documentation](https://supabase.com/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Development Tools
- **Claude Code**: AI-powered development assistance
- **Agent OS**: Structured development framework
- **Cursor**: Enhanced IDE integration
- **GitHub**: Version control and collaboration

---

*This documentation is maintained as part of the Agent OS framework and should be updated as the project evolves.* 