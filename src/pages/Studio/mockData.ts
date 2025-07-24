
import type { CardData } from '@/types/card';

export const mockCards: CardData[] = [
  {
    id: '498e5467-7818-49a3-9a19-4a3bc2995fc7',
    title: 'Mystic Dragon',
    description: 'A legendary dragon card with mystical powers',
    rarity: 'legendary',
    tags: ['dragon', 'fantasy', 'legendary'],
    image_url: '/lovable-uploads/cd4cf59d-5ff5-461d-92e9-61b6e2c63e2e.png',
    design_metadata: {
      background: 'mystical',
      effects: {
        chrome: false,
        holographic: true,
        foil: false
      },
      effectIntensity: 0.8,
      colorScheme: 'purple-gold'
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Studio Artist',
      creator_id: 'studio-artist-1',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: {
        base_price: 25.99,
        currency: 'USD'
      },
      distribution: {
        limited_edition: true,
        edition_size: 1000
      }
    },
    verification_status: 'verified',
    view_count: 1250,
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    title: 'Crystal Warrior',
    description: 'A rare warrior forged from pure crystal',
    rarity: 'rare',
    tags: ['warrior', 'crystal', 'rare'],
    image_url: '/lovable-uploads/5e4b9905-1b9a-481e-b51d-9cf0bda7ff0f.png',
    design_metadata: {
      background: 'crystalline',
      effects: {
        chrome: true,
        holographic: false,
        foil: true
      },
      effectIntensity: 0.6,
      colorScheme: 'blue-white'
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Crystal Studios',
      creator_id: 'crystal-studios-1',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: {
        base_price: 15.99,
        currency: 'USD'
      },
      distribution: {
        limited_edition: false
      }
    },
    verification_status: 'verified',
    view_count: 840,
    created_at: '2024-01-20T14:15:00Z'
  },
  {
    id: 'f7e8d9c0-b1a2-3456-789a-bcdef0123456',
    title: 'Shadow Assassin',
    description: 'An epic assassin that strikes from the shadows',
    rarity: 'epic',
    tags: ['assassin', 'shadow', 'stealth'],
    image_url: '/lovable-uploads/68c31062-5697-489f-a2f1-8ff47d5f5e1e.png',
    design_metadata: {
      background: 'dark',
      effects: {
        chrome: false,
        holographic: false,
        foil: false
      },
      effectIntensity: 0.4,
      colorScheme: 'black-purple'
    },
    visibility: 'public',
    creator_attribution: {
      creator_name: 'Shadow Arts',
      creator_id: 'shadow-arts-1',
      collaboration_type: 'solo'
    },
    publishing_options: {
      marketplace_listing: true,
      crd_catalog_inclusion: true,
      print_available: true,
      pricing: {
        base_price: 19.99,
        currency: 'USD'
      },
      distribution: {
        limited_edition: true,
        edition_size: 500
      }
    },
    verification_status: 'verified',
    view_count: 2100,
    created_at: '2024-01-10T09:45:00Z'
  }
];
