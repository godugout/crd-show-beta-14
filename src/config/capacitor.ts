// Capacitor plugins registration
import { Capacitor } from '@capacitor/core';

// Register plugins conditionally
export const setupCapacitor = async () => {
  if (Capacitor.isNativePlatform()) {
    console.log('Running on native platform:', Capacitor.getPlatform());
  } else {
    console.log('Running on web platform');
  }
};