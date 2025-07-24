import React, { useState } from 'react';
import { Globe, Sparkles, Sun, Moon, Zap } from 'lucide-react';
import { Button } from '../ui/button';

export type SpaceEnvironment = 'starfield' | 'nebula' | 'deep_space' | 'cinematic' | 'clean';

interface EnvironmentSwitcherProps {
  currentEnvironment: SpaceEnvironment;
  onEnvironmentChange: (environment: SpaceEnvironment) => void;
}

const environments = [
  {
    id: 'starfield' as SpaceEnvironment,
    name: 'Starfield',
    icon: Sparkles,
    description: 'Classic space with stars'
  },
  {
    id: 'nebula' as SpaceEnvironment,
    name: 'Nebula',
    icon: Zap,
    description: 'Colorful cosmic clouds'
  },
  {
    id: 'deep_space' as SpaceEnvironment,
    name: 'Deep Space',
    icon: Moon,
    description: 'Minimal dark space'
  },
  {
    id: 'cinematic' as SpaceEnvironment,
    name: 'Cinematic',
    icon: Sun,
    description: 'Dramatic lighting'
  },
  {
    id: 'clean' as SpaceEnvironment,
    name: 'Clean',
    icon: Globe,
    description: 'Studio-style space'
  }
];

export const EnvironmentSwitcher: React.FC<EnvironmentSwitcherProps> = ({
  currentEnvironment,
  onEnvironmentChange
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentEnv = environments.find(env => env.id === currentEnvironment);
  const CurrentIcon = currentEnv?.icon || Globe;

  return (
    <div className="relative">
      {/* Environment Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group text-white/40 hover:text-[#3772FF] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center border"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.12) 100%)',
          borderColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px) saturate(180%)'
        }}
        title={`Current: ${currentEnv?.name || 'Unknown'}`}
      >
        <CurrentIcon className="w-4 h-4 transition-transform group-hover:scale-110" />
      </button>

      {/* Environment Picker Dropdown */}
      {isOpen && (
        <div 
          className="absolute bottom-full left-0 mb-2 min-w-48 rounded-xl shadow-2xl border overflow-hidden z-[60]"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px) saturate(180%)'
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-white/10">
            <h3 className="text-white text-sm font-semibold">Space Environments</h3>
            <p className="text-gray-400 text-xs">Choose lighting & atmosphere</p>
          </div>

          {/* Environment Options */}
          <div className="py-2">
            {environments.map((env) => {
              const Icon = env.icon;
              const isActive = env.id === currentEnvironment;
              
              return (
                <button
                  key={env.id}
                  onClick={() => {
                    onEnvironmentChange(env.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-200 hover:bg-white/10 ${
                    isActive ? 'bg-white/5 border-r-2 border-blue-400' : ''
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-gray-300'}`} />
                  <div className="flex-1 text-left">
                    <div className={`text-sm font-medium ${isActive ? 'text-blue-400' : 'text-white'}`}>
                      {env.name}
                    </div>
                    <div className="text-xs text-gray-400">
                      {env.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 bg-black/20 border-t border-white/10">
            <p className="text-xs text-gray-500">
              Environments affect lighting & reflections
            </p>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[59]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};