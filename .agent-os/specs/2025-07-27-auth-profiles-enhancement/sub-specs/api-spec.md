# API Specification

This is the API specification for the spec detailed in @.agent-os/specs/2025-07-27-auth-profiles-enhancement/spec.md

> Created: 2025-07-27
> Version: 1.0.0

## Service Layer APIs

### ProfileService Class

```typescript
class ProfileService {
  // Core profile operations
  async getProfile(userId: string): Promise<ProfileWithRole>
  async updateProfile(userId: string, updates: ProfileUpdateData): Promise<ProfileWithRole>
  async deleteProfile(userId: string): Promise<void>
  async restoreProfile(userId: string): Promise<ProfileWithRole>
  
  // Role management (admin only)
  async updateUserRole(userId: string, newRole: UserRole): Promise<ProfileWithRole>
  async getUsersByRole(role: UserRole): Promise<ProfileWithRole[]>
  
  // Profile type operations
  async upgradeToCreator(userId: string): Promise<ProfileWithRole>
  async upgradeToBusinessProfile(userId: string, businessData: BusinessProfileData): Promise<ProfileWithRole>
  
  // Profile completeness
  async getProfileCompleteness(userId: string): Promise<ProfileCompleteness>
  async getIncompleteFields(userId: string): Promise<string[]>
  
  // Search and discovery
  async searchProfiles(query: string, filters?: ProfileSearchFilters): Promise<ProfileWithRole[]>
  async getPublicProfile(username: string): Promise<PublicProfileData>
  
  // Verification
  async requestVerification(userId: string, documents: VerificationDocuments): Promise<void>
  async updateVerificationStatus(userId: string, status: VerificationStatus): Promise<void>
}
```

### React Hooks API

```typescript
// Profile management hooks
function useProfile(userId?: string): {
  profile: ProfileWithRole | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

function useUpdateProfile(): {
  updateProfile: (updates: ProfileUpdateData) => Promise<ProfileWithRole>
  isUpdating: boolean
  error: Error | null
}

function useProfileCompleteness(): {
  completeness: ProfileCompleteness | null
  incompleteFields: string[]
  isLoading: boolean
}

// Role-based access hooks
function useUserRole(): UserRole | null
function useHasPermission(permission: string, resource: string): boolean
function useIsCreator(): boolean
function useIsAdmin(): boolean

// Profile discovery hooks
function usePublicProfile(username: string): {
  profile: PublicProfileData | null
  isLoading: boolean
  error: Error | null
}

function useProfileSearch(query: string, filters?: ProfileSearchFilters): {
  results: ProfileWithRole[]
  isSearching: boolean
  error: Error | null
}
```

### Type Definitions

```typescript
interface ProfileUpdateData {
  username?: string
  full_name?: string
  bio?: string
  avatar_url?: string
  location?: string
  website?: string
  privacy_settings?: PrivacySettings
  
  // Creator-specific fields
  portfolio_url?: string
  specialties?: string[]
  commission_rates?: CommissionRates
  
  // Business-specific fields
  business_name?: string
  business_address?: Address
}

interface ProfileSearchFilters {
  role?: UserRole
  profile_type?: ProfileType
  verification_status?: VerificationStatus
  created_after?: Date
  created_before?: Date
  has_avatar?: boolean
  min_completeness?: number
}

interface ProfileCompleteness {
  score: number // 0-100
  completed_fields: string[]
  incomplete_fields: string[]
  suggestions: CompletionSuggestion[]
}

interface CompletionSuggestion {
  field: string
  importance: 'high' | 'medium' | 'low'
  description: string
  points: number
}

interface PrivacySettings {
  profile_public: boolean
  show_email: boolean
  show_location: boolean
  show_activity: boolean
}

interface VerificationDocuments {
  id_document?: File
  proof_of_address?: File
  business_registration?: File
}
```

### API Error Handling

```typescript
class ProfileError extends Error {
  constructor(
    message: string,
    public code: ProfileErrorCode,
    public details?: any
  ) {
    super(message)
  }
}

enum ProfileErrorCode {
  PROFILE_NOT_FOUND = 'PROFILE_NOT_FOUND',
  USERNAME_TAKEN = 'USERNAME_TAKEN',
  INVALID_ROLE = 'INVALID_ROLE',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  VERIFICATION_FAILED = 'VERIFICATION_FAILED',
  INVALID_PROFILE_DATA = 'INVALID_PROFILE_DATA',
  MIGRATION_ERROR = 'MIGRATION_ERROR'
}
```

### Validation Schemas

```typescript
import { z } from 'zod'

const ProfileUpdateSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  full_name: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatar_url: z.string().url().optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional(),
  privacy_settings: z.object({
    profile_public: z.boolean(),
    show_email: z.boolean(),
    show_location: z.boolean(),
    show_activity: z.boolean()
  }).optional()
})

const CreatorProfileSchema = ProfileUpdateSchema.extend({
  portfolio_url: z.string().url().optional(),
  specialties: z.array(z.string()).max(10).optional(),
  commission_rates: z.object({
    base_rate: z.number().min(0).max(100),
    rush_rate: z.number().min(0).max(200),
    bulk_discount: z.number().min(0).max(50)
  }).optional()
})

const BusinessProfileSchema = ProfileUpdateSchema.extend({
  business_name: z.string().min(2).max(100),
  tax_id: z.string().optional(),
  business_address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
    country: z.string()
  }).optional()
})
```

### Migration Endpoints

These are temporary endpoints for the migration process:

```typescript
// Admin-only migration endpoints
async function migrateUserProfiles(): Promise<MigrationResult>
async function migrateCreatorProfiles(): Promise<MigrationResult>
async function verifyMigration(): Promise<MigrationVerification>
async function rollbackMigration(): Promise<void>

interface MigrationResult {
  total_records: number
  migrated: number
  failed: number
  errors: MigrationError[]
}

interface MigrationError {
  user_id: string
  error: string
  details: any
}

interface MigrationVerification {
  profiles_count: number
  user_profiles_count: number
  creator_profiles_count: number
  discrepancies: Discrepancy[]
}
```

### Rate Limiting

All profile update operations will be rate-limited:
- Profile updates: 10 per hour per user
- Avatar uploads: 5 per hour per user
- Username changes: 1 per week per user
- Role changes: Admin action only, logged

### Caching Strategy

```typescript
// React Query cache keys
const profileKeys = {
  all: ['profiles'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  list: (filters: ProfileSearchFilters) => [...profileKeys.lists(), filters] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (id: string) => [...profileKeys.details(), id] as const,
  completeness: (id: string) => [...profileKeys.all, 'completeness', id] as const,
}

// Cache invalidation
function invalidateProfile(userId: string) {
  queryClient.invalidateQueries(profileKeys.detail(userId))
  queryClient.invalidateQueries(profileKeys.completeness(userId))
}
```