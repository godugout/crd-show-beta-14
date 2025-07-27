# CRDMKR Tool Architecture & Implementation

## Overview

CRDMKR is a comprehensive PSD-to-CRD conversion tool that transforms Photoshop designs into professional card templates. The tool provides a complete workflow from PSD upload to frame generation and template export.

## Architecture Components

### 1. Frontend Components

#### Core Pages
- **`/crdmkr`** - Main CRDMKR Studio page with tabbed interface
- **`/crdmkr/psd-review`** - PSD review and layer management page

#### Component Structure
```
src/components/psd/
├── PSDProcessor.tsx          # Layer processing and categorization
├── LayerManager.tsx          # Drag-and-drop layer organization
├── FrameGenerator.tsx        # Frame variation generation
└── PSDUploadZone.tsx        # File upload interface

src/pages/
├── CRDMaker.tsx             # Main CRDMKR Studio page
└── CRDMKRPSDReviewPage.tsx  # PSD review page
```

### 2. Backend Services

#### PSD Processing Service
- **`src/services/psd/psdProcessingService.ts`** - Core processing logic
- **`src/services/psd/psdStorage.ts`** - File storage management
- **`src/services/psdCacheService.ts`** - Caching and optimization

#### Key Features
- File validation and upload
- Layer extraction and processing
- Frame generation with variations
- Progress tracking and error handling
- Database persistence with Supabase

### 3. Database Schema

#### Required Tables
```sql
-- PSD Processing Jobs
CREATE TABLE crdmkr_processing_jobs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  progress INTEGER DEFAULT 0,
  step TEXT,
  layers JSONB,
  frames JSONB,
  options JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- PSD Layers Cache
CREATE TABLE crdmkr_layers (
  id UUID PRIMARY KEY,
  job_id UUID REFERENCES crdmkr_processing_jobs(id),
  layer_data JSONB NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### Storage Buckets
- **`psd-uploads`** - Original PSD files
- **`psd-layers`** - Extracted layer images
- **`psd-originals`** - Backup of original files

## Implementation Phases

### Phase 1: Core Infrastructure ✅
- [x] CRDMKR Studio page with welcome interface
- [x] PSD upload and validation
- [x] Basic processing workflow
- [x] Route integration in App.tsx

### Phase 2: Processing Engine ✅
- [x] PSD file parsing with ag-psd library
- [x] Layer extraction and categorization
- [x] Progress tracking and status updates
- [x] Error handling and recovery

### Phase 3: Layer Management ✅
- [x] Layer categorization (backgrounds, characters, effects, text)
- [x] Drag-and-drop layer organization
- [x] Active composition vs elements bucket
- [x] Layer visibility and selection controls

### Phase 4: Frame Generation ✅
- [x] Multiple frame variations (Classic, Modern, Premium, Legendary)
- [x] Frame preview and selection
- [x] Export functionality to CRD templates
- [x] Rarity system and styling

### Phase 5: Integration & Polish
- [ ] Template selection promotion
- [ ] User authentication integration
- [ ] Performance optimization
- [ ] Advanced frame generation algorithms

## User Flow

### 1. Welcome & Onboarding
```
User visits /crdmkr
↓
Welcome screen with feature overview
↓
"Start Converting PSD Files" button
```

### 2. File Upload
```
PSD file selection
↓
File validation (size, format)
↓
Upload to Supabase storage
↓
Create processing job
```

### 3. Processing
```
PSD file parsing
↓
Layer extraction
↓
Image processing and optimization
↓
Frame generation
↓
Completion status
```

### 4. Layer Management
```
Layer categorization display
↓
Drag-and-drop organization
↓
Active composition selection
↓
Layer visibility controls
```

### 5. Frame Generation
```
Multiple frame variations
↓
Frame preview and selection
↓
Export to CRD templates
↓
Integration with card creator
```

## Technical Implementation

### PSD Processing Pipeline

```typescript
// 1. File Upload
const job = await psdProcessingService.uploadPSDFile(file, userId);

// 2. PSD Parsing
const { parsePSD } = await import('@/components/editor/crd/import/CRDPSDProcessor');
const result = await parsePSD(file);

// 3. Layer Processing
const processedLayers = await this.processLayers(result.layers, jobId);

