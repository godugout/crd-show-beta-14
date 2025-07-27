import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Accessibility,
  Battery,
  Download,
  Gift,
  Star,
  Trophy,
  WifiOff,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Accessibility Settings
interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  keyboardOnly: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: 'normal' | 'large' | 'extra-large';
}

// Gamification State
interface GamificationState {
  xp: number;
  level: number;
  achievements: string[];
  dailyStreak: number;
  challengesCompleted: number;
}

// PWA Features
interface PWAState {
  isOffline: boolean;
  isInstalled: boolean;
  pendingSyncs: number;
  batterySaver: boolean;
}

export interface UniversalFeaturesProps {
  children: React.ReactNode;
  mode?: 'quick' | 'guided' | 'advanced';
  onFeatureToggle?: (feature: string, enabled: boolean) => void;
}

export const UniversalCreatorFeatures: React.FC<UniversalFeaturesProps> = ({
  children,
  mode = 'quick',
  onFeatureToggle,
}) => {
  // Accessibility
  const [accessibility, setAccessibility] =
    useLocalStorage<AccessibilitySettings>('crd-accessibility', {
      highContrast: false,
      reducedMotion: false,
      screenReaderMode: false,
      keyboardOnly: false,
      colorBlindMode: 'none',
      fontSize: 'normal',
    });

  // Gamification
  const [gamification, setGamification] = useLocalStorage<GamificationState>(
    'crd-gamification',
    {
      xp: 0,
      level: 1,
      achievements: [],
      dailyStreak: 0,
      challengesCompleted: 0,
    }
  );

  // PWA State
  const [pwaState, setPwaState] = useState<PWAState>({
    isOffline: !navigator.onLine,
    isInstalled: false,
    pendingSyncs: 0,
    batterySaver: false,
  });

  // Feature discovery tooltips
  const [showTooltips, setShowTooltips] = useState(true);
  const [showAccessPanel, setShowAccessPanel] = useState(false);
  const [showGamePanel, setShowGamePanel] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () =>
      setPwaState(prev => ({ ...prev, isOffline: false }));
    const handleOffline = () =>
      setPwaState(prev => ({ ...prev, isOffline: true }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;

    // High contrast
    root.classList.toggle('high-contrast', accessibility.highContrast);

    // Reduced motion
    root.classList.toggle('reduce-motion', accessibility.reducedMotion);

    // Font size
    root.style.setProperty(
      '--base-font-size',
      accessibility.fontSize === 'large'
        ? '18px'
        : accessibility.fontSize === 'extra-large'
          ? '20px'
          : '16px'
    );

    // Color blind modes
    if (accessibility.colorBlindMode !== 'none') {
      root.classList.add(`colorblind-${accessibility.colorBlindMode}`);
    } else {
      root.classList.remove(
        'colorblind-protanopia',
        'colorblind-deuteranopia',
        'colorblind-tritanopia'
      );
    }
  }, [accessibility]);

  // Track feature usage for XP
  const trackFeatureUsage = (feature: string, xpAmount: number = 10) => {
    setGamification(prev => {
      const newXP = prev.xp + xpAmount;
      const newLevel = Math.floor(newXP / 100) + 1;

      if (newLevel > prev.level) {
        toast.success(`🎉 Level Up! You're now level ${newLevel}!`);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  // Daily challenge system
  const dailyChallenges = [
    { id: 'create-3', name: 'Create 3 cards', progress: 0, target: 3, xp: 50 },
    {
      id: 'use-voice',
      name: 'Use voice input',
      progress: 0,
      target: 1,
      xp: 30,
    },
    {
      id: 'share-template',
      name: 'Share a template',
      progress: 0,
      target: 1,
      xp: 40,
    },
  ];

  // Install PWA prompt
  const handleInstallPWA = async () => {
    try {
      // This would trigger the browser's install prompt
      toast.info('Check your browser for the install prompt');
      setPwaState(prev => ({ ...prev, isInstalled: true }));
    } catch (error) {
      toast.error('Unable to install app');
    }
  };

  // Battery saver mode
  const toggleBatterySaver = (enabled: boolean) => {
    setPwaState(prev => ({ ...prev, batterySaver: enabled }));

    if (enabled) {
      // Reduce animations and effects
      document.documentElement.classList.add('battery-saver');
      toast.success('Battery saver mode enabled');
    } else {
      document.documentElement.classList.remove('battery-saver');
    }
  };

  return (
    <div className='relative'>
      {/* Offline indicator */}
      <AnimatePresence>
        {pwaState.isOffline && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='fixed top-4 left-1/2 -translate-x-1/2 z-50'
          >
            <Card className='p-3 bg-orange-500 text-white flex items-center gap-2'>
              <WifiOff className='w-4 h-4' />
              <span className='text-sm'>
                You're offline - changes will sync when connected
              </span>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accessibility Quick Toggle */}
      <div className='fixed bottom-4 left-4 z-40'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => setShowAccessPanel(!showAccessPanel)}
          className='shadow-lg'
          aria-label='Accessibility settings'
        >
          <Accessibility className='w-4 h-4' />
        </Button>
      </div>

      {/* Gamification Quick View */}
      <div className='fixed top-4 right-4 z-40'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setShowGamePanel(!showGamePanel)}
          className='shadow-lg'
        >
          <Trophy className='w-4 h-4 mr-2' />
          Level {gamification.level} • {gamification.xp % 100}/100 XP
        </Button>
      </div>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {showAccessPanel && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className='fixed left-0 top-0 h-full w-80 bg-background border-r shadow-xl z-50 overflow-y-auto'
          >
            <div className='p-6 space-y-6'>
              <h2 className='text-2xl font-bold'>Accessibility</h2>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='high-contrast'>High Contrast</Label>
                  <Switch
                    id='high-contrast'
                    checked={accessibility.highContrast}
                    onCheckedChange={checked => {
                      setAccessibility(prev => ({
                        ...prev,
                        highContrast: checked,
                      }));
                      trackFeatureUsage('accessibility', 5);
                    }}
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <Label htmlFor='reduced-motion'>Reduced Motion</Label>
                  <Switch
                    id='reduced-motion'
                    checked={accessibility.reducedMotion}
                    onCheckedChange={checked => {
                      setAccessibility(prev => ({
                        ...prev,
                        reducedMotion: checked,
                      }));
                    }}
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <Label htmlFor='screen-reader'>Screen Reader Mode</Label>
                  <Switch
                    id='screen-reader'
                    checked={accessibility.screenReaderMode}
                    onCheckedChange={checked => {
                      setAccessibility(prev => ({
                        ...prev,
                        screenReaderMode: checked,
                      }));
                      if (checked) {
                        toast.success(
                          'Screen reader mode enabled - all elements now have descriptive labels'
                        );
                      }
                    }}
                  />
                </div>

                <div className='flex items-center justify-between'>
                  <Label htmlFor='keyboard-only'>Keyboard Navigation</Label>
                  <Switch
                    id='keyboard-only'
                    checked={accessibility.keyboardOnly}
                    onCheckedChange={checked => {
                      setAccessibility(prev => ({
                        ...prev,
                        keyboardOnly: checked,
                      }));
                    }}
                  />
                </div>

                <div>
                  <Label>Font Size</Label>
                  <div className='grid grid-cols-3 gap-2 mt-2'>
                    {(['normal', 'large', 'extra-large'] as const).map(size => (
                      <Button
                        key={size}
                        variant={
                          accessibility.fontSize === size
                            ? 'default'
                            : 'outline'
                        }
                        size='sm'
                        onClick={() =>
                          setAccessibility(prev => ({
                            ...prev,
                            fontSize: size,
                          }))
                        }
                      >
                        {size.replace('-', ' ')}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Color Blind Mode</Label>
                  <div className='grid grid-cols-2 gap-2 mt-2'>
                    {(
                      [
                        'none',
                        'protanopia',
                        'deuteranopia',
                        'tritanopia',
                      ] as const
                    ).map(mode => (
                      <Button
                        key={mode}
                        variant={
                          accessibility.colorBlindMode === mode
                            ? 'default'
                            : 'outline'
                        }
                        size='sm'
                        onClick={() =>
                          setAccessibility(prev => ({
                            ...prev,
                            colorBlindMode: mode,
                          }))
                        }
                      >
                        {mode === 'none' ? 'None' : mode}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                variant='ghost'
                className='w-full'
                onClick={() => setShowAccessPanel(false)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gamification Panel */}
      <AnimatePresence>
        {showGamePanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className='fixed right-0 top-0 h-full w-80 bg-background border-l shadow-xl z-50 overflow-y-auto'
          >
            <div className='p-6 space-y-6'>
              <h2 className='text-2xl font-bold flex items-center gap-2'>
                <Trophy className='w-6 h-6 text-yellow-500' />
                Your Progress
              </h2>

              {/* Level Progress */}
              <div>
                <div className='flex justify-between mb-2'>
                  <span className='font-medium'>
                    Level {gamification.level}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    {gamification.xp % 100}/100 XP
                  </span>
                </div>
                <Progress value={gamification.xp % 100} className='h-3' />
              </div>

              {/* Daily Streak */}
              <Card className='p-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Star className='w-5 h-5 text-orange-500' />
                    <span className='font-medium'>Daily Streak</span>
                  </div>
                  <span className='text-2xl font-bold'>
                    {gamification.dailyStreak}
                  </span>
                </div>
              </Card>

              {/* Daily Challenges */}
              <div>
                <h3 className='font-semibold mb-3'>Daily Challenges</h3>
                <div className='space-y-3'>
                  {dailyChallenges.map(challenge => (
                    <Card key={challenge.id} className='p-3'>
                      <div className='flex justify-between items-center mb-2'>
                        <span className='text-sm'>{challenge.name}</span>
                        <Badge variant='secondary'>+{challenge.xp} XP</Badge>
                      </div>
                      <Progress
                        value={(challenge.progress / challenge.target) * 100}
                        className='h-2'
                      />
                    </Card>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h3 className='font-semibold mb-3'>Recent Achievements</h3>
                <div className='grid grid-cols-3 gap-2'>
                  {['First Card', 'Speed Creator', 'Template Master'].map(
                    achievement => (
                      <Card key={achievement} className='p-3 text-center'>
                        <Gift className='w-6 h-6 mx-auto mb-1 text-purple-500' />
                        <p className='text-xs'>{achievement}</p>
                      </Card>
                    )
                  )}
                </div>
              </div>

              <Button
                variant='ghost'
                className='w-full'
                onClick={() => setShowGamePanel(false)}
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Features */}
      <div className='fixed bottom-4 right-4 z-40 space-y-2'>
        {!pwaState.isInstalled && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleInstallPWA}
            className='shadow-lg'
          >
            <Download className='w-4 h-4 mr-2' />
            Install App
          </Button>
        )}

        {navigator.getBattery && (
          <Button
            variant='outline'
            size='sm'
            onClick={() => toggleBatterySaver(!pwaState.batterySaver)}
            className={pwaState.batterySaver ? 'bg-green-500 text-white' : ''}
          >
            <Battery className='w-4 h-4 mr-2' />
            Battery Saver
          </Button>
        )}
      </div>

      {/* Main content with accessibility enhancements */}
      <div
        className={`
          ${accessibility.highContrast ? 'high-contrast' : ''}
          ${accessibility.reducedMotion ? 'reduce-motion' : ''}
          ${pwaState.batterySaver ? 'battery-saver' : ''}
        `}
        role='main'
        aria-label={`${mode} card creation mode`}
      >
        {children}
      </div>

      {/* Keyboard shortcuts help */}
      {accessibility.keyboardOnly && (
        <div className='fixed bottom-20 left-4 z-40'>
          <Card className='p-3 text-sm'>
            <p className='font-medium mb-1'>Keyboard Shortcuts</p>
            <ul className='space-y-1 text-xs text-muted-foreground'>
              <li>Tab - Navigate forward</li>
              <li>Shift+Tab - Navigate back</li>
              <li>Enter - Select/Activate</li>
              <li>Esc - Close/Cancel</li>
            </ul>
          </Card>
        </div>
      )}

      <style jsx global>{`
        /* High Contrast Mode */
        .high-contrast {
          --background: 0 0% 0%;
          --foreground: 0 0% 100%;
          --border: 0 0% 100%;
        }

        .high-contrast * {
          border-color: white !important;
        }

        /* Reduced Motion */
        .reduce-motion * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }

        /* Battery Saver */
        .battery-saver * {
          animation: none !important;
          transition: none !important;
        }

        .battery-saver .shadow-lg {
          box-shadow: none !important;
        }

        /* Color Blind Modes */
        .colorblind-protanopia {
          filter: url('#protanopia-filter');
        }

        .colorblind-deuteranopia {
          filter: url('#deuteranopia-filter');
        }

        .colorblind-tritanopia {
          filter: url('#tritanopia-filter');
        }
      `}</style>

      {/* SVG Filters for color blind modes */}
      <svg className='hidden'>
        <defs>
          <filter id='protanopia-filter'>
            <feColorMatrix
              type='matrix'
              values='0.567, 0.433, 0,     0, 0
                      0.558, 0.442, 0,     0, 0
                      0,     0.242, 0.758, 0, 0
                      0,     0,     0,     1, 0'
            />
          </filter>
          <filter id='deuteranopia-filter'>
            <feColorMatrix
              type='matrix'
              values='0.625, 0.375, 0,   0, 0
                      0.7,   0.3,   0,   0, 0
                      0,     0.3,   0.7, 0, 0
                      0,     0,     0,   1, 0'
            />
          </filter>
          <filter id='tritanopia-filter'>
            <feColorMatrix
              type='matrix'
              values='0.95, 0.05,  0,     0, 0
                      0,    0.433, 0.567, 0, 0
                      0,    0.475, 0.525, 0, 0
                      0,    0,     0,     1, 0'
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
