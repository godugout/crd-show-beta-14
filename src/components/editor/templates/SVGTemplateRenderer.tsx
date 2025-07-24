
import React from 'react';
import { ClassicBaseballTemplate, ModernBaseballTemplate, VintageBaseballTemplate, NoFrameTemplate } from './BaseballCardTemplates';
import type { DesignTemplate } from '@/types/card';
import type { TeamColorScheme } from './TeamColors';

interface SVGTemplateRendererProps {
  template: DesignTemplate;
  imageUrl?: string;
  playerName?: string;
  teamName?: string;
  position?: string;
  customColors?: TeamColorScheme;
  className?: string;
}

export const SVGTemplateRenderer: React.FC<SVGTemplateRendererProps> = ({
  template,
  imageUrl,
  playerName,
  teamName,
  position,
  customColors,
  className = ""
}) => {
  const templateData = template.template_data || {};
  const colors = customColors || templateData.colors || {};
  
  const templateProps = {
    imageUrl,
    playerName,
    teamName,
    position,
    colors
  };

  const renderTemplate = () => {
    switch (templateData.component || template.id) {
      case 'NoFrameTemplate':
      case 'no-frame':
        return <NoFrameTemplate {...templateProps} />;
      
      case 'ClassicBaseballTemplate':
      case 'classic-baseball':
        return <ClassicBaseballTemplate {...templateProps} />;
      
      case 'ModernBaseballTemplate':
      case 'modern-baseball':
        return <ModernBaseballTemplate {...templateProps} />;
      
      case 'VintageBaseballTemplate':
      case 'vintage-baseball':
        return <VintageBaseballTemplate {...templateProps} />;
      
      default:
        // Fallback to classic template
        return <ClassicBaseballTemplate {...templateProps} />;
    }
  };

  return (
    <div className={`aspect-[5/7] ${className}`}>
      {renderTemplate()}
    </div>
  );
};
