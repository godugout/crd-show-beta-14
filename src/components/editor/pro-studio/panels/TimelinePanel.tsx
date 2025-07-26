import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, Pause, SkipBack, SkipForward, Square,
  Plus, Minus, Clock, KeyRound, RotateCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Layer } from '../ProStudio';

interface TimelinePanelProps {
  layers: Layer[];
  selectedLayers: string[];
  onLayersUpdate: (layers: Layer[]) => void;
}

interface Keyframe {
  time: number;
  property: string;
  value: any;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

interface Animation {
  id: string;
  layerId: string;
  property: string;
  keyframes: Keyframe[];
  duration: number;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({
  layers,
  selectedLayers,
  onLayersUpdate
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(3000); // 3 seconds
  const [zoom, setZoom] = useState(1);
  const [animations, setAnimations] = useState<Animation[]>([]);

  const timelineWidth = 800 * zoom;
  const pixelsPerMs = timelineWidth / totalDuration;

  const addKeyframe = (layerId: string, property: string, time: number, value: any) => {
    const newKeyframe: Keyframe = {
      time,
      property,
      value,
      easing: 'ease-in-out'
    };

    setAnimations(prev => {
      const existingAnim = prev.find(a => a.layerId === layerId && a.property === property);
      
      if (existingAnim) {
        return prev.map(anim => 
          anim.id === existingAnim.id
            ? { ...anim, keyframes: [...anim.keyframes, newKeyframe].sort((a, b) => a.time - b.time) }
            : anim
        );
      } else {
        const newAnimation: Animation = {
          id: `anim_${Date.now()}`,
          layerId,
          property,
          keyframes: [newKeyframe],
          duration: totalDuration
        };
        return [...prev, newAnimation];
      }
    });
  };

  const removeKeyframe = (animId: string, keyframeIndex: number) => {
    setAnimations(prev =>
      prev.map(anim =>
        anim.id === animId
          ? { ...anim, keyframes: anim.keyframes.filter((_, i) => i !== keyframeIndex) }
          : anim
      ).filter(anim => anim.keyframes.length > 0)
    );
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Start animation playback
      const startTime = Date.now() - currentTime;
      const animateFrame = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= totalDuration) {
          setCurrentTime(totalDuration);
          setIsPlaying(false);
          return;
        }
        
        setCurrentTime(elapsed);
        if (isPlaying) {
          requestAnimationFrame(animateFrame);
        }
      };
      requestAnimationFrame(animateFrame);
    }
  };

  const resetPlayhead = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const getAnimatableProperties = (layer: Layer) => {
    const baseProps = ['opacity', 'x', 'y', 'rotation', 'scaleX', 'scaleY'];
    
    switch (layer.type) {
      case 'text':
        return [...baseProps, 'fontSize', 'letterSpacing', 'color'];
      case 'shape':
        return [...baseProps, 'fillColor', 'strokeColor', 'strokeWidth'];
      case 'image':
        return [...baseProps, 'brightness', 'contrast', 'saturation'];
      default:
        return baseProps;
    }
  };

