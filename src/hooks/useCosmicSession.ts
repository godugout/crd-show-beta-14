import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CosmicSession {
  id: string;
  user_id: string;
  session_start: string;
  session_end?: string;
  alignment_achieved: boolean;
  total_attempts: number;
  best_alignment_score?: number;
  card_angle_peak?: number;
  camera_distance_avg?: number;
  optimal_time_spent: number;
}

interface CosmicEvent {
  id: string;
  session_id: string;
  user_id: string;
  event_type: string;
  coordinates?: { x: number; y: number };
  metadata?: Record<string, any>;
  timestamp: string;
}

export const useCosmicSession = () => {
  const [currentSession, setCurrentSession] = useState<CosmicSession | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [sessionMetrics, setSessionMetrics] = useState({
    attempts: 0,
    bestScore: 0,
    timeSpent: 0,
    peakAngle: 0,
  });

  // Start a new cosmic session
  const startSession = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('user_cosmic_sessions')
        .insert({
          user_id: user.user.id,
          alignment_achieved: false,
          total_attempts: 0,
          optimal_time_spent: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentSession(data);
      setIsRecording(true);
      setSessionMetrics({ attempts: 0, bestScore: 0, timeSpent: 0, peakAngle: 0 });
    } catch (error) {
      console.error('Failed to start cosmic session:', error);
    }
  }, []);

  // End the current session
  const endSession = useCallback(async (alignmentAchieved = false) => {
    if (!currentSession) return;

    try {
      const { error } = await supabase
        .from('user_cosmic_sessions')
        .update({
          session_end: new Date().toISOString(),
          alignment_achieved: alignmentAchieved,
          total_attempts: sessionMetrics.attempts,
          best_alignment_score: sessionMetrics.bestScore,
          card_angle_peak: sessionMetrics.peakAngle,
          optimal_time_spent: sessionMetrics.timeSpent,
        })
        .eq('id', currentSession.id);

      if (error) throw error;

      setCurrentSession(null);
      setIsRecording(false);
    } catch (error) {
      console.error('Failed to end cosmic session:', error);
    }
  }, [currentSession, sessionMetrics]);

  // Record an interaction event
  const recordEvent = useCallback(async (
    eventType: string,
    coordinates?: { x: number; y: number },
    metadata?: Record<string, any>
  ) => {
    if (!currentSession || !isRecording) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      await supabase
        .from('user_interaction_events')
        .insert({
          session_id: currentSession.id,
          user_id: user.user.id,
          event_type: eventType,
          coordinates,
          metadata,
        });

      // Update session metrics based on event
      if (eventType === 'alignment_attempt') {
        setSessionMetrics(prev => ({
          ...prev,
          attempts: prev.attempts + 1,
        }));
      }

      if (eventType === 'card_angle_update' && metadata?.angle) {
        setSessionMetrics(prev => ({
          ...prev,
          peakAngle: Math.max(prev.peakAngle, metadata.angle),
        }));
      }

      if (eventType === 'alignment_achieved' && metadata?.score) {
        setSessionMetrics(prev => ({
          ...prev,
          bestScore: Math.max(prev.bestScore, metadata.score),
        }));
      }
    } catch (error) {
      console.error('Failed to record cosmic event:', error);
    }
  }, [currentSession, isRecording]);

  // Update time spent in optimal state
  const updateOptimalTime = useCallback((timeInSeconds: number) => {
    setSessionMetrics(prev => ({
      ...prev,
      timeSpent: prev.timeSpent + timeInSeconds,
    }));
  }, []);

  // Get user cosmic analytics
  const getCosmicAnalytics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_user_cosmic_analytics');
      if (error) throw error;
      return data?.[0] || null;
    } catch (error) {
      console.error('Failed to get cosmic analytics:', error);
      return null;
    }
  }, []);

  // Auto-cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentSession && isRecording) {
        endSession(false);
      }
    };
  }, []);

  return {
    currentSession,
    isRecording,
    sessionMetrics,
    startSession,
    endSession,
    recordEvent,
    updateOptimalTime,
    getCosmicAnalytics,
  };
};