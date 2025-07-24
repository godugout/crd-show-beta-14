
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseRealTimeUpdatesOptions {
  table: string;
  filter?: string;
  onInsert?: (payload: any) => void;
  onUpdate?: (payload: any) => void;
  onDelete?: (payload: any) => void;
  enabled?: boolean;
}

export const useRealTimeUpdates = ({
  table,
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: UseRealTimeUpdatesOptions) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const setupSubscription = () => {
      try {
        const subscription = supabase
          .channel(`realtime-${table}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table,
              filter
            },
            (payload) => {
              console.log(`[RealTime] ${table} change:`, payload);
              
              switch (payload.eventType) {
                case 'INSERT':
                  onInsert?.(payload);
                  break;
                case 'UPDATE':
                  onUpdate?.(payload);
                  break;
                case 'DELETE':
                  onDelete?.(payload);
                  break;
              }
            }
          )
          .subscribe((status) => {
            console.log(`[RealTime] ${table} subscription status:`, status);
            setIsConnected(status === 'SUBSCRIBED');
            if (status === 'CHANNEL_ERROR') {
              setError('Failed to subscribe to real-time updates');
            } else {
              setError(null);
            }
          });

        subscriptionRef.current = subscription;
      } catch (err) {
        console.error(`[RealTime] ${table} subscription error:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    setupSubscription();

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
      setIsConnected(false);
    };
  }, [table, filter, onInsert, onUpdate, onDelete, enabled]);

  const disconnect = () => {
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
      subscriptionRef.current = null;
      setIsConnected(false);
    }
  };

  return {
    isConnected,
    error,
    disconnect
  };
};
