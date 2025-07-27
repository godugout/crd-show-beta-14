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
  PalettePreview,
  PresetCard,
  TeamThemeShowcase,
  Typography,
} from '@/components/ui/design-system';
import { colors } from '@/components/ui/design-system/colors';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { completeLogoThemes } from '@/lib/completeLogoThemes';
import { useState } from 'react';

// Theme definitions
const THEMES = {
  default: {
    name: 'CRD Default',
    colors: {
      primary: '#3772FF',
      secondary: '#2D9CDB',
      accent: '#F97316',
      success: '#45B26B',
      warning: '#EA6E48',
      error: '#FF4444',
      background: '#141416',
      surface: '#1A1D24',
      text: '#FCFCFD',
      textSecondary: '#E6E8EC',
      muted: '#777E90',
    },
  },
  dark: {
    name: 'CRD Dark',
    colors: {
      primary: '#3772FF',
      secondary: '#2D9CDB',
      accent: '#F97316',
      success: '#45B26B',
      warning: '#EA6E48',
      error: '#FF4444',
      background: '#0A0A0A',
      surface: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      muted: '#666666',
    },
  },
  light: {
    name: 'CRD Light',
    colors: {
      primary: '#3772FF',
      secondary: '#2D9CDB',
      accent: '#F97316',
      success: '#45B26B',
      warning: '#EA6E48',
      error: '#FF4444',
      background: '#FFFFFF',
      surface: '#F8F9FA',
      text: '#1A1A1A',
      textSecondary: '#666666',
      muted: '#999999',
    },
  },
  vintage: {
    name: 'CRD Vintage',
    colors: {
      primary: '#8B4513',
      secondary: '#D2691E',
      accent: '#CD853F',
      success: '#228B22',
      warning: '#DAA520',
      error: '#DC143C',
      background: '#F5F5DC',
      surface: '#FAEBD7',
      text: '#2F2F2F',
      textSecondary: '#696969',
      muted: '#A9A9A9',
    },
  },
  neon: {
    name: 'CRD Neon',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#00FF00',
      success: '#00FF7F',
      warning: '#FFD700',
      error: '#FF1493',
      background: '#000000',
      surface: '#1A1A1A',
      text: '#FFFFFF',
      textSecondary: '#CCCCCC',
      muted: '#666666',
    },
  },
};

