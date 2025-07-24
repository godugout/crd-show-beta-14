import { useEffect, useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';

interface MobileFeatures {
  // Device info
  isNative: boolean;
  platform: string;
  isIOS: boolean;
  isAndroid: boolean;
  
  // Haptic feedback
  hapticLight: () => Promise<void>;
  hapticMedium: () => Promise<void>;
  hapticHeavy: () => Promise<void>;
  hapticSelection: () => Promise<void>;
  
  // Camera
  takePhoto: () => Promise<string | null>;
  pickPhoto: () => Promise<string | null>;
  
  // Location
  getCurrentLocation: () => Promise<{ lat: number; lng: number } | null>;
  
  // Device orientation
  orientation: 'portrait' | 'landscape';
}

export const useMobileFeatures = (): MobileFeatures => {
  const [isNative, setIsNative] = useState(false);
  const [platform, setPlatform] = useState('web');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const initializeDevice = async () => {
      try {
        const info = await Device.getInfo();
        setIsNative(info.platform !== 'web');
        setPlatform(info.platform);
      } catch (error) {
        console.warn('Device info not available:', error);
      }
    };

    const handleOrientationChange = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    initializeDevice();
    handleOrientationChange();
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Haptic feedback functions
  const hapticLight = async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Light });
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const hapticMedium = async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const hapticHeavy = async () => {
    try {
      if (isNative) {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const hapticSelection = async () => {
    try {
      if (isNative) {
        await Haptics.selectionStart();
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  // Camera functions
  const takePhoto = async (): Promise<string | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      return image.webPath || null;
    } catch (error) {
      console.warn('Camera not available:', error);
      return null;
    }
  };

  const pickPhoto = async (): Promise<string | null> => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      return image.webPath || null;
    } catch (error) {
      console.warn('Photo picker not available:', error);
      return null;
    }
  };

  // Location function
  const getCurrentLocation = async (): Promise<{ lat: number; lng: number } | null> => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      return {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
    } catch (error) {
      console.warn('Location not available:', error);
      return null;
    }
  };

  const isIOS = platform === 'ios';
  const isAndroid = platform === 'android';

  return {
    isNative,
    platform,
    isIOS,
    isAndroid,
    hapticLight,
    hapticMedium,
    hapticHeavy,
    hapticSelection,
    takePhoto,
    pickPhoto,
    getCurrentLocation,
    orientation
  };
};