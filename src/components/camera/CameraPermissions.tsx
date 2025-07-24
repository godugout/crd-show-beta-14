import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, AlertCircle } from 'lucide-react';

interface CameraPermissionsProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export const CameraPermissions: React.FC<CameraPermissionsProps> = ({
  onPermissionGranted,
  onPermissionDenied
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    setIsRequesting(true);
    setError(null);

    try {
      // Test camera access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      
      // Stop the test stream immediately
      stream.getTracks().forEach(track => track.stop());
      
      console.log('📷 Camera permission granted');
      onPermissionGranted?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Camera access denied';
      console.error('❌ Camera permission denied:', errorMessage);
      setError(errorMessage);
      onPermissionDenied?.();
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-center gap-2 mb-3">
        <Camera className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-medium">Camera Access</h3>
      </div>
      
      <p className="text-white/70 text-sm mb-4">
        Enable camera to show your live video feed on the 3D surface
      </p>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm mb-3">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <Button 
        onClick={requestCameraPermission}
        disabled={isRequesting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isRequesting ? 'Requesting...' : 'Enable Camera'}
      </Button>
    </div>
  );
};