import React from 'react';
import { Bot, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

interface DustyAvatarProps {
  size: 'small' | 'medium' | 'large';
  expression: 'neutral' | 'friendly' | 'excited' | 'thinking' | 'encouraging';
}

export const DustyAvatar: React.FC<DustyAvatarProps> = ({ size, expression }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const getAvatarContent = () => {
    switch (expression) {
      case 'excited':
        return <Sparkles className="w-6 h-6 text-crd-yellow animate-pulse" />;
      case 'encouraging':
        return <CheckCircle className="w-6 h-6 text-crd-green" />;
      case 'thinking':
        return <AlertCircle className="w-6 h-6 text-crd-blue animate-pulse" />;
      default:
        return <Bot className="w-6 h-6 text-crd-blue" />;
    }
  };

  const getBackgroundGradient = () => {
    switch (expression) {
      case 'excited':
        return 'bg-gradient-to-br from-crd-yellow/20 to-crd-orange/20';
      case 'encouraging':
        return 'bg-gradient-to-br from-crd-green/20 to-crd-blue/20';
      case 'thinking':
        return 'bg-gradient-to-br from-crd-blue/20 to-crd-purple/20';
      default:
        return 'bg-gradient-to-br from-crd-blue/20 to-crd-mediumGray/20';
    }
  };

  return (
    <div className={`
      ${sizeClasses[size]} 
      ${getBackgroundGradient()}
      rounded-full 
      flex items-center justify-center 
      border-2 border-crd-blue/30
      transition-all duration-300
      ${expression === 'excited' ? 'animate-bounce' : ''}
    `}>
      {getAvatarContent()}
    </div>
  );
};