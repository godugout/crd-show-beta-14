# Enhanced CRDMKR - Advanced PSD to CRD Frame Converter

## Overview

The Enhanced CRDMKR is a comprehensive, modern card creation interface that converts Photoshop (PSD) files into CRD (Card) frames with advanced features, effects, and export capabilities. Built with React 18, TypeScript, and Framer Motion for smooth animations.

## Features

### 🚀 Core Features

- **Advanced PSD Processing**: Web Worker-based PSD parsing and layer extraction
- **Drag & Drop Upload**: Intuitive file upload with validation and progress tracking
- **Layer Management**: Visual layer organization with drag-and-drop reordering
- **Premium Effects**: Holographic, foil, chrome, glow, and shadow effects
- **Frame Generation**: Multiple frame variations with different effects and rarities
- **Export Options**: PNG, JPG, SVG, and PDF export with quality controls
- **Studio Integration**: Seamless export to CRD Studio for advanced editing

### 🎨 Design Features

- **Modern UI**: Dark theme with CRD brand colors and gradients
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Smooth Animations**: Framer Motion-powered transitions and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support
- **Loading States**: Progress indicators and skeleton loading

### 🔧 Technical Features

- **TypeScript**: Full type safety with comprehensive interfaces
- **Web Workers**: Background processing for large PSD files
- **Error Handling**: Graceful error recovery and user feedback
- **Performance**: Optimized rendering and memory management
- **Modular Architecture**: Reusable components with clear separation of concerns

## Components

### EnhancedCRDMaker

The main component that orchestrates the entire CRDMKR workflow.

```tsx
import { EnhancedCRDMaker } from '@/components/crdmkr/EnhancedCRDMaker';

<EnhancedCRDMaker />;
```

**Features:**

- Multi-step workflow (Upload → Process → Organize → Effects → Export)
- Progress tracking and status management
- Integration with PSD processing workers
- Frame generation and export capabilities

### PSDUploadZone

Specialized upload component with drag-and-drop functionality.

```tsx
import { PSDUploadZone } from '@/components/crdmkr/PSDUploadZone';

<PSDUploadZone
  onFilesSelected={files => console.log(files)}
  maxFileSize={500} // MB
  maxFiles={10}
  acceptedFormats={['.psd', '.psb']}
/>;
```

**Features:**

- Drag and drop file upload
- File validation and error handling
- Progress tracking for uploads
- Visual feedback and animations

### LayerManager

Advanced layer management with visual controls.

```tsx
import { LayerManager } from '@/components/crdmkr/LayerManager';

<LayerManager
  activeLayers={activeLayers}
  elementsBucket={elementsBucket}
  onLayerMove={handleLayerMove}
  onLayerVisibilityChange={handleVisibilityChange}
  onLayerOpacityChange={handleOpacityChange}
  onLayerBlendModeChange={handleBlendModeChange}
  onLayerLockChange={handleLockChange}
  onLayerReorder={handleReorder}
  onLayerDuplicate={handleDuplicate}
  onLayerDelete={handleDelete}
/>;
```

**Features:**

- Visual layer organization
- Layer visibility and opacity controls
- Blend mode selection
- Layer locking and unlocking
- Drag-and-drop reordering
- Layer duplication and deletion

### EffectsPanel

Premium effects application with presets and customization.

```tsx
import { EffectsPanel } from '@/components/crdmkr/EffectsPanel';

<EffectsPanel
  effects={effects}
  onEffectToggle={handleEffectToggle}
  onEffectIntensityChange={handleIntensityChange}
  onEffectPropertyChange={handlePropertyChange}
  onResetEffects={handleResetEffects}
  onApplyPreset={handleApplyPreset}
/>;
```

**Features:**

- Holographic, foil, chrome, glow, and shadow effects
- Effect intensity and property controls
- Pre-built effect presets
- Real-time preview
- Advanced effect settings

### FrameExport

Comprehensive frame export with metadata editing.

```tsx
import { FrameExport } from '@/components/crdmkr/FrameExport';

<FrameExport
  frames={generatedFrames}
  selectedFrame={selectedFrame}
  onFrameSelect={handleFrameSelect}
  onFrameEdit={handleFrameEdit}
  onFrameExport={handleFrameExport}
  onFrameShare={handleFrameShare}
  onFrameDuplicate={handleFrameDuplicate}
  onFrameDelete={handleFrameDelete}
  onExportToStudio={handleExportToStudio}
/>;
```

**Features:**

- Frame preview and selection
- Metadata editing (name, description, rarity, etc.)
- Export format and quality controls
- Studio integration
- Frame sharing and duplication

## Usage

### Basic Implementation

```tsx
import React from 'react';
import { EnhancedCRDMaker } from '@/components/crdmkr/EnhancedCRDMaker';

const MyCRDMakerPage: React.FC = () => {
  return (
    <div className='min-h-screen bg-crd-darkest'>
      <EnhancedCRDMaker />
    </div>
  );
};

export default MyCRDMakerPage;
```

