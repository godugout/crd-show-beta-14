import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getGridThemeClasses } from '../utils/themeUtils';

interface CollapsibleSidebarProps {
  children: React.ReactNode;
  isCollapsed: boolean;
  onToggle: () => void;
  side: 'left' | 'right';
  collapsedContent?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  gridType?: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography' | null;
  showGrid?: boolean;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  children,
  isCollapsed,
  onToggle,
  side,
  collapsedContent,
  className = '',
  style = {},
  gridType = null,
  showGrid = false
}) => {
  const themeClasses = getGridThemeClasses(showGrid ? gridType : null);
  const sideStyles = side === 'left' 
    ? { left: 0 } 
    : { right: 0 };

  const collapseIcon = side === 'left' 
    ? (isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />)
    : (isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />);

  return (
    <div 
      className={`absolute top-0 bottom-0 z-40 transition-all duration-300 ease-in-out ${className}`}
      style={{
        ...sideStyles,
        width: isCollapsed ? '48px' : 'var(--sidebar-width, 380px)',
        transform: isCollapsed ? 'translateX(0)' : 'translateX(0)',
        ...style
      }}
    >
      {/* Collapsed Icon Strip */}
      {isCollapsed && (
        <div className="w-12 h-full bg-crd-darker backdrop-blur-md border border-crd-mediumGray/50 shadow-lg flex flex-col transition-all duration-300">
          {/* Toggle Button */}
          <button
            onClick={onToggle}
            className="w-full h-12 flex items-center justify-center text-crd-lightGray hover:text-crd-blue hover:bg-crd-blue/10 transition-all duration-200 border-b border-crd-mediumGray/30"
          >
            {collapseIcon}
          </button>
          
          {/* Collapsed Content Icons */}
          <div className="flex-1 p-2">
            {collapsedContent}
          </div>
        </div>
      )}

      {/* Expanded Panel */}
      {!isCollapsed && (
        <div className={`w-full h-full bg-crd-darker backdrop-blur-md shadow-2xl flex flex-col transition-all duration-300 ${
          side === 'left' 
            ? `border-r-2 ${themeClasses.borderThird}` 
            : `border border-crd-mediumGray/50 border-l-2 ${themeClasses.borderThird}`
        }`}>
          {/* Toggle Button Header */}
          <div className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-crd-mediumGray/30">
            <div className="text-crd-white text-sm font-orbitron font-semibold tracking-wider">
              {side === 'left' ? 'Tools' : 'Properties'}
            </div>
            <button
              onClick={onToggle}
              className="p-1 text-crd-lightGray hover:text-crd-blue hover:bg-crd-blue/10 rounded transition-all duration-200"
            >
              {collapseIcon}
            </button>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};