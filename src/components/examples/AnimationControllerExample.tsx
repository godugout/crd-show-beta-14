import React, { useState } from 'react';
import { useAnimationController, useAnimationTask } from '@/hooks/useAnimationController';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AnimationControllerExample: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [enabled, setEnabled] = useState(true);
  const { getTaskCount } = useAnimationController();

  // Example: Rotating animation
  useAnimationTask(
    'rotation-animation',
    () => {
      setRotation(prev => prev + 1);
    },
    1, // High priority
    enabled
  );

  // Example: Scaling animation
  useAnimationTask(
    'scale-animation',
    () => {
      setScale(prev => {
        const newScale = prev + 0.01;
        return newScale > 1.2 ? 1 : newScale;
      });
    },
    0, // Lower priority
    enabled
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Animation Controller Example</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => setEnabled(!enabled)}
              variant={enabled ? "default" : "outline"}
            >
              {enabled ? "Disable" : "Enable"} Animations
            </Button>
            <Badge variant="outline">
              Active Tasks: {getTaskCount()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
            <div
              className="w-16 h-16 bg-blue-500 rounded-lg transition-all duration-100"
              style={{
                transform: `rotate(${rotation}deg) scale(${scale})`,
              }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Rotation:</strong> {Math.round(rotation)}°
            </div>
            <div>
              <strong>Scale:</strong> {scale.toFixed(2)}x
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Benefits of Centralized Animation</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>✅ Single RAF loop for all animations</li>
            <li>✅ Automatic cleanup on unmount</li>
            <li>✅ Priority-based task execution</li>
            <li>✅ Better performance monitoring</li>
            <li>✅ Reduced memory usage</li>
            <li>✅ Easier debugging</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};