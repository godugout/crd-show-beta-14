import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CosmicEvent {
  id: string;
  type: 'move' | 'click' | 'drag_start' | 'drag_end' | 'scroll' | 'cosmic_trigger' | 'alignment_achieved';
  timestamp: number;
  coordinates: { x: number; y: number };
  metadata?: {
    button?: number;
    deltaY?: number;
    target?: string;
    cardAngle?: number;
    cameraDistance?: number;
    animationProgress?: number;
    alignmentScore?: number;
  };
}

export interface CosmicSession {
  id: string;
  session_start: string;
  session_end?: string;
  alignment_achieved: boolean;
  total_attempts: number;
  best_alignment_score?: number;
  card_angle_peak?: number;
  camera_distance_avg?: number;
  optimal_time_spent: number;
  events: CosmicEvent[];
}

interface UseSupabaseUserTrackerOptions {
  enabled?: boolean;
  sampleRate?: number; // Events per second for mouse movement
}

export const useSupabaseUserTracker = (options: UseSupabaseUserTrackerOptions = {}) => {
  const {
    enabled = false,
    sampleRate = 30
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [currentSession, setCurrentSession] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState<{
    totalEvents: number;
    bestScore: number;
    timeSpent: number;
  }>({ totalEvents: 0, bestScore: 0, timeSpent: 0 });

  const lastMouseEvent = useRef<number>(0);
  const eventCounter = useRef(0);
  const isDragging = useRef(false);
  const sessionStartTime = useRef<number>(0);
  const optimalTimeTracker = useRef<number>(0);

  // Generate unique IDs
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create new cosmic session in database
  const startRecording = useCallback(async () => {
    if (!enabled) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.warn('⚠️ User not authenticated, tracking disabled');
        return;
      }

      const { data, error } = await supabase
        .from('user_cosmic_sessions')
        .insert({
          user_id: user.id,
          session_start: new Date().toISOString(),
          alignment_achieved: false,
          total_attempts: 0
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Failed to create session:', error);
        return;
      }

      setCurrentSession(data.id);
      setIsRecording(true);
      eventCounter.current = 0;
      sessionStartTime.current = Date.now();
      
      console.log('🎬 Cosmic tracking started:', data.id);
    } catch (error) {
      console.error('❌ Session creation error:', error);
    }
  }, [enabled]);

  // Stop recording and finalize session
  const stopRecording = useCallback(async () => {
    if (!currentSession || !isRecording) return;

    try {
      const sessionDuration = Math.floor((Date.now() - sessionStartTime.current) / 1000);
      
      const { error } = await supabase
        .from('user_cosmic_sessions')
        .update({
          session_end: new Date().toISOString(),
          total_attempts: eventCounter.current,
          optimal_time_spent: Math.floor(optimalTimeTracker.current / 1000),
          camera_distance_avg: sessionStats.bestScore // Temporary mapping
        })
        .eq('id', currentSession);

      if (error) {
        console.error('❌ Failed to update session:', error);
      }

      setIsRecording(false);
      setCurrentSession(null);
      eventCounter.current = 0;
      optimalTimeTracker.current = 0;
      
      console.log('🛑 Cosmic recording stopped. Duration:', sessionDuration, 'seconds');
    } catch (error) {
      console.error('❌ Session finalization error:', error);
    }
  }, [currentSession, isRecording, sessionStats.bestScore]);

  // Add event to database
  const addEvent = useCallback(async (
    type: CosmicEvent['type'],
    coordinates: { x: number; y: number },
    metadata?: CosmicEvent['metadata']
  ) => {
    if (!isRecording || !currentSession) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const event: Omit<CosmicEvent, 'id'> = {
        type,
        timestamp: Date.now(),
        coordinates,
        metadata
      };

      const { error } = await supabase
        .from('user_interaction_events')
        .insert({
          session_id: currentSession,
          user_id: user.id,
          event_type: type,
          coordinates: coordinates,
          metadata: metadata || {},
          timestamp: new Date(event.timestamp).toISOString()
        });

      if (error) {
        console.error('❌ Failed to log event:', error);
        return;
      }

      eventCounter.current++;
      
      // Track cosmic achievements
      if (type === 'alignment_achieved' && metadata?.alignmentScore) {
        setSessionStats(prev => ({
          ...prev,
          bestScore: Math.max(prev.bestScore, metadata.alignmentScore || 0),
          totalEvents: eventCounter.current
        }));

        // Update session with achievement
        await supabase
          .from('user_cosmic_sessions')
          .update({
            alignment_achieved: true,
            best_alignment_score: metadata.alignmentScore,
            card_angle_peak: metadata.cardAngle
          })
          .eq('id', currentSession);
      }

    } catch (error) {
      console.error('❌ Event logging error:', error);
    }
  }, [isRecording, currentSession]);

  // Enhanced event handlers
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    const now = Date.now();
    const timeSinceLastEvent = now - lastMouseEvent.current;
    const minInterval = 1000 / sampleRate;
    
    if (timeSinceLastEvent >= minInterval) {
      addEvent('move', { x: e.clientX, y: e.clientY });
      lastMouseEvent.current = now;
    }
  }, [enabled, sampleRate, addEvent]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    isDragging.current = true;
    addEvent('drag_start', { x: e.clientX, y: e.clientY }, {
      button: e.button,
      target: (e.target as HTMLElement)?.tagName || 'unknown'
    });
  }, [enabled, addEvent]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (!enabled) return;
    
    if (isDragging.current) {
      addEvent('drag_end', { x: e.clientX, y: e.clientY }, {
        button: e.button
      });
      isDragging.current = false;
    } else {
      addEvent('click', { x: e.clientX, y: e.clientY }, {
        button: e.button,
        target: (e.target as HTMLElement)?.tagName || 'unknown'
      });
    }
  }, [enabled, addEvent]);

  const handleScroll = useCallback((e: WheelEvent) => {
    if (!enabled) return;
    
    addEvent('scroll', { x: e.clientX, y: e.clientY }, {
      deltaY: e.deltaY
    });
  }, [enabled, addEvent]);

  // Special cosmic event handlers
  const logCosmicTrigger = useCallback((cardAngle: number, alignmentScore: number) => {
    addEvent('cosmic_trigger', { x: window.innerWidth / 2, y: window.innerHeight / 2 }, {
      cardAngle,
      alignmentScore
    });
  }, [addEvent]);

  const logAlignmentAchieved = useCallback((cardAngle: number, cameraDistance: number, alignmentScore: number) => {
    addEvent('alignment_achieved', { x: window.innerWidth / 2, y: window.innerHeight / 2 }, {
      cardAngle,
      cameraDistance,
      alignmentScore
    });
  }, [addEvent]);

  // Get user analytics
  const getUserAnalytics = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .rpc('get_user_cosmic_analytics', { user_uuid: user.id });

      if (error) {
        console.error('❌ Analytics fetch error:', error);
        return null;
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('❌ Analytics error:', error);
      return null;
    }
  }, []);

  // Event listeners setup
  useEffect(() => {
    if (!enabled || !isRecording) return;
    
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleScroll, { passive: true });
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [enabled, isRecording, handleMouseMove, handleMouseDown, handleMouseUp, handleScroll]);

  return {
    // State
    isRecording,
    currentSession,
    sessionStats,
    
    // Controls
    startRecording,
    stopRecording,
    
    // Event logging
    addEvent,
    logCosmicTrigger,
    logAlignmentAchieved,
    
    // Analytics
    getUserAnalytics,
    
    // Stats
    eventCount: sessionStats.totalEvents,
    recordingTime: isRecording ? Date.now() - sessionStartTime.current : 0
  };
};