// 4. Frame Generation
const frames = await this.generateFrames(processedLayers, jobId);
```

### Layer Categorization Logic

```typescript
const categorizeLayers = (layers: PSDLayer[]) => {
  const categories = {
    backgrounds: [],
    characters: [],
    effects: [],
    text: [],
    other: []
  };

  layers.forEach(layer => {
    const name = layer.name.toLowerCase();
    if (name.includes('background') || name.includes('bg')) {
      categories.backgrounds.push(layer);
    } else if (name.includes('character') || name.includes('player')) {
      categories.characters.push(layer);
    } else if (name.includes('effect') || name.includes('glow')) {
      categories.effects.push(layer);
    } else if (name.includes('text') || name.includes('title')) {
      categories.text.push(layer);
    } else {
      categories.other.push(layer);
    }
  });

  return categories;
};
```

### Frame Generation Algorithm

```typescript
const frameVariations = [
  { name: 'Classic Frame', style: 'classic', rarity: 'common' },
  { name: 'Modern Frame', style: 'modern', rarity: 'rare' },
  { name: 'Premium Frame', style: 'premium', rarity: 'epic' },
  { name: 'Legendary Frame', style: 'legendary', rarity: 'legendary' }
];

const generateFrames = (layers: PSDLayer[]) => {
  const visibleLayers = layers.filter(l => l.visible && l.bounds.width > 0);
  
  return frameVariations.map((variation, index) => ({
    id: `frame_${Date.now()}_${index}`,
    name: variation.name,
    style: variation.style,
    rarity: variation.rarity,
    layers: visibleLayers.map(l => l.id),
    createdAt: new Date().toISOString()
  }));
};
```

## Integration Points

### 1. Template Selection Promotion
- Added CRDMKR promotion card to template selection
- Links to `/crdmkr` route
- Premium tool branding with crown icon

### 2. Card Creator Integration
- Export frames as CRD templates
- Seamless transition to card creation
- Preserve layer information and styling

### 3. User Authentication
- User-specific processing jobs
- Job history and management
- Storage quota management

## Performance Considerations

### 1. File Size Limits
- Maximum PSD file size: 100MB
- Layer image optimization
- Progressive loading for large files

### 2. Processing Optimization
- Background processing with Web Workers
- Caching of processed layers
- Incremental progress updates

### 3. Memory Management
- Streaming file processing
- Cleanup of temporary resources
- Garbage collection optimization

## Error Handling

### 1. File Validation
```typescript
if (file.size > maxFileSize) {
  throw new Error(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
}

if (!file.name.toLowerCase().endsWith('.psd')) {
  throw new Error('Only PSD files are supported');
}
```

### 2. Processing Recovery
```typescript
try {
  const result = await processPSD(file);
  return result;
} catch (error) {
  await updateJobStatus(jobId, 'failed', 0, error.message);
  throw error;
}
```

### 3. User Feedback
- Real-time progress updates
- Clear error messages
- Retry mechanisms for failed operations

## Future Enhancements

### 1. Advanced Features
- AI-powered layer categorization
- Automatic frame style suggestions
- Batch processing for multiple PSDs
- Advanced layer effects preservation

### 2. Performance Improvements
- WebAssembly for PSD parsing
- GPU acceleration for image processing
- Distributed processing for large files
- Intelligent caching strategies

### 3. User Experience
- Drag-and-drop from desktop
- Real-time preview generation
- Collaborative editing features
- Template marketplace integration

## Development Guidelines

### 1. Code Organization
- Separate concerns: UI, processing, storage
- TypeScript for type safety
- Comprehensive error handling
- Unit tests for critical functions

### 2. Performance Best Practices
- Lazy loading of heavy components
- Debounced user interactions
- Efficient state management
- Memory leak prevention

### 3. User Experience
- Intuitive drag-and-drop interfaces
- Clear progress indicators
- Helpful error messages
- Responsive design for all devices

## Conclusion

The CRDMKR tool provides a comprehensive solution for converting Photoshop designs into CRD templates. The architecture is designed for scalability, performance, and user experience, with clear separation of concerns and robust error handling.

The implementation follows modern React patterns with TypeScript for type safety, integrates seamlessly with the existing CRD ecosystem, and provides a professional-grade tool for content creators. 