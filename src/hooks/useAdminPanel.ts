import { useState, useEffect } from 'react';
import { useGlobalKeyboardShortcuts } from './useKeyboardShortcuts';

export const useAdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize global shortcuts
  useGlobalKeyboardShortcuts();

  useEffect(() => {
    const handleToggle = () => {
      setIsOpen(prev => !prev);
    };

    // Listen for custom events from keyboard shortcuts
    window.addEventListener('toggle-admin-panel', handleToggle);
    
    return () => {
      window.removeEventListener('toggle-admin-panel', handleToggle);
    };
  }, []);

  return {
    isOpen,
    setIsOpen,
    toggle: () => setIsOpen(prev => !prev),
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  };
};