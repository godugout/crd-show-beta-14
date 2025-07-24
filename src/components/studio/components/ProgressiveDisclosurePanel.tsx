import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Zap, Palette, Camera, Settings, Info } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import type { CaseStyle } from './StudioCaseSelector';
import type { CardData } from '@/types/card';

interface ControlSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  level: 'basic' | 'intermediate' | 'advanced';
  description: string;
}

interface ProgressiveDisclosurePanelProps {
  selectedCard: CardData;
  selectedCase: CaseStyle;
  onCaseChange: (caseStyle: CaseStyle) => void;
  userExperienceLevel: 'beginner' | 'intermediate' | 'expert';
  onExperienceLevelChange: (level: 'beginner' | 'intermediate' | 'expert') => void;
}

const CONTROL_SECTIONS: ControlSection[] = [
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    icon: Zap,
    level: 'basic',
    description: 'Essential controls for viewing and sharing'
  },
  {
    id: 'display-case',
    title: 'Display Case',
    icon: Palette,
    level: 'intermediate',
    description: 'Customize how your card is presented'
  },
  {
    id: 'view-settings',
    title: 'View Settings',
    icon: Camera,
    level: 'intermediate',
    description: 'Adjust lighting, angles, and effects'
  },
  {
    id: 'advanced-options',
    title: 'Advanced Options',
    icon: Settings,
    level: 'advanced',
    description: 'Professional export and customization tools'
  }
];

