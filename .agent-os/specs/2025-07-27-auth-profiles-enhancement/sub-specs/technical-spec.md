# Technical Specification

This is the technical specification for the spec detailed in @.agent-os/specs/2025-07-27-auth-profiles-enhancement/spec.md

> Created: 2025-07-27
> Version: 1.0.0

## Technical Requirements

- Consolidate three separate profile tables (profiles, user_profiles, creator_profiles) into a single unified table
- Implement comprehensive TypeScript interfaces and types to replace all 'any' types
- Create a role-based access control system with user, creator, and admin roles
- Support multiple profile types (personal, creator, business) with conditional fields
- Implement profile completeness calculation and tracking
- Ensure backward compatibility during migration
- Maintain all existing functionality while enhancing type safety

## Approach Options

**Option A: Create New Unified Table**
- Pros: Clean slate, optimal schema design, no legacy constraints
- Cons: Complex migration, potential data loss, longer implementation

**Option B: Enhance Existing profiles Table** (Selected)
- Pros: Simpler migration, maintains existing relationships, incremental approach
- Cons: Some schema compromises, need careful field mapping

**Rationale:** Option B is selected because it minimizes risk during migration and allows for incremental improvements while maintaining system stability.

## Implementation Details

### Type System Architecture

```typescript
// Core profile types
interface BaseProfile {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface ProfileWithRole extends BaseProfile {
  role: UserRole;
  profile_type: ProfileType;
  completeness_score: number;
}

// Enums for type safety
enum UserRole {
  USER = 'user',
  CREATOR = 'creator',
  ADMIN = 'admin'
}

enum ProfileType {
  PERSONAL = 'personal',
  CREATOR = 'creator',
  BUSINESS = 'business'
}

// Conditional fields based on profile type
interface CreatorFields {
  portfolio_url?: string;
  specialties?: string[];
  commission_rates?: CommissionRates;
  stripe_account_id?: string;
  total_earnings?: number;
  verification_status?: VerificationStatus;
}

interface BusinessFields {
  business_name?: string;
  tax_id?: string;
  business_address?: Address;
}
```

### Service Layer Enhancement

The ProfileService will be completely rewritten with:
- Strong typing throughout
- Validation for all inputs
- Role-based method access
- Profile completeness calculation
- Audit logging for changes

### Migration Strategy

1. Add new fields to existing profiles table
2. Migrate data from user_profiles and creator_profiles
3. Update all references in the codebase
4. Remove deprecated tables after verification

## External Dependencies

- **zod** - Runtime type validation and schema definition
- **Justification:** Provides runtime validation that complements TypeScript's compile-time checks

- **@supabase/ssr** - Server-side rendering support for auth
- **Justification:** Better integration with React 18's server components

## Performance Considerations

- Profile data will be cached in React Query with 5-minute TTL
- Role checks will be performed at the edge using Supabase RLS
- Profile completeness will be calculated on-demand and cached
- Migration will be performed in batches of 1000 records

## Security Enhancements

- All profile updates will be logged in audit_logs table
- Sensitive fields (tax_id, stripe_account_id) will have additional RLS policies
- Admin role changes require two-factor authentication (future implementation)
- Profile deletion will be soft-delete with 30-day retention