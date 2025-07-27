import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  modifiers: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  };
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    shortcuts.forEach(shortcut => {
      const { key, modifiers, action } = shortcut;
      
      // Check if the key matches (case insensitive)
      const keyMatches = event.key.toLowerCase() === key.toLowerCase() || 
                         event.code.toLowerCase() === key.toLowerCase();
      
      // Check modifiers
      const ctrlMatch = !modifiers.ctrl || event.ctrlKey || event.metaKey;
      const shiftMatch = !modifiers.shift || event.shiftKey;
      const altMatch = !modifiers.alt || event.altKey;
      const metaMatch = !modifiers.meta || event.metaKey;
      
      // Check if all required modifiers are present
      const requiredCtrl = modifiers.ctrl && (event.ctrlKey || event.metaKey);
      const requiredShift = modifiers.shift && event.shiftKey;
      const requiredAlt = modifiers.alt && event.altKey;
      const requiredMeta = modifiers.meta && event.metaKey;
      
      // Count required modifiers
      const requiredModifiers = [modifiers.ctrl, modifiers.shift, modifiers.alt, modifiers.meta].filter(Boolean).length;
      const activeModifiers = [event.ctrlKey || event.metaKey, event.shiftKey, event.altKey, event.metaKey].filter(Boolean).length;
      
      if (keyMatches && 
          (!modifiers.ctrl || requiredCtrl) &&
          (!modifiers.shift || requiredShift) &&
          (!modifiers.alt || requiredAlt) &&
          (!modifiers.meta || requiredMeta) &&
          activeModifiers >= requiredModifiers) {
        
        event.preventDefault();
        event.stopPropagation();
        action();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return { shortcuts };
};

export const useGlobalKeyboardShortcuts = () => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'l',
      modifiers: { ctrl: true, shift: true },
      action: () => {
        // Dispatch custom event for admin panel
        window.dispatchEvent(new CustomEvent('toggle-admin-panel'));
      },
      description: 'Toggle Admin Panel'
    },
    {
      key: 'k',
      modifiers: { ctrl: true },
      action: () => {
        console.log('🔍 Search shortcut triggered!');
        // Could open search modal
      },
      description: 'Open Search'
    },
    {
      key: 's',
      modifiers: { ctrl: true },
      action: () => {
        console.log('💾 Save shortcut triggered!');
        // Prevent default browser save
        event?.preventDefault();
      },
      description: 'Save Current Work'
    }
  ];

  useKeyboardShortcuts(shortcuts);
  
  return { shortcuts };
};