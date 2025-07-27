import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AccentText,
  CRDBadge,
  CRDButton,
  CRDCard,
  CRDInput,
  EffectCard,
  Typography,
} from '@/components/ui/design-system';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';

interface ThemeToken {
  name: string;
  value: string;
  category: 'colors' | 'spacing' | 'typography' | 'effects';
  description: string;
}

interface ThemePreset {
  name: string;
  description: string;
  tokens: Record<string, string>;
}

const DEFAULT_THEME_TOKENS: ThemeToken[] = [
  // Colors
  {
    name: '--crd-blue',
    value: '#3772FF',
    category: 'colors',
    description: 'Primary blue color',
  },
  {
    name: '--crd-orange',
    value: '#F97316',
    category: 'colors',
    description: 'Primary orange color',
  },
  {
    name: '--crd-green',
    value: '#45B26B',
    category: 'colors',
    description: 'Success green color',
  },
  {
    name: '--crd-purple',
    value: '#9757D7',
    category: 'colors',
    description: 'Purple accent color',
  },
  {
    name: '--crd-gold',
    value: '#FFD700',
    category: 'colors',
    description: 'Gold accent color',
  },
  {
    name: '--crd-darkest',
    value: '#121212',
    category: 'colors',
    description: 'Darkest background',
  },
  {
    name: '--crd-darker',
    value: '#1A1A1A',
    category: 'colors',
    description: 'Darker background',
  },
  {
    name: '--crd-dark',
    value: '#23262F',
    category: 'colors',
    description: 'Dark background',
  },
  {
    name: '--crd-darkGray',
    value: '#23262F',
    category: 'colors',
    description: 'Dark gray surface',
  },
  {
    name: '--crd-mediumGray',
    value: '#353945',
    category: 'colors',
    description: 'Medium gray border',
  },
  {
    name: '--crd-lightGray',
    value: '#777E90',
    category: 'colors',
    description: 'Light gray text',
  },
  {
    name: '--crd-white',
    value: '#FCFCFD',
    category: 'colors',
    description: 'White text',
  },

  // Spacing
  {
    name: '--spacing-xs',
    value: '0.25rem',
    category: 'spacing',
    description: 'Extra small spacing',
  },
  {
    name: '--spacing-sm',
    value: '0.5rem',
    category: 'spacing',
    description: 'Small spacing',
  },
  {
    name: '--spacing-md',
    value: '1rem',
    category: 'spacing',
    description: 'Medium spacing',
  },
  {
    name: '--spacing-lg',
    value: '1.5rem',
    category: 'spacing',
    description: 'Large spacing',
  },
  {
    name: '--spacing-xl',
    value: '2rem',
    category: 'spacing',
    description: 'Extra large spacing',
  },

  // Typography
  {
    name: '--font-size-xs',
    value: '0.75rem',
    category: 'typography',
    description: 'Extra small text',
  },
  {
    name: '--font-size-sm',
    value: '0.875rem',
    category: 'typography',
    description: 'Small text',
  },
  {
    name: '--font-size-base',
    value: '1rem',
    category: 'typography',
    description: 'Base text size',
  },
  {
    name: '--font-size-lg',
    value: '1.125rem',
    category: 'typography',
    description: 'Large text',
  },
  {
    name: '--font-size-xl',
    value: '1.25rem',
    category: 'typography',
    description: 'Extra large text',
  },
  {
    name: '--font-size-2xl',
    value: '1.5rem',
    category: 'typography',
    description: '2XL text',
  },
  {
    name: '--font-size-3xl',
    value: '1.875rem',
    category: 'typography',
    description: '3XL text',
  },
  {
    name: '--font-size-4xl',
    value: '2.25rem',
    category: 'typography',
    description: '4XL text',
  },

  // Effects
  {
    name: '--border-radius-sm',
    value: '0.375rem',
    category: 'effects',
    description: 'Small border radius',
  },
  {
    name: '--border-radius-md',
    value: '0.5rem',
    category: 'effects',
    description: 'Medium border radius',
  },
  {
    name: '--border-radius-lg',
    value: '0.75rem',
    category: 'effects',
    description: 'Large border radius',
  },
  {
    name: '--border-radius-xl',
    value: '1rem',
    category: 'effects',
    description: 'Extra large border radius',
  },
  {
    name: '--shadow-sm',
    value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    category: 'effects',
    description: 'Small shadow',
  },
  {
    name: '--shadow-md',
    value: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    category: 'effects',
    description: 'Medium shadow',
  },
  {
    name: '--shadow-lg',
    value: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    category: 'effects',
    description: 'Large shadow',
  },
];