export default function DesignGuide() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [showGrid, setShowGrid] = useState(false);
  const [showSpacing, setShowSpacing] = useState(false);

  const theme = THEMES[currentTheme as keyof typeof THEMES];

  const applyTheme = (themeName: string) => {
    setCurrentTheme(themeName);
    const selectedTheme = THEMES[themeName as keyof typeof THEMES];

    // Apply CSS custom properties
    Object.entries(selectedTheme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--theme-${key}`, value);
    });
  };

  return (
    <div className='min-h-screen bg-crd-darkest text-crd-white p-6'>
      {/* Header */}
      <div className='max-w-7xl mx-auto mb-8'>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-4xl font-bold mb-2'>CRD Design Guide</h1>
            <p className='text-crd-lightGray'>
              Complete design system and component library
            </p>
          </div>

          {/* Theme Selector */}
          <div className='flex items-center gap-4'>
            <Select value={currentTheme} onValueChange={applyTheme}>
              <SelectTrigger className='w-48'>
                <SelectValue placeholder='Select theme' />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(THEMES).map(([key, theme]) => (
                  <SelectItem key={key} value={key}>
                    {theme.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='flex items-center gap-2'>
              <Switch checked={showGrid} onCheckedChange={setShowGrid} />
              <span className='text-sm'>Grid</span>
            </div>

            <div className='flex items-center gap-2'>
              <Switch checked={showSpacing} onCheckedChange={setShowSpacing} />
              <span className='text-sm'>Spacing</span>
            </div>
          </div>
        </div>

        {/* Current Theme Preview */}
        <Card className='mb-6'>
          <CardHeader>
            <CardTitle>Current Theme: {theme.name}</CardTitle>
            <CardDescription>
              Active color palette and design tokens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              {Object.entries(theme.colors).map(([key, color]) => (
                <div key={key} className='space-y-2'>
                  <div
                    className='w-full h-12 rounded border border-crd-mediumGray'
                    style={{ backgroundColor: color }}
                  />
                  <div className='text-xs'>
                    <div className='font-medium text-crd-white'>{key}</div>
                    <div className='text-crd-lightGray'>{color}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto'>
        <Tabs defaultValue='components' className='space-y-6'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='components'>Components</TabsTrigger>
            <TabsTrigger value='typography'>Typography</TabsTrigger>
            <TabsTrigger value='colors'>Colors</TabsTrigger>
            <TabsTrigger value='spacing'>Spacing & Layout</TabsTrigger>
          </TabsList>

          {/* Components Tab */}
          <TabsContent value='components' className='space-y-8'>
            {/* Buttons */}
            <section>
              <h2 className='text-2xl font-bold mb-4'>Buttons</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>CRD Buttons</CardTitle>
                    <CardDescription>
                      Primary action buttons with team spirit glow
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <CRDButton variant='primary'>Primary Action</CRDButton>
                    <CRDButton variant='secondary'>Secondary Action</CRDButton>
                    <CRDButton variant='outline'>Outline Button</CRDButton>
                    <CRDButton variant='ghost'>Ghost Button</CRDButton>
                    <CRDButton variant='glass'>Glass Button</CRDButton>
                    <CRDButton variant='create'>Create Card</CRDButton>
                    <CRDButton variant='collective'>Join Collective</CRDButton>
                    <CRDButton variant='collect'>Collect Cards</CRDButton>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Standard Buttons</CardTitle>
                    <CardDescription>Shadcn UI button variants</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Button>Default</Button>
                    <Button variant='secondary'>Secondary</Button>
                    <Button variant='outline'>Outline</Button>
                    <Button variant='ghost'>Ghost</Button>
                    <Button variant='destructive'>Destructive</Button>
                    <Button variant='link'>Link</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Button States</CardTitle>
                    <CardDescription>
                      Interactive states and loading
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Button disabled>Disabled</Button>
                    <Button>
                      <div className='animate-spin mr-2'>⏳</div>
                      Loading
                    </Button>
                    <Button size='sm'>Small</Button>
                    <Button size='lg'>Large</Button>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Cards */}
            <section>
              <h2 className='text-2xl font-bold mb-4'>Cards</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>CRD Cards</CardTitle>
                    <CardDescription>Custom card components</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <CRDCard>
                      <div className='p-4'>
                        <h3 className='font-semibold mb-2'>CRD Card</h3>
                        <p className='text-sm text-crd-lightGray'>
                          Custom card with CRD styling
                        </p>
                      </div>
                    </CRDCard>

                    <EffectCard
                      title='Holographic Effect'
                      description='Premium holographic finish'
                      emoji='✨'
                      intensity={85}
                    />

                    <PresetCard
                      title='Vintage Template'
                      emoji='📜'
                      isSelected={true}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Standard Cards</CardTitle>
                    <CardDescription>Shadcn UI card variants</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Card>
                      <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card description</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Card content goes here</p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Cards</CardTitle>
                    <CardDescription>Cards with hover effects</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Card className='cursor-pointer hover:shadow-lg transition-all'>
                      <CardContent className='p-4'>
                        <h3 className='font-semibold mb-2'>Hover Card</h3>
                        <p className='text-sm text-crd-lightGray'>
                          Hover to see effects
                        </p>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Form Elements */}
            <section>
              <h2 className='text-2xl font-bold mb-4'>Form Elements</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Inputs</CardTitle>
                    <CardDescription>Text input components</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>CRD Input</label>
                      <CRDInput placeholder='Enter text...' />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Standard Input
                      </label>
                      <Input placeholder='Enter text...' />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Disabled Input
                      </label>
                      <Input placeholder='Disabled' disabled />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Select & Switch</CardTitle>
                    <CardDescription>Selection components</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Select</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder='Select option' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='option1'>Option 1</SelectItem>
                          <SelectItem value='option2'>Option 2</SelectItem>
                          <SelectItem value='option3'>Option 3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <Switch />
                      <label className='text-sm'>Toggle switch</label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Feedback Elements */}
            <section>
              <h2 className='text-2xl font-bold mb-4'>Feedback Elements</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Alerts & Badges</CardTitle>
                    <CardDescription>Status indicators</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Alert>
                      <AlertDescription>
                        This is a default alert message
                      </AlertDescription>
                    </Alert>

                    <div className='flex gap-2'>
                      <Badge>Default</Badge>
                      <Badge variant='secondary'>Secondary</Badge>
                      <Badge variant='destructive'>Error</Badge>
                      <CRDBadge>CRD Badge</CRDBadge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Progress & Sliders</CardTitle>
                    <CardDescription>Progress indicators</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>
                        Progress Bar
                      </label>
                      <Progress value={65} />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Slider</label>
                      <Slider defaultValue={[50]} max={100} step={1} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Typography Tab */}
          <TabsContent value='typography' className='space-y-8'>
            <section>
              <h2 className='text-2xl font-bold mb-4'>Typography System</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>CRD Typography</CardTitle>
                    <CardDescription>
                      Custom typography components
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <Typography variant='h1'>
                      Heading 1 - CRD Typography
                    </Typography>
                    <Typography variant='h2'>
                      Heading 2 - CRD Typography
                    </Typography>
                    <Typography variant='h3'>
                      Heading 3 - CRD Typography
                    </Typography>
                    <Typography variant='body'>
                      Body text with CRD styling
                    </Typography>
                    <AccentText>Accent text for highlights</AccentText>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Standard Typography</CardTitle>
                    <CardDescription>HTML heading elements</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <h1 className='text-4xl font-bold'>Heading 1</h1>
                    <h2 className='text-3xl font-bold'>Heading 2</h2>
                    <h3 className='text-2xl font-bold'>Heading 3</h3>
                    <h4 className='text-xl font-bold'>Heading 4</h4>
                    <h5 className='text-lg font-bold'>Heading 5</h5>
                    <h6 className='text-base font-bold'>Heading 6</h6>
                    <p className='text-base'>Body paragraph text</p>
                    <p className='text-sm text-crd-lightGray'>
                      Small muted text
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-bold mb-4'>Text Styles</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Font Weights</CardTitle>
                    <CardDescription>
                      Different font weight variations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <p className='font-light'>Light weight text</p>
                    <p className='font-normal'>Normal weight text</p>
                    <p className='font-medium'>Medium weight text</p>
                    <p className='font-semibold'>Semibold weight text</p>
                    <p className='font-bold'>Bold weight text</p>
                    <p className='font-extrabold'>Extrabold weight text</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Text Colors</CardTitle>
                    <CardDescription>Color variations for text</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-2'>
                    <p className='text-crd-white'>Primary text</p>
                    <p className='text-crd-lightGray'>Secondary text</p>
                    <p className='text-crd-blue'>Primary color text</p>
                    <p className='text-crd-orange'>Accent color text</p>
                    <p className='text-crd-green'>Success color text</p>
                    <p className='text-crd-purple'>Purple accent text</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Colors Tab */}
          <TabsContent value='colors' className='space-y-8'>
            <section>
              <h2 className='text-2xl font-bold mb-4'>Color System</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>CRD Brand Colors</CardTitle>
                    <CardDescription>
                      Primary brand color palette
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PalettePreview
                      colors={[
                        colors.primary.blue,
                        colors.primary.orange,
                        colors.primary.green,
                        colors.primary.purple,
                        colors.primary.gold,
                      ]}
                      title='Brand Colors'
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Neutral Colors</CardTitle>
                    <CardDescription>
                      Background and text colors
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PalettePreview
                      colors={[
                        colors.neutral.darkest,
                        colors.neutral.dark,
                        colors.neutral.darkGray,
                        colors.neutral.mediumGray,
                        colors.neutral.lightGray,
                        colors.neutral.white,
                      ]}
                      title='Neutral Palette'
                    />
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-bold mb-4'>Team Themes</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {Object.entries(completeLogoThemes)
                  .slice(0, 6)
                  .map(([key, themeData]) => (
                    <TeamThemeShowcase
                      key={key}
                      theme={{
                        name: key,
                        primary: themeData.logoTheme.primary,
                        secondary: themeData.logoTheme.secondary,
                        accent: themeData.logoTheme.accent,
                      }}
                    />
                  ))}
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-bold mb-4'>Color Usage</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Background Colors</CardTitle>
                    <CardDescription>
                      Surface and background colors
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='p-4 bg-crd-darkest rounded'>
                      Darkest background
                    </div>
                    <div className='p-4 bg-crd-darker rounded'>
                      Darker background
                    </div>
                    <div className='p-4 bg-crd-dark rounded'>
                      Dark background
                    </div>
                    <div className='p-4 bg-crd-darkGray rounded'>
                      Dark gray background
                    </div>
                    <div className='p-4 bg-crd-mediumGray rounded'>
                      Medium gray background
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Colors</CardTitle>
                    <CardDescription>Hover and active states</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='p-4 bg-crd-blue rounded hover:bg-crd-blue/80 transition-colors cursor-pointer'>
                      Primary hover
                    </div>
                    <div className='p-4 bg-crd-orange rounded hover:bg-crd-orange/80 transition-colors cursor-pointer'>
                      Accent hover
                    </div>
                    <div className='p-4 bg-crd-green rounded hover:bg-crd-green/80 transition-colors cursor-pointer'>
                      Success hover
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>

          {/* Spacing & Layout Tab */}
          <TabsContent value='spacing' className='space-y-8'>
            <section>
              <h2 className='text-2xl font-bold mb-4'>Spacing System</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Spacing Scale</CardTitle>
                    <CardDescription>Consistent spacing values</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center gap-4'>
                        <div className='w-4 h-4 bg-crd-blue rounded'></div>
                        <span className='text-sm'>4px (0.25rem)</span>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='w-8 h-8 bg-crd-blue rounded'></div>
                        <span className='text-sm'>8px (0.5rem)</span>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='w-16 h-16 bg-crd-blue rounded'></div>
                        <span className='text-sm'>16px (1rem)</span>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='w-24 h-24 bg-crd-blue rounded'></div>
                        <span className='text-sm'>24px (1.5rem)</span>
                      </div>
                      <div className='flex items-center gap-4'>
                        <div className='w-32 h-32 bg-crd-blue rounded'></div>
                        <span className='text-sm'>32px (2rem)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Layout Grid</CardTitle>
                    <CardDescription>Grid system examples</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-12 gap-4 mb-4'>
                      {Array.from({ length: 12 }, (_, i) => (
                        <div
                          key={i}
                          className='h-8 bg-crd-blue/20 rounded'
                        ></div>
                      ))}
                    </div>
                    <div className='grid grid-cols-6 gap-4 mb-4'>
                      {Array.from({ length: 6 }, (_, i) => (
                        <div
                          key={i}
                          className='h-8 bg-crd-orange/20 rounded'
                        ></div>
                      ))}
                    </div>
                    <div className='grid grid-cols-4 gap-4'>
                      {Array.from({ length: 4 }, (_, i) => (
                        <div
                          key={i}
                          className='h-8 bg-crd-green/20 rounded'
                        ></div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            <section>
              <h2 className='text-2xl font-bold mb-4'>Layout Components</h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Container Examples</CardTitle>
                    <CardDescription>
                      Different container layouts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='crd-container bg-crd-darkGray p-4 rounded'>
                      <p className='text-center'>CRD Container</p>
                    </div>
                    <div className='container mx-auto bg-crd-darkGray p-4 rounded'>
                      <p className='text-center'>Standard Container</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Flexbox Examples</CardTitle>
                    <CardDescription>Flex layout patterns</CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='flex justify-between items-center bg-crd-darkGray p-4 rounded'>
                      <span>Left</span>
                      <span>Center</span>
                      <span>Right</span>
                    </div>
                    <div className='flex flex-col space-y-2 bg-crd-darkGray p-4 rounded'>
                      <span>Top</span>
                      <span>Middle</span>
                      <span>Bottom</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