export const ProgressiveDisclosurePanel: React.FC<ProgressiveDisclosurePanelProps> = ({
  selectedCard,
  selectedCase,
  onCaseChange,
  userExperienceLevel,
  onExperienceLevelChange
}) => {
  const [openSections, setOpenSections] = useState<string[]>(['quick-actions']);
  const [showExperienceTip, setShowExperienceTip] = useState(false);
  const { light, medium } = useHapticFeedback();

  // Auto-expand sections based on user experience level
  useEffect(() => {
    const autoExpandSections = () => {
      switch (userExperienceLevel) {
        case 'beginner':
          return ['quick-actions'];
        case 'intermediate':
          return ['quick-actions', 'display-case'];
        case 'expert':
          return ['quick-actions', 'display-case', 'view-settings'];
        default:
          return ['quick-actions'];
      }
    };

    setOpenSections(autoExpandSections());
  }, [userExperienceLevel]);

  const getVisibleSections = () => {
    switch (userExperienceLevel) {
      case 'beginner':
        return CONTROL_SECTIONS.filter(section => section.level === 'basic');
      case 'intermediate':
        return CONTROL_SECTIONS.filter(section => ['basic', 'intermediate'].includes(section.level));
      case 'expert':
        return CONTROL_SECTIONS;
      default:
        return CONTROL_SECTIONS.filter(section => section.level === 'basic');
    }
  };

  const toggleSection = (sectionId: string) => {
    light();
    setOpenSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleExperienceLevelChange = (level: 'beginner' | 'intermediate' | 'expert') => {
    medium();
    onExperienceLevelChange(level);
    setShowExperienceTip(false);
  };

  const visibleSections = getVisibleSections();

  return (
    <div className="space-y-4">
      
      {/* Experience Level Selector */}
      <div className="bg-themed-light/50 rounded-lg p-4 border border-themed-accent/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-themed-accent" />
            <span className="text-sm font-medium text-themed-primary">Experience Level</span>
          </div>
          <CRDButton
            variant="ghost"
            size="sm"
            onClick={() => setShowExperienceTip(!showExperienceTip)}
            className="w-6 h-6 p-0"
          >
            <Info className="w-3 h-3" />
          </CRDButton>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {(['beginner', 'intermediate', 'expert'] as const).map((level) => (
            <CRDButton
              key={level}
              variant={userExperienceLevel === level ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleExperienceLevelChange(level)}
              className="text-xs py-2"
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </CRDButton>
          ))}
        </div>
        
        {showExperienceTip && (
          <div className="mt-3 text-xs text-themed-secondary animate-fade-in">
            <strong>Beginner:</strong> Essential controls only<br/>
            <strong>Intermediate:</strong> Display customization<br/>
            <strong>Expert:</strong> All professional tools
          </div>
        )}
      </div>

      {/* Progressive Control Sections */}
      <div className="space-y-3">
        {visibleSections.map((section) => {
          const IconComponent = section.icon;
          const isOpen = openSections.includes(section.id);
          
          return (
            <Collapsible key={section.id} open={isOpen} onOpenChange={() => toggleSection(section.id)}>
              <CollapsibleTrigger asChild>
                <CRDButton
                  variant="outline"
                  className="w-full justify-between min-h-[60px] p-4 border border-themed-accent/20 hover:border-themed-accent/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-themed-accent/20 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-themed-accent" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-themed-primary text-sm">
                        {section.title}
                      </div>
                      <div className="text-xs text-themed-secondary">
                        {section.description}
                      </div>
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-themed-secondary" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-themed-secondary" />
                  )}
                </CRDButton>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="animate-accordion-down">
                <div className="mt-2 p-4 bg-themed-light/30 rounded-lg border border-themed-accent/10">
                  
                  {/* Section-specific content */}
                  {section.id === 'quick-actions' && (
                    <div className="grid grid-cols-2 gap-3">
                      <CRDButton variant="outline" size="sm" className="h-12">
                        <Zap className="w-4 h-4 mr-2" />
                        Share
                      </CRDButton>
                      <CRDButton variant="outline" size="sm" className="h-12">
                        <Zap className="w-4 h-4 mr-2" />
                        Download
                      </CRDButton>
                    </div>
                  )}
                  
                  {section.id === 'display-case' && (
                    <div className="space-y-3">
                      <div className="text-xs text-themed-secondary mb-2">
                        Choose how to showcase your card
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {(['none', 'glass', 'wood', 'metal'] as CaseStyle[]).map((caseType) => (
                          <CRDButton
                            key={caseType}
                            variant={selectedCase === caseType ? 'primary' : 'outline'}
                            size="sm"
                            onClick={() => onCaseChange(caseType)}
                            className="text-xs capitalize"
                          >
                            {caseType === 'none' ? 'No Case' : caseType}
                          </CRDButton>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {section.id === 'view-settings' && (
                    <div className="space-y-3">
                      <div className="text-xs text-themed-secondary mb-2">
                        Customize viewing experience
                      </div>
                      <div className="space-y-2">
                        <CRDButton variant="ghost" size="sm" className="w-full justify-start text-xs">
                          Lighting Controls
                        </CRDButton>
                        <CRDButton variant="ghost" size="sm" className="w-full justify-start text-xs">
                          Background Options
                        </CRDButton>
                        <CRDButton variant="ghost" size="sm" className="w-full justify-start text-xs">
                          Animation Settings
                        </CRDButton>
                      </div>
                    </div>
                  )}
                  
                  {section.id === 'advanced-options' && (
                    <div className="space-y-3">
                      <div className="text-xs text-themed-secondary mb-2">
                        Professional tools and settings
                      </div>
                      <div className="space-y-2">
                        <CRDButton variant="ghost" size="sm" className="w-full justify-start text-xs">
                          Export Settings
                        </CRDButton>
                        <CRDButton variant="ghost" size="sm" className="w-full justify-start text-xs">
                          Batch Operations
                        </CRDButton>
                        <CRDButton variant="ghost" size="sm" className="w-full justify-start text-xs">
                          Custom Presets
                        </CRDButton>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Level up suggestion */}
      {userExperienceLevel !== 'expert' && (
        <div className="bg-themed-accent/10 rounded-lg p-3 border border-themed-accent/20">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-themed-accent" />
            <span className="text-sm font-medium text-themed-accent">Level Up</span>
          </div>
          <p className="text-xs text-themed-secondary mb-3">
            Ready for more controls? Unlock {userExperienceLevel === 'beginner' ? 'intermediate' : 'expert'} mode 
            for additional customization options.
          </p>
          <CRDButton
            variant="primary"
            size="sm"
            onClick={() => handleExperienceLevelChange(
              userExperienceLevel === 'beginner' ? 'intermediate' : 'expert'
            )}
            className="text-xs"
          >
            Unlock {userExperienceLevel === 'beginner' ? 'Intermediate' : 'Expert'} Mode
          </CRDButton>
        </div>
      )}
    </div>
  );
};