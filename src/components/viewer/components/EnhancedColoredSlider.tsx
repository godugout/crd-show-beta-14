
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface EnhancedColoredSliderProps {
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
  isActive?: boolean;
  styleColor?: string;
  effectName?: string;
  className?: string;
  disabled?: boolean;
}

export const EnhancedColoredSlider: React.FC<EnhancedColoredSliderProps> = ({ 
  value, 
  onValueChange, 
  min, 
  max, 
  step,
  isActive = false,
  styleColor = '#45B26B',
  effectName = '',
  className = '',
  disabled = false
}) => {
  const sliderStyle = React.useMemo(() => {
    if (disabled || !isActive) {
      return {
        '--track-bg': 'rgba(107, 114, 128, 0.3)',
        '--track-border': 'rgba(107, 114, 128, 0.5)',
        '--range-bg': 'rgba(107, 114, 128, 0.6)',
        '--thumb-bg': '#6B7280',
        '--thumb-border': '#6B7280',
        '--thumb-shadow': '#6B728080'
      } as React.CSSProperties;
    }

    // Active state with style color gradient
    return {
      '--track-bg': 'rgba(30, 41, 59, 0.8)',
      '--track-border': `${styleColor}66`,
      '--range-bg': `linear-gradient(90deg, ${styleColor}, #F97316)`,
      '--thumb-bg': styleColor,
      '--thumb-border': styleColor,
      '--thumb-shadow': `${styleColor}80`,
      '--glow': `0 0 8px ${styleColor}40`
    } as React.CSSProperties;
  }, [isActive, styleColor, disabled]);

  return (
    <div 
      style={sliderStyle}
      className={cn(
        "relative",
        isActive && !disabled && "enhanced-slider-active",
        className
      )}
    >
      <Slider
        value={value}
        onValueChange={disabled ? () => {} : onValueChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={cn(
          "w-full enhanced-slider",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />
      
      {/* Enhanced styling using CSS variables */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .enhanced-slider-active .enhanced-slider [data-orientation="horizontal"] {
            background: var(--track-bg);
            border: 1px solid var(--track-border);
            box-shadow: var(--glow);
          }
          
          .enhanced-slider-active .enhanced-slider [data-orientation="horizontal"] > span[data-orientation="horizontal"] {
            background: var(--range-bg);
          }
          
          .enhanced-slider-active .enhanced-slider [role="slider"] {
            background: var(--thumb-bg);
            border: 2px solid var(--thumb-border);
            box-shadow: var(--glow), 0 2px 4px rgba(0,0,0,0.2);
            transform: scale(1.1);
          }
        `
      }} />
    </div>
  );
};