### Advanced Implementation with Custom Handlers

```tsx
import React, { useState, useCallback } from 'react';
import { EnhancedCRDMaker } from '@/components/crdmkr/EnhancedCRDMaker';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdvancedCRDMakerPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleComplete = useCallback(
    (cardData: any) => {
      console.log('CRDMKR process completed:', cardData);
      toast.success('CRD frames generated successfully!');
      navigate('/create/crd', {
        state: {
          importedFrames: cardData,
          source: 'crdmkr',
        },
      });
    },
    [navigate]
  );

  const handleError = useCallback((error: Error) => {
    console.error('CRDMKR error:', error);
    toast.error('An error occurred during processing');
  }, []);

  return (
    <div className='min-h-screen bg-crd-darkest'>
      <EnhancedCRDMaker
        onComplete={handleComplete}
        onError={handleError}
        isProcessing={isProcessing}
      />
    </div>
  );
};

export default AdvancedCRDMakerPage;
```

## Configuration

### PSD Processing Options

```tsx
const psdProcessingOptions = {
  maxFileSize: 500, // MB
  supportedFormats: ['.psd', '.psb'],
  enableWebWorkers: true,
  enableProgressTracking: true,
  enableErrorRecovery: true,
};
```

### Effects Configuration

```tsx
const effectsConfig = {
  holographic: {
    enabled: true,
    intensity: 75,
    color: 'rainbow',
    animation: true,
  },
  foil: {
    enabled: true,
    intensity: 60,
    color: 'gold',
    animation: false,
  },
  chrome: {
    enabled: false,
    intensity: 50,
    color: 'silver',
    animation: false,
  },
};
```

### Export Options

```tsx
const exportOptions = {
  format: 'png',
  quality: 95,
  resolution: 300,
  includeMetadata: true,
  watermark: false,
  compression: 'high',
};
```

## API Reference

### EnhancedCRDMaker Props

| Prop           | Type                      | Description                     |
| -------------- | ------------------------- | ------------------------------- |
| `onComplete`   | `(cardData: any) => void` | Callback when process completes |
| `onError`      | `(error: Error) => void`  | Error handler                   |
| `onCancel`     | `() => void`              | Cancel handler                  |
| `isProcessing` | `boolean`                 | Processing state                |
| `className`    | `string`                  | Additional CSS classes          |

### PSDLayer Interface

```tsx
interface PSDLayer {
  id: string;
  name: string;
  type:
    | 'background'
    | 'character'
    | 'effect'
    | 'text'
    | 'logo'
    | 'shape'
    | 'image';
  preview: string;
  isActive: boolean;
  isVisible: boolean;
  isLocked: boolean;
  opacity: number;
  blendMode: string;
  bounds: { x: number; y: number; width: number; height: number };
  metadata: {
    color?: string;
    fontSize?: number;
    fontFamily?: string;
    effects?: string[];
    filters?: any[];
  };
}
```

### CRDFrame Interface

```tsx
interface CRDFrame {
  id: string;
  name: string;
  description: string;
  preview: string;
  layers: PSDLayer[];
  effects: {
    holographic: boolean;
    foil: boolean;
    chrome: boolean;
    glow: boolean;
    shadow: boolean;
  };
  metadata: {
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    series: string;
    edition: string;
    year: number;
    creator: string;
    tags: string[];
    category: string;
    license: string;
  };
  exportOptions: {
    format: 'png' | 'jpg' | 'svg' | 'pdf';
    quality: number;
    resolution: number;
    includeMetadata: boolean;
    watermark: boolean;
  };
}
```

## Styling

The CRDMKR components use the CRD design system with the following color palette:

```css
:root {
  --crd-darkest: #121212;
  --crd-darker: #1a1a1a;
  --crd-dark: #23262f;
  --crd-mediumGray: #353945;
  --crd-lightGray: #777e90;
  --crd-white: #fcfcfd;
  --crd-orange: #f97316;
  --crd-blue: #3772ff;
  --crd-green: #45b26b;
  --crd-purple: #9757d7;
  --crd-gold: #ffd700;
}
```

## Performance Considerations

1. **Web Workers**: PSD processing runs in background threads
2. **Lazy Loading**: Components load on demand
3. **Virtual Scrolling**: For large layer lists
4. **Image Optimization**: Automatic compression and resizing
5. **Memory Management**: Proper cleanup of file handles and canvases

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

```json
{
  "react": "^18.3.1",
  "framer-motion": "^12.23.6",
  "lucide-react": "^0.462.0",
  "tailwindcss": "^3.4.11",
  "class-variance-authority": "^0.7.0"
}
```

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new features
3. Include proper error handling
4. Add unit tests for new components
5. Update documentation for API changes

## License

MIT License - see LICENSE file for details.
