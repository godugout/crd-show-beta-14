import React, { useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Grid3x3, LayoutGrid, Grid, Diamond, Construction, Camera, X, Ruler, Edit3, ChevronDown, Lock, Unlock } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
interface CRDToolbarProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  showGrid: boolean;
  onGridToggle: () => void;
  gridType: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';
  onGridTypeChange: (type: 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography') => void;
  showRulers: boolean;
  onRulersToggle: () => void;
  isLocked: boolean;
  onLockToggle: () => void;
  // Auto-hide props
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

type GridType = 'standard' | 'print' | 'golden' | 'isometric' | 'blueprint' | 'photography';

const gridOptions: Array<{
  value: GridType | null;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = [
  { value: null, label: 'None', icon: X, color: 'text-gray-400' },
  { value: 'standard', label: 'Standard', icon: Grid3x3, color: 'text-blue-400' },
  { value: 'print', label: 'Print', icon: LayoutGrid, color: 'text-green-400' },
  { value: 'golden', label: 'Golden', icon: Grid, color: 'text-yellow-400' },
  { value: 'isometric', label: 'Isometric', icon: Diamond, color: 'text-purple-400' },
  { value: 'blueprint', label: 'Blueprint', icon: Construction, color: 'text-cyan-400' },
  { value: 'photography', label: 'Photography', icon: Camera, color: 'text-pink-400' }
];
export const CRDToolbar: React.FC<CRDToolbarProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  showGrid,
  onGridToggle,
  gridType,
  onGridTypeChange,
  showRulers,
  onRulersToggle,
  isLocked,
  onLockToggle,
  className,
  onMouseEnter,
  onMouseLeave
}) => {
  return <div
    className={className || "absolute top-16 left-1/2 transform -translate-x-1/2 z-30 bg-crd-darker/80 backdrop-blur-sm border border-crd-mediumGray/30 rounded-lg shadow-lg"}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
      <div className="px-4 py-2">
        <div className="flex items-center gap-6 h-10">
          {/* View Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-crd-lightGray font-medium">View:</span>
              <DropdownMenu>
                 <DropdownMenuTrigger asChild>
                   <CRDButton variant="outline" size="sm" className="h-8 w-8 p-0 bg-white/5 backdrop-blur-sm border-white/20" title="Select Grid Type">
                     {(() => {
                       const currentOption = gridOptions.find(option => option.value === (showGrid ? gridType : null));
                       const Icon = currentOption?.icon || X;
                       return (
                         <>
                           <Icon className={`w-4 h-4 text-green-400`} />
                           <ChevronDown className="w-3 h-3 absolute -bottom-0.5 -right-0.5 text-green-400" />
                         </>
                       );
                     })()}
                   </CRDButton>
                 </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-crd-darker border-crd-mediumGray/30 min-w-[140px]">
                  {gridOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <DropdownMenuItem
                        key={option.value || 'none'}
                        className="text-crd-white hover:bg-crd-mediumGray/20 cursor-pointer"
                        onClick={() => {
                          if (option.value === null) {
                            if (showGrid) onGridToggle();
                          } else {
                            if (!showGrid) onGridToggle();
                            onGridTypeChange(option.value);
                          }
                        }}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${option.color}`} />
                        {option.label}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              
               <CRDButton variant="outline" size="sm" onClick={onRulersToggle} className={`h-8 w-8 p-0 bg-white/5 backdrop-blur-sm border-white/20 ${showRulers ? 'border-green-400/50' : ''}`} title="Toggle Rulers">
                 <Ruler className={`w-4 h-4 ${showRulers ? 'text-green-400' : 'text-green-400'}`} />
               </CRDButton>

               <CRDButton 
                 variant="outline" 
                 size="sm" 
                 onClick={onLockToggle} 
                 className={`h-8 w-8 p-0 bg-white/5 backdrop-blur-sm border-white/20 ${isLocked ? 'border-red-400/50' : 'border-blue-400/50'}`} 
                 title={isLocked ? "Unlock card position" : "Lock card position"}
               >
                 {isLocked ? (
                   <Lock className="w-4 h-4 text-red-400" />
                 ) : (
                   <Unlock className="w-4 h-4 text-blue-400" />
                 )}
               </CRDButton>
            </div>

            <div className="w-px h-6 bg-crd-mediumGray/30" />

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-crd-lightGray font-medium">Zoom:</span>
              <CRDButton variant="ghost" size="sm" onClick={onZoomOut} disabled={zoom <= 25} className="h-8 w-8 p-0">
                <ZoomOut className="w-3 h-3" />
              </CRDButton>
              
              <div className="text-crd-white text-xs font-mono bg-crd-darkest px-2 py-1 rounded min-w-[50px] text-center h-8 flex items-center justify-center">
                {Math.round(zoom)}%
              </div>
              
              <CRDButton variant="ghost" size="sm" onClick={onZoomIn} disabled={zoom >= 300} className="h-8 w-8 p-0">
                <ZoomIn className="w-3 h-3" />
              </CRDButton>
              
              <CRDButton variant="ghost" size="sm" onClick={onZoomReset} className="h-8 px-2 text-xs" title="Reset zoom (125%)">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </CRDButton>
            </div>
          </div>
        </div>
      </div>
    </div>;
};