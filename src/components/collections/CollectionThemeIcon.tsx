import React from 'react';
import { Trophy, Wand2, Rocket, User, Palette, Gamepad2 } from 'lucide-react';
import type { CollectionTheme } from '@/repositories/collection/types';

interface CollectionThemeIconProps {
  theme: CollectionTheme;
  className?: string;
}

const themeConfig = {
  sports: { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-400/20' },
  fantasy: { icon: Wand2, color: 'text-purple-400', bg: 'bg-purple-400/20' },
  scifi: { icon: Rocket, color: 'text-cyan-400', bg: 'bg-cyan-400/20' },
  personal: { icon: User, color: 'text-green-400', bg: 'bg-green-400/20' },
  art: { icon: Palette, color: 'text-pink-400', bg: 'bg-pink-400/20' },
  gaming: { icon: Gamepad2, color: 'text-blue-400', bg: 'bg-blue-400/20' }
};

export const CollectionThemeIcon: React.FC<CollectionThemeIconProps> = ({ theme, className = '' }) => {
  const config = themeConfig[theme];
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} ${className}`}>
      <Icon className={`h-3 w-3 ${config.color}`} />
      <span className={`text-xs font-medium capitalize ${config.color}`}>
        {theme}
      </span>
    </div>
  );
};