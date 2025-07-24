import type { EnvironmentScene } from '../types';

export const ENVIRONMENT_SCENES: EnvironmentScene[] = [
  {
    id: 'forest',
    name: 'Enchanted Forest',
    type: '2d',
    icon: '🌲',
    category: 'natural',
    description: 'Mystical forest with ancient trees',
    panoramicUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #2d4a36 0%, #4a7c59 100%)',
    lighting: {
      color: '#4a7c59',
      intensity: 0.8,
      elevation: 30,
      azimuth: 45
    },
    atmosphere: {
      fog: true,
      fogColor: '#2d4a36',
      fogDensity: 0.3,
      particles: true
    },
    depth: {
      layers: 5,
      parallaxIntensity: 1.2,
      fieldOfView: 75
    }
  },
  {
    id: 'mountain',
    name: 'Mountain Vista',
    type: '2d',
    icon: '🏔️',
    category: 'natural',
    description: 'Breathtaking mountain landscape',
    panoramicUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #ffa500 0%, #ff7f50 100%)',
    lighting: {
      color: '#ffa500',
      intensity: 0.9,
      elevation: 15,
      azimuth: 60
    },
    atmosphere: {
      fog: false,
      fogColor: '#ffffff',
      fogDensity: 0.1,
      particles: false
    },
    depth: {
      layers: 7,
      parallaxIntensity: 1.5,
      fieldOfView: 85
    }
  },
  {
    id: 'crystal-cave',
    name: 'Crystal Cavern',
    type: '2d',
    icon: '💎',
    category: 'fantasy',
    description: 'Glowing crystal cave realm',
    panoramicUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #4a5ee8 0%, #7b2cbf 100%)',
    lighting: {
      color: '#4a5ee8',
      intensity: 1.1,
      elevation: 60,
      azimuth: -30
    },
    atmosphere: {
      fog: true,
      fogColor: '#4a5ee8',
      fogDensity: 0.4,
      particles: true
    },
    depth: {
      layers: 6,
      parallaxIntensity: 1.8,
      fieldOfView: 70
    }
  },
  {
    id: 'cyberpunk-city',
    name: 'Neon Metropolis',
    type: '2d',
    icon: '🌃',
    category: 'futuristic',
    description: 'Cyberpunk cityscape at night',
    panoramicUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #ff0080 0%, #00ffff 100%)',
    lighting: {
      color: '#ff0080',
      intensity: 1.2,
      elevation: 30,
      azimuth: 45
    },
    atmosphere: {
      fog: true,
      fogColor: '#ff0080',
      fogDensity: 0.2,
      particles: true
    },
    depth: {
      layers: 8,
      parallaxIntensity: 2.0,
      fieldOfView: 90
    }
  },
  {
    id: 'ancient-temple',
    name: 'Ancient Temple',
    type: '2d',
    icon: '🏛️',
    category: 'architectural',
    description: 'Majestic ancient temple ruins',
    panoramicUrl: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #d4af37 0%, #ffd700 100%)',
    lighting: {
      color: '#d4af37',
      intensity: 0.9,
      elevation: 45,
      azimuth: 0
    },
    atmosphere: {
      fog: false,
      fogColor: '#d4af37',
      fogDensity: 0.15,
      particles: false
    },
    depth: {
      layers: 6,
      parallaxIntensity: 1.3,
      fieldOfView: 80
    }
  },
  {
    id: 'space-station',
    name: 'Space Station',
    type: '2d',
    icon: '🚀',
    category: 'futuristic',
    description: 'Orbital space station interior',
    panoramicUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=4096&h=2048&fit=crop&crop=center',
    previewUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=200&fit=crop&crop=center',
    backgroundImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&h=1080&fit=crop&crop=center',
    gradient: 'linear-gradient(135deg, #00aaff 0%, #0066cc 100%)',
    lighting: {
      color: '#00aaff',
      intensity: 1.0,
      elevation: 90,
      azimuth: 0
    },
    atmosphere: {
      fog: false,
      fogColor: '#000000',
      fogDensity: 0.0,
      particles: true
    },
    depth: {
      layers: 4,
      parallaxIntensity: 0.8,
      fieldOfView: 110
    }
  }
];
