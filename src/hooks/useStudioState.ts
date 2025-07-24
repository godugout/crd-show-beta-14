import { useState, useEffect } from 'react';

const STUDIO_TAB_KEY = 'crd-studio-last-tab';

export const useStudioState = () => {
  const [activeTab, setActiveTab] = useState<string>('materials');

  // Load persisted tab on mount
  useEffect(() => {
    const savedTab = localStorage.getItem(STUDIO_TAB_KEY);
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  // Save tab changes to localStorage
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    localStorage.setItem(STUDIO_TAB_KEY, tabId);
  };

  return {
    activeTab,
    setActiveTab: handleTabChange,
  };
};