import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onToggleEffects: () => void;
  onToggleFullscreen: () => void;
  onResetCard: () => void;
  onToggleFlip: () => void;
  onTogglePanel: () => void;
  isActive?: boolean;
}

export const useKeyboardShortcuts = ({
  onToggleEffects,
  onToggleFullscreen,
  onResetCard,
  onToggleFlip,
  onTogglePanel,
  isActive = true
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (event.target instanceof HTMLInputElement || 
          event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          onToggleFlip();
          break;
        case 'KeyF':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onToggleFullscreen();
          }
          break;
        case 'KeyR':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onResetCard();
          }
          break;
        case 'KeyE':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onToggleEffects();
          }
          break;
        case 'KeyS':
          if (!event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            onTogglePanel();
          }
          break;
        case 'Escape':
          // Close panel if open, otherwise exit fullscreen
          event.preventDefault();
          onTogglePanel();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onToggleEffects,
    onToggleFullscreen,
    onResetCard,
    onToggleFlip,
    onTogglePanel,
    isActive
  ]);

  // Return shortcuts info for display
  return {
    shortcuts: [
      { key: 'Space', description: 'Flip card' },
      { key: 'F', description: 'Toggle fullscreen' },
      { key: 'R', description: 'Reset card' },
      { key: 'E', description: 'Toggle effects' },
      { key: 'S', description: 'Toggle studio panel' },
      { key: 'Esc', description: 'Close/exit' }
    ]
  };
};