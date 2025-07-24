import React from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { ArrowRight, Lightbulb, CheckCircle, Upload, Palette } from 'lucide-react';

interface DustySuggestedAction {
  id: string;
  label: string;
  type: 'primary' | 'secondary' | 'suggestion';
  icon?: 'arrow' | 'lightbulb' | 'check' | 'upload' | 'palette';
  action: () => void;
}

interface DustyActionButtonsProps {
  actions: DustySuggestedAction[];
}

export const DustyActionButtons: React.FC<DustyActionButtonsProps> = ({ actions }) => {
  const getIcon = (iconType?: string) => {
    switch (iconType) {
      case 'arrow':
        return <ArrowRight className="w-3 h-3" />;
      case 'lightbulb':
        return <Lightbulb className="w-3 h-3" />;
      case 'check':
        return <CheckCircle className="w-3 h-3" />;
      case 'upload':
        return <Upload className="w-3 h-3" />;
      case 'palette':
        return <Palette className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getButtonVariant = (type: string) => {
    switch (type) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <CRDButton
          key={action.id}
          variant={getButtonVariant(action.type)}
          size="sm"
          onClick={action.action}
          className="text-xs flex items-center gap-1.5 animate-fade-in"
        >
          {getIcon(action.icon)}
          {action.label}
        </CRDButton>
      ))}
    </div>
  );
};