const THEME_PRESETS: ThemePreset[] = [
  {
    name: 'CRD Default',
    description: 'Standard CRD dark theme',
    tokens: {
      '--crd-blue': '#3772FF',
      '--crd-orange': '#F97316',
      '--crd-green': '#45B26B',
      '--crd-purple': '#9757D7',
      '--crd-darkest': '#121212',
      '--crd-darker': '#1A1A1A',
      '--crd-dark': '#23262F',
      '--crd-darkGray': '#23262F',
      '--crd-mediumGray': '#353945',
      '--crd-lightGray': '#777E90',
      '--crd-white': '#FCFCFD',
    },
  },
  {
    name: 'CRD Light',
    description: 'Light theme variant',
    tokens: {
      '--crd-blue': '#3772FF',
      '--crd-orange': '#F97316',
      '--crd-green': '#45B26B',
      '--crd-purple': '#9757D7',
      '--crd-darkest': '#FFFFFF',
      '--crd-darker': '#F8F9FA',
      '--crd-dark': '#E9ECEF',
      '--crd-darkGray': '#DEE2E6',
      '--crd-mediumGray': '#CED4DA',
      '--crd-lightGray': '#6C757D',
      '--crd-white': '#1A1A1A',
    },
  },
  {
    name: 'CRD Vintage',
    description: 'Vintage/retro theme',
    tokens: {
      '--crd-blue': '#8B4513',
      '--crd-orange': '#D2691E',
      '--crd-green': '#228B22',
      '--crd-purple': '#800080',
      '--crd-darkest': '#F5F5DC',
      '--crd-darker': '#FAEBD7',
      '--crd-dark': '#F0E68C',
      '--crd-darkGray': '#DEB887',
      '--crd-mediumGray': '#D2B48C',
      '--crd-lightGray': '#A9A9A9',
      '--crd-white': '#2F2F2F',
    },
  },
  {
    name: 'CRD Neon',
    description: 'Neon/cyberpunk theme',
    tokens: {
      '--crd-blue': '#00FFFF',
      '--crd-orange': '#FF00FF',
      '--crd-green': '#00FF00',
      '--crd-purple': '#8000FF',
      '--crd-darkest': '#000000',
      '--crd-darker': '#1A1A1A',
      '--crd-dark': '#2A2A2A',
      '--crd-darkGray': '#333333',
      '--crd-mediumGray': '#444444',
      '--crd-lightGray': '#666666',
      '--crd-white': '#FFFFFF',
    },
  },
];

