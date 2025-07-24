import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.b5faa15542074453a05e86da17e6aaaa',
  appName: 'cardshow-55',
  webDir: 'dist',
  server: {
    url: 'https://b5faa155-4207-4453-a05e-86da17e6aaaa.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Haptics: {},
    Camera: {
      permissions: {
        camera: 'Camera access is required to capture card photos',
        photos: 'Photo library access is required to select images'
      }
    },
    Geolocation: {
      permissions: {
        location: 'Location access is required for location-based features'
      }
    }
  }
};

export default config;