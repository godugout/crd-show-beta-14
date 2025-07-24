import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserEvent {
  id: string;
  type: 'move' | 'click' | 'drag_start' | 'drag_end' | 'scroll' | 'cosmic_alignment' | 'card_angle_change' | 'cosmic_trigger';
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
    isOptimalZoom?: boolean;
    isOptimalPosition?: boolean;
  };
}

export interface UserSession {
  id: string;
  startTime: number;
  endTime?: number;
  events: UserEvent[];
  totalEvents: number;
  averageMovements: number;
  maxDistance: number;
}

interface UseUserTrackerOptions {
  enabled?: boolean;
  sampleRate?: number; // Events per second for mouse movement
  saveToStorage?: boolean;
}

export const useUserTracker = (options: UseUserTrackerOptions = {}) => {
  const {
    enabled = false,
    sampleRate = 30,
    saveToStorage = true
  } = options;

  const [isRecording, setIsRecording] = useState(false);
  const [session, setSession] = useState<UserSession | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);

  const lastMouseEvent = useRef<number>(0);
  const eventCounter = useRef(0);
  const isDragging = useRef(false);
  const playbackIntervalRef = useRef<NodeJS.Timeout>();

  // Generate unique IDs
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Create new session
  const startRecording = useCallback(() => {
    if (!enabled) return;
    
    const newSession: UserSession = {
      id: generateId(),
      startTime: Date.now(),
      events: [],
      totalEvents: 0,
      averageMovements: 0,
      maxDistance: 0
    };
    
    setSession(newSession);
    setIsRecording(true);
    eventCounter.current = 0;
    
    console.log('🎬 User tracking started:', newSession.id);
  }, [enabled]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (!session || !isRecording) return;
    
    const updatedSession = {
      ...session,
      endTime: Date.now(),
      totalEvents: eventCounter.current
    };
    
    setSession(updatedSession);
    setIsRecording(false);
    
    if (saveToStorage) {
      saveToStorageAsync(updatedSession);
    }
    
    console.log('🛑 Recording stopped. Total events:', eventCounter.current);
  }, [session, isRecording, saveToStorage]);

  // Add event to current session
  const addEvent = useCallback((
    type: UserEvent['type'],
    coordinates: { x: number; y: number },
    metadata?: UserEvent['metadata']
  ) => {
    if (!isRecording || !session) return;
    
    const event: UserEvent = {
      id: generateId(),
      type,
      timestamp: Date.now(),
      coordinates,
      metadata
    };
    
    setSession(prev => prev ? {
      ...prev,
      events: [...prev.events, event]
    } : null);
    
    eventCounter.current++;
  }, [isRecording, session]);

  // Mouse movement handler with sampling
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

  // Click handlers
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

  // Scroll handler
  const handleScroll = useCallback((e: WheelEvent) => {
    if (!enabled) return;
    
    addEvent('scroll', { x: e.clientX, y: e.clientY }, {
      deltaY: e.deltaY
    });
  }, [enabled, addEvent]);

  // Playback functionality
  const startPlayback = useCallback((speed: number = 1) => {
    if (!session || session.events.length === 0) return;
    
    setIsPlaying(true);
    setPlaybackProgress(0);
    
    const startTime = session.events[0].timestamp;
    const totalDuration = session.events[session.events.length - 1].timestamp - startTime;
    
    let currentEventIndex = 0;
    
    playbackIntervalRef.current = setInterval(() => {
      const currentTime = startTime + (Date.now() - session.startTime) * speed;
      const progress = Math.min((currentTime - startTime) / totalDuration, 1);
      
      setPlaybackProgress(progress);
      
      // Trigger events that should have happened by now
      while (
        currentEventIndex < session.events.length &&
        session.events[currentEventIndex].timestamp <= currentTime
      ) {
        const event = session.events[currentEventIndex];
        
        // Create visual indicator for event
        console.log(`🎮 Playback event ${currentEventIndex}:`, event.type, event.coordinates);
        
        currentEventIndex++;
      }
      
      if (progress >= 1) {
        setIsPlaying(false);
        clearInterval(playbackIntervalRef.current);
      }
    }, 16); // 60fps playback
  }, [session]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
    }
  }, []);

  // Event listeners setup
  useEffect(() => {
    if (!enabled || !isRecording) return;
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('wheel', handleScroll);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('wheel', handleScroll);
    };
  }, [enabled, isRecording, handleMouseMove, handleMouseDown, handleMouseUp, handleScroll]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, []);

  // Enhanced storage with Supabase integration
  const saveToStorageAsync = useCallback(async (session: UserSession) => {
    try {
      // Save to localStorage for backward compatibility
      const sessions = JSON.parse(localStorage.getItem('userTrackingSessions') || '[]');
      sessions.push(session);
      localStorage.setItem('userTrackingSessions', JSON.stringify(sessions));

      // Save to Supabase for persistence and analytics
      const { data: user } = await supabase.auth.getUser();
      if (user.user) {
        // Create session record
        const { data: sessionData, error: sessionError } = await supabase
          .from('user_cosmic_sessions')
          .insert({
            user_id: user.user.id,
            session_start: new Date(session.startTime).toISOString(),
            session_end: session.endTime ? new Date(session.endTime).toISOString() : null,
            total_attempts: session.events.filter(e => e.type === 'cosmic_alignment').length,
            alignment_achieved: session.events.some(e => e.type === 'cosmic_trigger'),
            best_alignment_score: Math.max(...session.events
              .filter(e => e.metadata?.alignmentScore)
              .map(e => e.metadata!.alignmentScore!), 0),
            card_angle_peak: Math.max(...session.events
              .filter(e => e.metadata?.cardAngle)
              .map(e => e.metadata!.cardAngle!), 0),
          })
          .select()
          .single();

        if (sessionError) {
          console.warn('Failed to save session to Supabase:', sessionError);
          return;
        }

        // Save cosmic events only for efficiency
        const cosmicEvents = session.events.filter(e => 
          e.type.includes('cosmic') || e.type === 'card_angle_change'
        );
        
        if (cosmicEvents.length > 0) {
          const eventInserts = cosmicEvents.map(event => ({
            session_id: sessionData.id,
            user_id: user.user.id,
            event_type: event.type,
            coordinates: event.coordinates,
            metadata: event.metadata || {},
            timestamp: new Date(event.timestamp).toISOString(),
          }));

          const { error: eventsError } = await supabase
            .from('user_interaction_events')
            .insert(eventInserts);

          if (eventsError) {
            console.warn('Failed to save events to Supabase:', eventsError);
          }
        }
      }
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }, []);

  // Get all saved sessions
  const getSavedSessions = useCallback((): UserSession[] => {
    if (!saveToStorage) return [];
    return JSON.parse(localStorage.getItem('userTrackingSessions') || '[]');
  }, [saveToStorage]);

  // Clear saved sessions
  const clearSavedSessions = useCallback(() => {
    localStorage.removeItem('userTrackingSessions');
  }, []);

  return {
    // State
    isRecording,
    session,
    isPlaying,
    playbackProgress,
    
    // Controls
    startRecording,
    stopRecording,
    startPlayback,
    stopPlayback,
    
    // Data
    getSavedSessions,
    clearSavedSessions,
    addEvent,
    
    // Stats
    eventCount: session?.events.length || 0,
    recordingTime: session && isRecording ? Date.now() - session.startTime : 0
  };
};