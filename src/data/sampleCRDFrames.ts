import type { CRDFrame } from '@/types/crd-frame';

export const SAMPLE_CRD_FRAMES: CRDFrame[] = [
  {
    id: 'classic-sports-1',
    name: 'Classic Sports Frame',
    category: 'sports',
    version: '1.0.0',
    description: 'Professional sports card frame with CRD elements and 4-color theme support',
    frame_config: {
      dimensions: {
        width: 400,
        height: 560
      },
      regions: [
        {
          id: 'main-photo',
          type: 'photo',
          name: 'Main Card Image',
          bounds: { x: 8, y: 28, width: 384, height: 468 },
          shape: 'rectangle',
          constraints: {
            aspectRatio: 384/468,
            position: 'fixed',
            scalable: true
          },
          styling: {
            border: { width: 0, style: 'solid', color: 'transparent' },
            background: { type: 'color', value: 'transparent' }
          },
          cropSettings: {
            enabled: true,
            aspectRatio: 384/468,
            allowRotation: true,
            allowBackgroundRemoval: true
          }
        }
      ],
      elements: [
        {
          id: 'primary-frame',
          type: 'shape',
          name: 'Primary Frame Border',
          properties: {
            position: { x: 0, y: 0 },
            size: { width: 400, height: 560 },
            color: '#3B82F6'
          },
          behavior: { responsive: true },
          variations: []
        },
        {
          id: 'catalog-header',
          type: 'text',
          name: 'CRD Catalog Header',
          properties: {
            position: { x: 4, y: 4 },
            size: { width: 392, height: 20 },
            color: '#FFFFFF'
          },
          behavior: { responsive: true },
          variations: []
        },
        {
          id: 'card-footer',
          type: 'text',
          name: 'Card Footer Text',
          properties: {
            position: { x: 4, y: 536 },
            size: { width: 392, height: 20 },
            color: '#FFFFFF'
          },
          behavior: { responsive: true },
          variations: []
        }
      ]
    },
    included_elements: ['primary-frame', 'catalog-header', 'card-footer'],
    is_public: true,
    price_cents: 0,
    rating_average: 4.7,
    rating_count: 234,
    download_count: 2156,
    tags: ['sports', 'professional', 'crd-compliant'],
    creator_id: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'fantasy-mystical-1',
    name: 'Mystical Fantasy Frame',
    category: 'fantasy',
    version: '1.0.0',
    description: 'Fantasy-themed CRD frame with magical elements and 4-color theme support',
    frame_config: {
      dimensions: {
        width: 400,
        height: 560
      },
      regions: [
        {
          id: 'main-photo',
          type: 'photo',
          name: 'Character Portrait',
          bounds: { x: 12, y: 40, width: 376, height: 440 },
          shape: 'rectangle',
          constraints: {
            aspectRatio: 376/440,
            position: 'fixed',
            scalable: true
          },
          styling: {
            border: { width: 2, style: 'solid', color: 'primary' },
            background: { type: 'gradient', value: 'mystical' }
          },
          cropSettings: {
            enabled: true,
            aspectRatio: 376/440,
            allowRotation: true,
            allowBackgroundRemoval: true
          }
        }
      ],
      elements: [
        {
          id: 'fantasy-frame',
          type: 'shape',
          name: 'Fantasy Frame Border',
          properties: {
            position: { x: 0, y: 0 },
            size: { width: 400, height: 560 },
            color: '#8B5CF6'
          },
          behavior: { responsive: true },
          variations: []
        },
        {
          id: 'fantasy-header',
          type: 'text',
          name: 'Fantasy Header',
          properties: {
            position: { x: 8, y: 8 },
            size: { width: 384, height: 24 },
            color: '#FFFFFF'
          },
          behavior: { responsive: true },
          variations: []
        },
        {
          id: 'fantasy-footer',
          type: 'text',
          name: 'Character Name',
          properties: {
            position: { x: 8, y: 528 },
            size: { width: 384, height: 24 },
            color: '#FFFFFF'
          },
          behavior: { responsive: true },
          variations: []
        }
      ]
    },
    included_elements: ['fantasy-frame', 'fantasy-header', 'fantasy-footer'],
    is_public: true,
    price_cents: 200,
    rating_average: 4.9,
    rating_count: 167,
    download_count: 1893,
    tags: ['fantasy', 'mystical', 'crd-compliant', 'premium'],
    creator_id: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'full-bleed-back',
    name: 'CRD Card Back',
    category: 'default',
    version: '1.0.0',
    description: 'Full bleed CRD card back with centered logo and gradient background',
    frame_config: {
      dimensions: {
        width: 400,
        height: 560
      },
      regions: [],
      elements: [
        {
          id: 'background-gradient',
          type: 'shape',
          name: 'Background Gradient',
          properties: {
            position: { x: 0, y: 0 },
            size: { width: 400, height: 560 },
            color: '#1E40AF'
          },
          behavior: { responsive: true },
          variations: []
        },
        {
          id: 'crd-logo',
          type: 'image',
          name: 'CRD Logo',
          properties: {
            position: { x: 150, y: 200 },
            size: { width: 100, height: 100 },
            src: '/crd-logo-gradient.png',
            alt: 'CRD Logo'
          },
          behavior: { responsive: true },
          variations: []
        },
        {
          id: 'catalog-bottom',
          type: 'text',
          name: 'Catalog Number',
          properties: {
            position: { x: 50, y: 580 },
            size: { width: 150, height: 16 },
            color: '#FFFFFF'
          },
          behavior: { responsive: true },
          variations: []
        },
        {
          id: 'series-bottom',
          type: 'text',
          name: 'Series Number',
          properties: {
            position: { x: 200, y: 580 },
            size: { width: 150, height: 16 },
            color: '#FFFFFF'
          },
          behavior: { responsive: true },
          variations: []
        }
      ]
    },
    included_elements: ['background-gradient', 'crd-logo', 'catalog-bottom', 'series-bottom'],
    is_public: true,
    price_cents: 0,
    rating_average: 5.0,
    rating_count: 1,
    download_count: 1,
    tags: ['default', 'card-back', 'crd-logo', 'full-bleed'],
    creator_id: undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];