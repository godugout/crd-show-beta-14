import { useCallback } from 'react';

interface MonetizationEvent {
  event: string;
  data: Record<string, any>;
  timestamp: number;
}

export const useMonetizationTracking = () => {
  const trackEvent = useCallback((eventName: string, data: Record<string, any> = {}) => {
    const event: MonetizationEvent = {
      event: eventName,
      data,
      timestamp: Date.now()
    };

    // Store in localStorage for now (later integrate with analytics)
    const existingEvents = localStorage.getItem('monetization_events');
    const events: MonetizationEvent[] = existingEvents ? JSON.parse(existingEvents) : [];
    
    events.push(event);
    
    // Keep only last 100 events
    if (events.length > 100) {
      events.splice(0, events.length - 100);
    }
    
    localStorage.setItem('monetization_events', JSON.stringify(events));

    // Log for debugging
    console.log('🔔 Monetization Event:', eventName, data);
  }, []);

  const getEventHistory = useCallback(() => {
    const existingEvents = localStorage.getItem('monetization_events');
    return existingEvents ? JSON.parse(existingEvents) : [];
  }, []);

  const getMostWantedFeatures = useCallback(() => {
    const events = getEventHistory();
    const featureClicks: Record<string, number> = {};

    events.forEach((event: MonetizationEvent) => {
      if (event.event.includes('locked_feature_clicked') || event.event.includes('premium_')) {
        const feature = event.data.feature || event.data.template_id || event.event;
        featureClicks[feature] = (featureClicks[feature] || 0) + 1;
      }
    });

    return Object.entries(featureClicks)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);
  }, [getEventHistory]);

  return {
    trackEvent,
    getEventHistory,
    getMostWantedFeatures
  };
};
