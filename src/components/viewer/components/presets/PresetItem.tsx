
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { PresetItemProps } from './types';

export const PresetItem: React.FC<PresetItemProps> = ({
  preset,
  isSelected,
  isApplying,
  detectionReason,
  onClick
}) => {
  const IconComponent = preset.icon;
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          disabled={isApplying && !isSelected}
          variant="ghost"
          className={`w-full h-7 px-2 flex items-center justify-start space-x-2 border transition-colors ${
            isSelected 
              ? 'bg-crd-green/30 border-crd-green text-white shadow-md' 
              : 'bg-editor-dark border-editor-border hover:border-crd-green hover:bg-crd-green/20'
          } text-xs ${isApplying && !isSelected ? 'opacity-30' : ''}`}
        >
          <IconComponent className={`w-3 h-3 flex-shrink-0 ${
            isSelected ? 'text-crd-green' : 'text-crd-green'
          }`} />
          <span className={`font-medium truncate ${
            preset.isCustom ? 'text-crd-green' : 'text-white'
          }`}>
            {preset.name}
          </span>
          {isApplying && isSelected && (
            <div className="w-2 h-2 bg-crd-green rounded-full animate-pulse ml-auto" />
          )}
          {isSelected && detectionReason === 'auto-detected' && (
            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full ml-auto" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="bg-black border-gray-700 text-white z-50">
        <div className="text-center max-w-48">
          <div className="font-medium">{preset.name}</div>
          <div className="text-xs text-gray-300 mb-1">{preset.description}</div>
          {preset.materialHint && (
            <div className="text-xs text-crd-green italic">
              Surface: {preset.materialHint}
            </div>
          )}
          {isSelected && (
            <div className="text-xs text-blue-400 mt-1">
              {detectionReason === 'applying' ? 'Applying...' : 
               detectionReason === 'selected' ? 'Selected' : 
               'Auto-detected'}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