  const renderTimelineRuler = () => {
    const intervals = [];
    const majorInterval = 500; // 500ms
    const minorInterval = 100; // 100ms
    
    for (let time = 0; time <= totalDuration; time += minorInterval) {
      const x = time * pixelsPerMs;
      const isMajor = time % majorInterval === 0;
      
      intervals.push(
        <div
          key={time}
          className={`absolute top-0 ${isMajor ? 'h-6 bg-gray-400' : 'h-3 bg-gray-600'}`}
          style={{ left: x, width: 1 }}
        >
          {isMajor && (
            <span className="absolute top-6 left-0 text-xs text-gray-400 transform -translate-x-1/2">
              {(time / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      );
    }
    
    return intervals;
  };

  const renderLayerTimeline = (layer: Layer) => {
    const layerAnimations = animations.filter(a => a.layerId === layer.id);
    const animatableProps = getAnimatableProperties(layer);

    return (
      <div key={layer.id} className="border-b border-gray-800 last:border-b-0">
        {/* Layer Header */}
        <div className="h-8 bg-gray-900 flex items-center px-3 text-xs font-medium border-b border-gray-800">
          <span className="flex-1 truncate">{layer.name}</span>
          <Button variant="ghost" size="sm" className="w-6 h-6 p-0">
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Property Tracks */}
        {animatableProps.map(property => {
          const propertyAnim = layerAnimations.find(a => a.property === property);
          
          return (
            <div key={property} className="h-12 flex border-b border-gray-800/50 last:border-b-0">
              {/* Property Label */}
              <div className="w-32 bg-gray-900/50 flex items-center px-3 text-xs text-gray-400 border-r border-gray-800">
                {property}
              </div>

              {/* Timeline Track */}
              <div className="flex-1 relative bg-gray-900/20">
                {/* Keyframes */}
                {propertyAnim?.keyframes.map((keyframe, index) => {
                  const x = keyframe.time * pixelsPerMs;
                  
                  return (
                    <motion.div
                      key={index}
                      className="absolute top-1/2 w-3 h-3 bg-blue-500 border border-blue-300 rounded-sm transform -translate-y-1/2 cursor-pointer hover:bg-blue-400"
                      style={{ left: x - 6 }}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeKeyframe(propertyAnim.id, index)}
                    />
                  );
                })}

                {/* Add Keyframe on Click */}
                <div
                  className="absolute inset-0 cursor-crosshair"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const time = Math.round(x / pixelsPerMs);
                    
                    // Get current value for the property
                    let currentValue;
                    if (property === 'opacity') {
                      currentValue = layer.opacity;
                    } else if (['x', 'y', 'rotation', 'scaleX', 'scaleY'].includes(property)) {
                      currentValue = layer.transform[property as keyof typeof layer.transform];
                    } else {
                      currentValue = 0; // Default value
                    }
                    
                    addKeyframe(layer.id, property, time, currentValue);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-950 flex flex-col">
      {/* Timeline Controls */}
      <div className="h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetPlayhead}
            className="text-gray-400 hover:text-white"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlayback}
            className="text-gray-400 hover:text-white"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-400">Time:</Label>
            <span className="text-xs font-mono">
              {(currentTime / 1000).toFixed(2)}s / {(totalDuration / 1000).toFixed(2)}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Label className="text-xs text-gray-400">Zoom:</Label>
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={0.1}
              max={5}
              step={0.1}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 flex">
        {/* Layer Names Column */}
        <div className="w-32 bg-gray-900 border-r border-gray-800">
          <div className="h-10 bg-gray-950 border-b border-gray-800 flex items-center px-3">
            <span className="text-xs font-medium text-gray-400">Layers</span>
          </div>
          
          <ScrollArea className="h-[calc(100%-2.5rem)]">
            {layers.map(layer => {
              const animatableProps = getAnimatableProperties(layer);
              const headerHeight = 32; // 2rem
              const trackHeight = 48; // 3rem
              const totalHeight = headerHeight + (animatableProps.length * trackHeight);
              
              return (
                <div key={layer.id} style={{ height: totalHeight }} className="border-b border-gray-800">
                  {/* Layer header space */}
                  <div className="h-8" />
                  {/* Property labels space */}
                  {animatableProps.map(property => (
                    <div key={property} className="h-12" />
                  ))}
                </div>
              );
            })}
          </ScrollArea>
        </div>

        {/* Timeline Content */}
        <div className="flex-1 relative overflow-auto">
          {/* Timeline Ruler */}
          <div className="h-10 bg-gray-950 border-b border-gray-800 relative">
            <div className="relative" style={{ width: timelineWidth }}>
              {renderTimelineRuler()}
            </div>
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 pointer-events-none"
            style={{ left: currentTime * pixelsPerMs }}
          >
            <div className="absolute top-0 -left-1 w-3 h-3 bg-red-500 transform rotate-45" />
          </div>

          {/* Layer Timelines */}
          <ScrollArea className="h-[calc(100%-2.5rem)]">
            <div style={{ width: timelineWidth }}>
              {layers.map(layer => renderLayerTimeline(layer))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Timeline Footer */}
      <div className="h-8 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-400">
        <span>{animations.length} animation{animations.length !== 1 ? 's' : ''}</span>
        <span>Click tracks to add keyframes • Right-click keyframes to edit</span>
      </div>
    </div>
  );
};