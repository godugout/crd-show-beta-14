
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Generate unique channel names to prevent subscription conflicts
const generateChannelId = () => `cards-changes-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`;

export const useRealtimeCardSubscription = (onCardChange: () => void, userId?: string) => {
  const subscriptionRef = useRef<any>(null);
  const channelIdRef = useRef<string | null>(null);
  const isSubscribedRef = useRef(false);

  // Cleanup function to properly remove subscription
  const cleanupSubscription = () => {
    if (subscriptionRef.current && channelIdRef.current) {
      console.log(`🧹 Cleaning up subscription: ${channelIdRef.current}`);
      try {
        supabase.removeChannel(subscriptionRef.current);
      } catch (error) {
        console.warn('Warning during subscription cleanup:', error);
      }
      subscriptionRef.current = null;
      channelIdRef.current = null;
      isSubscribedRef.current = false;
    }
  };

  useEffect(() => {
    // Clean up any existing subscription before creating a new one
    cleanupSubscription();

    // Create unique channel name for this instance
    const channelName = generateChannelId();
    channelIdRef.current = channelName;
    
    console.log(`📡 Setting up subscription with channel: ${channelName}`);
    
    try {
      const channel = supabase.channel(channelName);
      
      subscriptionRef.current = channel
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'cards'
        }, (payload) => {
          console.log('🔔 Real-time card change:', payload);
          // Debounce rapid changes by using a timeout
          setTimeout(() => {
            onCardChange();
          }, 100);
        })
        .subscribe((status) => {
          console.log(`📡 Subscription status for ${channelName}:`, status);
          isSubscribedRef.current = status === 'SUBSCRIBED';
          
          if (status === 'CHANNEL_ERROR') {
            console.error(`❌ Channel error for ${channelName}`);
            cleanupSubscription();
          }
        });
    } catch (error) {
      console.error('💥 Error setting up subscription:', error);
    }

    // Cleanup function
    return () => {
      cleanupSubscription();
    };
  }, [onCardChange, userId]);

  return {
    isSubscribed: isSubscribedRef.current,
    cleanup: cleanupSubscription
  };
};
