import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, AlertCircle } from 'lucide-react';
import { useCameraTexture } from '@/hooks/useCameraTexture';

interface CameraPermissionsProps {
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
}

export const CameraPermissions: React.FC<CameraPermissionsProps> = ({
  onPermissionGranted,
  onPermissionDenied
}) => {
  const { startCamera, isActive, error, hasPermission } = useCameraTexture();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleCameraRequest = async () => {
    setIsRequesting(true);
    try {
      await startCamera();
      onPermissionGranted?.();
    } catch (err) {
      onPermissionDenied?.();
    } finally {
      setIsRequesting(false);
    }
  };

  // Don't show if camera is already active
  if (isActive) return null;

  return (
    <div className="fixed top-4 right-4 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-4 max-w-sm z-overlay-controls shadow-2xl">
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
        onClick={handleCameraRequest}
        disabled={isRequesting}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isRequesting ? 'Requesting...' : 'Enable Camera'}
      </Button>
    </div>
  );
};