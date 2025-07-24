import React, { useState, useEffect } from 'react';
import { Play, Square, SkipForward, Trash2, Download, Eye, MousePointer } from 'lucide-react';
import { useUserTracker } from '@/hooks/useUserTracker';
import { useSupabaseUserTracker } from '@/hooks/useSupabaseUserTracker';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface UserTrackerProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  cardAngle?: number;
  cameraDistance?: number;
  animationProgress?: number;
}

export const UserTracker: React.FC<UserTrackerProps> = ({
  enabled,
  onToggle,
  cardAngle = 0,
  cameraDistance = 10,
  animationProgress = 0
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Legacy localStorage tracker (disabled in favor of Supabase)
  const {
    isRecording: localRecording,
    session,
    isPlaying,
    playbackProgress,
    startRecording: startLocalRecording,
    stopRecording: stopLocalRecording,
    startPlayback,
    stopPlayback,
    getSavedSessions,
    clearSavedSessions,
    addEvent,
    eventCount: localEventCount,
    recordingTime: localRecordingTime
  } = useUserTracker({ 
    enabled: false, // Disabled in favor of Supabase
    sampleRate: 30,
    saveToStorage: true 
  });

  // Enhanced Supabase tracker
  const {
    isRecording,
    currentSession,
    sessionStats,
    startRecording,
    stopRecording,
    logCosmicTrigger,
    logAlignmentAchieved,
    getUserAnalytics,
    eventCount,
    recordingTime
  } = useSupabaseUserTracker({ 
    enabled,
    sampleRate: 30
  });

  // Auto-trigger cosmic events based on card state
  useEffect(() => {
    if (!enabled || !isRecording) return;

    // Log cosmic trigger when conditions are met
    if (cardAngle >= 45 && cameraDistance > 0) {
      const alignmentScore = Math.min(100, (cardAngle / 90) * 50 + (1 - Math.min(cameraDistance / 20, 1)) * 50);
      logCosmicTrigger(cardAngle, alignmentScore);
      
      // Log achievement if alignment is perfect
      if (alignmentScore > 80) {
        logAlignmentAchieved(cardAngle, cameraDistance, alignmentScore);
      }
    }
  }, [cardAngle, cameraDistance, enabled, isRecording, logCosmicTrigger, logAlignmentAchieved]);

  // Format time display
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  // Export session data
  const exportSession = () => {
    if (!session) return;
    
    const dataStr = JSON.stringify(session, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `user-session-${session.id}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  // Add cosmic context to tracking
  const addCosmicEvent = (type: 'cosmic_trigger' | 'alignment_achieved') => {
    addEvent('click', { x: 0, y: 0 }, {
      target: 'cosmic_system',
      cardAngle,
      cameraDistance,
      animationProgress
    });
  };

  const savedSessions = getSavedSessions();

  return (
    <Card className="p-4 space-y-4 bg-card/80 backdrop-blur">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MousePointer className="w-4 h-4" />
          <span className="font-semibold">User Tracking</span>
          <Badge variant={enabled ? "default" : "secondary"}>
            {enabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 text-sm">
        <div className="text-center p-2 bg-muted rounded">
          <div className="font-medium">{eventCount}</div>
          <div className="text-muted-foreground">Events</div>
        </div>
        <div className="text-center p-2 bg-muted rounded">
          <div className="font-medium">{formatTime(recordingTime)}</div>
          <div className="text-muted-foreground">Time</div>
        </div>
        <div className="text-center p-2 bg-muted rounded">
          <div className="font-medium">{Math.round(cardAngle)}°</div>
          <div className="text-muted-foreground">Angle</div>
        </div>
        <div className="text-center p-2 bg-muted rounded">
          <div className="font-medium">{Math.round(cameraDistance * 10) / 10}</div>
          <div className="text-muted-foreground">Zoom</div>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="flex gap-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={!enabled}
            className="flex-1"
            variant="default"
          >
            <Play className="w-4 h-4 mr-1" />
            Start Recording
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            className="flex-1"
            variant="destructive"
          >
            <Square className="w-4 h-4 mr-1" />
            Stop Recording
          </Button>
        )}
        
        <Button
          onClick={() => addCosmicEvent('cosmic_trigger')}
          disabled={!enabled || !isRecording}
          variant="outline"
          size="sm"
        >
          Mark Cosmic
        </Button>
      </div>

      {/* Playback Controls */}
      {session && session.events.length > 0 && (
        <div className="space-y-2 border-t pt-4">
          <div className="flex gap-2">
            {!isPlaying ? (
              <Button
                onClick={() => startPlayback(playbackSpeed)}
                variant="outline"
                size="sm"
              >
                <SkipForward className="w-4 h-4 mr-1" />
                Playback
              </Button>
            ) : (
              <Button
                onClick={stopPlayback}
                variant="outline"
                size="sm"
              >
                <Square className="w-4 h-4 mr-1" />
                Stop
              </Button>
            )}
            
            <Button
              onClick={exportSession}
              variant="outline"
              size="sm"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          
          {/* Playback Speed */}
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Speed: {playbackSpeed}x</span>
              <span>Progress: {Math.round(playbackProgress * 100)}%</span>
            </div>
            <Slider
              value={[playbackSpeed]}
              onValueChange={([value]) => setPlaybackSpeed(value)}
              min={0.1}
              max={5}
              step={0.1}
              className="mb-2"
            />
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-100"
                style={{ width: `${playbackProgress * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Detailed View */}
      {showDetails && (
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Saved Sessions ({savedSessions.length})</span>
            <Button
              onClick={clearSavedSessions}
              variant="destructive"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          </div>
          
          <div className="max-h-32 overflow-y-auto space-y-1">
            {savedSessions.map(sess => (
              <div key={sess.id} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                <div>
                  <div className="font-medium">{sess.events.length} events</div>
                  <div className="text-muted-foreground">
                    {formatTime((sess.endTime || sess.startTime) - sess.startTime)}
                  </div>
                </div>
                <div className="text-muted-foreground">
                  {new Date(sess.startTime).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {savedSessions.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                No saved sessions
              </div>
            )}
          </div>
        </div>
      )}

      {/* Real-time Coordinate Display */}
      {enabled && isRecording && (
        <div className="text-xs text-muted-foreground text-center">
          Recording movements • Card: {Math.round(cardAngle)}° • Distance: {Math.round(cameraDistance * 10) / 10}
        </div>
      )}
    </Card>
  );
};