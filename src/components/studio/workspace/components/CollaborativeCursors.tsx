import React from 'react';
import { cn } from '@/lib/utils';
import type { WorkspaceState } from '../types';

interface CollaborativeCursorsProps {
  cursors: WorkspaceState['collaborativeCursors'];
  className?: string;
}

export const CollaborativeCursors: React.FC<CollaborativeCursorsProps> = ({
  cursors,
  className
}) => {
  if (!cursors || cursors.length === 0) {
    return null;
  }

  return (
    <div className={cn("absolute inset-0 pointer-events-none z-30", className)}>
      {cursors.map(cursor => (
        <div
          key={cursor.userId}
          className="absolute transition-all duration-150 ease-out"
          style={{
            left: cursor.position.x,
            top: cursor.position.y,
            transform: 'translate(-2px, -2px)'
          }}
        >
          {/* Cursor Pointer */}
          <div className="relative">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M4.5 2L15.5 8L9 9.5L7.5 16L4.5 2Z"
                fill={cursor.color}
                stroke="white"
                strokeWidth="1"
              />
            </svg>
            
            {/* User Label */}
            <div 
              className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white shadow-lg whitespace-nowrap"
              style={{ backgroundColor: cursor.color }}
            >
              {cursor.userName}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};