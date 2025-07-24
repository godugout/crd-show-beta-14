import { useEffect, useState, useCallback } from 'react';

interface SecretMenuDetectionProps {
  onActivate: () => void;
  isActive?: boolean;
}

export const useSecretMenuDetection = ({ onActivate, isActive }: SecretMenuDetectionProps) => {
  const [keySequence, setKeySequence] = useState<string[]>([]);
  const [lastKeyTime, setLastKeyTime] = useState<number>(0);

  // Secret combinations
  const SECRET_COMBOS = {
    ctrl_shift_3d: ['Control', 'Shift', 'Digit3', 'KeyD'],
    konami: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA']
  };

  const resetSequence = useCallback(() => {
    setKeySequence([]);
    setLastKeyTime(0);
  }, []);

  const checkSequence = useCallback((sequence: string[]) => {
    for (const [name, combo] of Object.entries(SECRET_COMBOS)) {
      if (sequence.length >= combo.length) {
        const lastKeys = sequence.slice(-combo.length);
        if (JSON.stringify(lastKeys) === JSON.stringify(combo)) {
          return name;
        }
      }
    }
    return null;
  }, []);

  useEffect(() => {
    if (isActive) return; // Don't detect when menu is already active

    const handleKeyDown = (event: KeyboardEvent) => {
      const now = Date.now();
      
      // Reset if too much time passed (3 seconds)
      if (now - lastKeyTime > 3000) {
        setKeySequence([event.code]);
      } else {
        setKeySequence(prev => [...prev, event.code].slice(-10)); // Keep last 10 keys
      }
      
      setLastKeyTime(now);

      // Check for matches
      const updatedSequence = keySequence.length === 0 || now - lastKeyTime > 3000 
        ? [event.code] 
        : [...keySequence, event.code].slice(-10);
      
      const match = checkSequence(updatedSequence);
      if (match) {
        event.preventDefault();
        onActivate();
        resetSequence();
        
        // Visual feedback
        document.body.style.animation = 'flash 0.3s ease-out';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 300);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keySequence, lastKeyTime, onActivate, checkSequence, resetSequence, isActive]);

  return {
    resetSequence,
    currentSequence: keySequence
  };
};