export const ThemeTester: React.FC = () => {
  const [themeTokens, setThemeTokens] =
    useState<ThemeToken[]>(DEFAULT_THEME_TOKENS);
  const [activePreset, setActivePreset] = useState<string>('CRD Default');
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<
    'components' | 'layout' | 'typography'
  >('components');

  // Apply theme tokens to CSS custom properties
  useEffect(() => {
    themeTokens.forEach(token => {
      document.documentElement.style.setProperty(token.name, token.value);
    });
  }, [themeTokens]);

  const updateToken = (name: string, value: string) => {
    setThemeTokens(prev =>
      prev.map(token => (token.name === name ? { ...token, value } : token))
    );
  };

  const applyPreset = (presetName: string) => {
    const preset = THEME_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setActivePreset(presetName);
      setThemeTokens(prev =>
        prev.map(token => ({
          ...token,
          value: preset.tokens[token.name] || token.value,
        }))
      );
    }
  };

  const exportTheme = () => {
    const themeData = {
      name: activePreset,
      tokens: themeTokens.reduce(
        (acc, token) => {
          acc[token.name] = token.value;
          return acc;
        },
        {} as Record<string, string>
      ),
    };

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activePreset.toLowerCase().replace(/\s+/g, '-')}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const themeData = JSON.parse(e.target?.result as string);
          setActivePreset(themeData.name);
          setThemeTokens(prev =>
            prev.map(token => ({
              ...token,
              value: themeData.tokens[token.name] || token.value,
            }))
          );
        } catch (error) {
          console.error('Failed to import theme:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  const getTokensByCategory = (category: ThemeToken['category']) => {
    return themeTokens.filter(token => token.category === category);
  };

  return (
    <div className='min-h-screen bg-crd-darkest text-crd-white p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2'>Theme Tester</h1>
          <p className='text-crd-lightGray'>
            Real-time theme customization and preview
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Theme Controls */}
          <div className='lg:col-span-1 space-y-6'>
            {/* Preset Selector */}
            <Card>
              <CardHeader>
                <CardTitle>Theme Presets</CardTitle>
                <CardDescription>Quick theme switching</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <Select value={activePreset} onValueChange={applyPreset}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select preset' />
                  </SelectTrigger>
                  <SelectContent>
                    {THEME_PRESETS.map(preset => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className='flex gap-2'>
                  <Button onClick={exportTheme} size='sm'>
                    Export Theme
                  </Button>
                  <Button variant='outline' size='sm' asChild>
                    <label>
                      Import Theme
                      <input
                        type='file'
                        accept='.json'
                        onChange={importTheme}
                        className='hidden'
                      />
                    </label>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Token Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Design Tokens</CardTitle>
                <CardDescription>
                  Customize individual design tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue='colors' className='w-full'>
                  <TabsList className='grid w-full grid-cols-4'>
                    <TabsTrigger value='colors'>Colors</TabsTrigger>
                    <TabsTrigger value='spacing'>Spacing</TabsTrigger>
                    <TabsTrigger value='typography'>Typography</TabsTrigger>
                    <TabsTrigger value='effects'>Effects</TabsTrigger>
                  </TabsList>

                  {(
                    ['colors', 'spacing', 'typography', 'effects'] as const
                  ).map(category => (
                    <TabsContent
                      key={category}
                      value={category}
                      className='space-y-4'
                    >
                      {getTokensByCategory(category).map(token => (
                        <div key={token.name} className='space-y-2'>
                          <Label className='text-sm font-medium'>
                            {token.name.replace('--', '')}
                          </Label>
                          <div className='flex gap-2'>
                            <Input
                              value={token.value}
                              onChange={e =>
                                updateToken(token.name, e.target.value)
                              }
                              className='flex-1'
                            />
                            {category === 'colors' && (
                              <div
                                className='w-8 h-8 rounded border border-crd-mediumGray'
                                style={{ backgroundColor: token.value }}
                              />
                            )}
                          </div>
                          <p className='text-xs text-crd-lightGray'>
                            {token.description}
                          </p>
                        </div>
                      ))}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>

            {/* Preview Controls */}
            <Card>
              <CardHeader>
                <CardTitle>Preview Controls</CardTitle>
                <CardDescription>Customize preview display</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center space-x-2'>
                  <Switch
                    checked={showPreview}
                    onCheckedChange={setShowPreview}
                  />
                  <Label>Show Preview</Label>
                </div>

                {showPreview && (
                  <Select
                    value={previewMode}
                    onValueChange={(value: any) => setPreviewMode(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select preview mode' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='components'>Components</SelectItem>
                      <SelectItem value='layout'>Layout</SelectItem>
                      <SelectItem value='typography'>Typography</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Area */}
          {showPreview && (
            <div className='lg:col-span-2'>
              <Card>
                <CardHeader>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>
                    Real-time component preview with current theme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {previewMode === 'components' && (
                    <div className='space-y-6'>
                      {/* Buttons */}
                      <div>
                        <h3 className='text-lg font-semibold mb-4'>Buttons</h3>
                        <div className='flex flex-wrap gap-4'>
                          <CRDButton variant='primary'>Primary</CRDButton>
                          <CRDButton variant='secondary'>Secondary</CRDButton>
                          <CRDButton variant='outline'>Outline</CRDButton>
                          <CRDButton variant='ghost'>Ghost</CRDButton>
                          <CRDButton variant='glass'>Glass</CRDButton>
                          <CRDButton variant='create'>Create</CRDButton>
                        </div>
                      </div>

                      {/* Cards */}
                      <div>
                        <h3 className='text-lg font-semibold mb-4'>Cards</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          <CRDCard>
                            <div className='p-4'>
                              <h4 className='font-semibold mb-2'>CRD Card</h4>
                              <p className='text-sm text-crd-lightGray'>
                                Custom card with current theme
                              </p>
                            </div>
                          </CRDCard>

                          <EffectCard
                            title='Effect Card'
                            description='Interactive effect card'
                            emoji='✨'
                            intensity={75}
                          />
                        </div>
                      </div>

                      {/* Form Elements */}
                      <div>
                        <h3 className='text-lg font-semibold mb-4'>
                          Form Elements
                        </h3>
                        <div className='space-y-4'>
                          <div>
                            <Label>CRD Input</Label>
                            <CRDInput placeholder='Enter text...' />
                          </div>
                          <div>
                            <Label>Standard Input</Label>
                            <Input placeholder='Enter text...' />
                          </div>
                        </div>
                      </div>

                      {/* Feedback Elements */}
                      <div>
                        <h3 className='text-lg font-semibold mb-4'>
                          Feedback Elements
                        </h3>
                        <div className='space-y-4'>
                          <div className='flex gap-2'>
                            <Badge>Default</Badge>
                            <Badge variant='secondary'>Secondary</Badge>
                            <Badge variant='destructive'>Error</Badge>
                            <CRDBadge>CRD Badge</CRDBadge>
                          </div>
                          <Progress value={65} />
                          <Alert>
                            <AlertDescription>
                              This is an alert message with current theme
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewMode === 'layout' && (
                    <div className='space-y-6'>
                      <div>
                        <h3 className='text-lg font-semibold mb-4'>
                          Layout Examples
                        </h3>
                        <div className='space-y-4'>
                          <div className='crd-container bg-crd-darkGray p-4 rounded'>
                            <p className='text-center'>CRD Container</p>
                          </div>
                          <div className='grid grid-cols-3 gap-4'>
                            {Array.from({ length: 3 }, (_, i) => (
                              <div
                                key={i}
                                className='h-20 bg-crd-blue/20 rounded flex items-center justify-center'
                              >
                                Grid Item {i + 1}
                              </div>
                            ))}
                          </div>
                          <div className='flex justify-between items-center bg-crd-darkGray p-4 rounded'>
                            <span>Left</span>
                            <span>Center</span>
                            <span>Right</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {previewMode === 'typography' && (
                    <div className='space-y-6'>
                      <div>
                        <h3 className='text-lg font-semibold mb-4'>
                          Typography Examples
                        </h3>
                        <div className='space-y-4'>
                          <Typography variant='h1'>Heading 1</Typography>
                          <Typography variant='h2'>Heading 2</Typography>
                          <Typography variant='h3'>Heading 3</Typography>
                          <Typography variant='body'>
                            Body text with current theme styling
                          </Typography>
                          <AccentText>Accent text for highlights</AccentText>
                          <p className='text-crd-lightGray'>
                            Muted text example
                          </p>
                          <p className='text-crd-blue'>Primary color text</p>
                          <p className='text-crd-orange'>Accent color text</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
