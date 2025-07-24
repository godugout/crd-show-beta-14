import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '../ui/button';

interface StudioPauseButtonProps {
  isPaused: boolean;
  onTogglePause: () => void;
}

export const StudioPauseButton: React.FC<StudioPauseButtonProps> = ({
  isPaused,
  onTogglePause
}) => {
  return (
    <button
      onClick={onTogglePause}
      className="group text-white p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center border"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(12px) saturate(180%)'
      }}
      title={isPaused ? "Resume" : "Pause"}
    >
      {isPaused ? (
        <Play className="w-4 h-4 transition-transform group-hover:scale-110" />
      ) : (
        <Pause className="w-4 h-4 transition-transform group-hover:scale-110" />
      )}
    </button>
  );
};