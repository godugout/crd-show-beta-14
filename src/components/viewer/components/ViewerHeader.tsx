
import React from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ViewerHeaderProps {
  onClose?: () => void;
  showStudioButton: boolean;
  onOpenStudio: () => void;
}

export const ViewerHeader: React.FC<ViewerHeaderProps> = ({
  onClose,
  showStudioButton,
  onOpenStudio
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onClose) {
      onClose();
    } else {
      // Use browser history to go back to previous page
      // If there's no history (direct access), fallback to gallery
      if (window.history.length > 1) {
        navigate(-1);
      } else {
        navigate('/gallery');
      }
    }
  };

  return (
    <div className="absolute top-8 left-6 right-6 z-50 flex items-center justify-between pointer-events-none">
      {/* Left: Empty space to maintain layout balance */}
      <div></div>

      {/* Right: Button group with Back and Studio buttons - aligned with navbar content level */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackClick}
          className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center justify-center px-2 py-1 h-8"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        {showStudioButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onOpenStudio}
            className="bg-black bg-opacity-50 hover:bg-opacity-70 backdrop-blur border border-white/20 text-white flex items-center space-x-2 px-2 py-1 h-8"
          >
            <Sparkles className="w-4 h-4 text-crd-green" />
            <span className="text-sm font-medium">Studio</span>
          </Button>
        )}
      </div>
    </div>
  );
};
