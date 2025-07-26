import React, { useState } from 'react';
import { 
  Settings, 
  X, 
  Monitor, 
  Flag, 
  TestTube, 
  Zap, 
  Users, 
  ChevronDown,
  ChevronRight,
  Play,
  Bug,
  Palette,
  Sparkles,
  Brain,
  Gauge,
  Eye,
  AlertTriangle,
  CheckCircle,
  HardDrive,
  Clock,
  Triangle,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { cn } from '@/lib/utils';

interface AdminTestingPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FeatureTestConfig {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'ui' | 'ai' | 'effects';
  enabled: boolean;
  rolloutPercentage: number;
  testPath?: string;
  icon: React.ComponentType<any>;
}

const betaFeatures: FeatureTestConfig[] = [
  {
    id: 'revolutionary-quick-create',
    name: 'Revolutionary Quick Create',
    description: 'AI-powered instant card creation with style variations',
    category: 'ai',
    enabled: true,
    rolloutPercentage: 100,
    testPath: '/create?mode=quick',
    icon: Sparkles
  },
  {
    id: 'style-variations',
    name: 'Style Variations',
    description: 'Epic, Classic, Futuristic style presets with real-time preview',
    category: 'effects',
    enabled: true,
    rolloutPercentage: 100,
    testPath: '/create?test=styles',
    icon: Palette
  },
  {
    id: 'adaptive-performance',
    name: 'Adaptive Performance',
    description: 'Dynamic quality adjustment based on device capabilities',
    category: 'performance',
    enabled: true,
    rolloutPercentage: 80,
    icon: Gauge
  },
  {
    id: 'style-learning',
    name: 'Style Learning AI',
    description: 'Machine learning for user preference prediction',
    category: 'ai',
    enabled: true,
    rolloutPercentage: 50,
    icon: Brain
  },
  {
    id: 'immersive-viewer',
    name: 'Immersive Viewer',
    description: 'Full-screen 3D card viewer with environment controls',
    category: 'ui',
    enabled: true,
    rolloutPercentage: 100,
    testPath: '/showcase',
    icon: Eye
  }
];

const testScenarios = [
  {
    id: 'performance-stress',
    name: 'Performance Stress Test',
    description: 'Test multiple effects simultaneously',
    action: () => console.log('Running performance stress test...')
  },
  {
    id: 'mobile-responsive',
    name: 'Mobile Responsiveness',
    description: 'Test on mobile viewport sizes',
    action: () => console.log('Testing mobile responsiveness...')
  },
  {
    id: 'style-transitions',
    name: 'Style Transitions',
    description: 'Test smooth transitions between styles',
    action: () => console.log('Testing style transitions...')
  },
  {
    id: 'error-recovery',
    name: 'Error Recovery',
    description: 'Test graceful degradation scenarios',
    action: () => console.log('Testing error recovery...')
  }
];

export const AdminTestingPanel: React.FC<AdminTestingPanelProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedTab, setSelectedTab] = useState('performance');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['performance']));
  const [featureFlags, setFeatureFlags] = useState<Record<string, FeatureTestConfig>>(
    betaFeatures.reduce((acc, feature) => {
      acc[feature.id] = feature;
      return acc;
    }, {} as Record<string, FeatureTestConfig>)
  );

  const { metrics } = usePerformanceMonitor();

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const updateFeatureFlag = (featureId: string, updates: Partial<FeatureTestConfig>) => {
    setFeatureFlags(prev => ({
      ...prev,
      [featureId]: { ...prev[featureId], ...updates }
    }));
  };

  const getPerformanceColor = (fps: number) => {
    if (fps >= 55) return 'text-emerald-500';
    if (fps >= 30) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMemoryColor = (usage: number) => {
    if (usage < 200) return 'text-emerald-500';
    if (usage < 400) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'performance': return Gauge;
      case 'ui': return Eye;
      case 'ai': return Brain;
      case 'effects': return Sparkles;
      default: return TestTube;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-screen w-96 bg-background border-l border-border z-50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Admin Testing Panel</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-73px)]">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance" className="text-xs">
              <Monitor className="w-3 h-3 mr-1" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="features" className="text-xs">
              <Flag className="w-3 h-3 mr-1" />
              Features
            </TabsTrigger>
            <TabsTrigger value="testing" className="text-xs">
              <TestTube className="w-3 h-3 mr-1" />
              Testing
            </TabsTrigger>
          </TabsList>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 mt-4">
            {/* Real-time Performance Metrics */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Real-time Metrics
                  {metrics.fps >= 30 ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* FPS */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Frame Rate</span>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", getPerformanceColor(metrics.fps))}>
                      {metrics.fps} FPS
                    </Badge>
                  </div>
                  <Progress value={Math.min((metrics.fps / 60) * 100, 100)} className="h-1" />
                </div>

                {/* Frame Time */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Frame Time</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{metrics.frameTime}ms</span>
                  </div>
                  <Progress value={Math.max(0, 100 - (metrics.frameTime / 33.3) * 100)} className="h-1" />
                </div>

                {/* Memory */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Memory</span>
                    </div>
                    <Badge variant="outline" className={cn("text-xs", getMemoryColor(metrics.memoryUsage))}>
                      {metrics.memoryUsage}MB
                    </Badge>
                  </div>
                  <Progress value={Math.min((metrics.memoryUsage / 500) * 100, 100)} className="h-1" />
                </div>

                {/* Quality Level */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">Quality Level</span>
                  <Badge variant="secondary" className="text-xs">
                    {metrics.quality?.toUpperCase() || 'AUTO'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Performance Insights */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Performance Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {metrics.isThrottling && (
                  <div className="flex items-center gap-2 text-yellow-600 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    Performance throttling detected
                  </div>
                )}
                {metrics.fps < 30 && (
                  <div className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    Low FPS detected - consider reducing quality
                  </div>
                )}
                {metrics.memoryUsage > 400 && (
                  <div className="flex items-center gap-2 text-yellow-600 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    High memory usage detected
                  </div>
                )}
                {metrics.fps >= 55 && metrics.memoryUsage < 200 && (
                  <div className="flex items-center gap-2 text-emerald-600 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    Optimal performance
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-4 mt-4">
            {['performance', 'ui', 'ai', 'effects'].map(category => {
              const categoryFeatures = Object.values(featureFlags).filter(f => f.category === category);
              const CategoryIcon = getCategoryIcon(category);

              return (
                <Card key={category}>
                  <CardHeader 
                    className="pb-3 cursor-pointer"
                    onClick={() => toggleSection(category)}
                  >
                    <CardTitle className="text-sm flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="w-4 h-4" />
                        {category.charAt(0).toUpperCase() + category.slice(1)} Features
                      </div>
                      {expandedSections.has(category) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </CardTitle>
                  </CardHeader>
                  
                  {expandedSections.has(category) && (
                    <CardContent className="space-y-4">
                      {categoryFeatures.map(feature => (
                        <div key={feature.id} className="space-y-3 p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <feature.icon className="w-4 h-4 text-primary" />
                                <span className="font-medium text-sm">{feature.name}</span>
                                <Badge variant={feature.enabled ? 'default' : 'secondary'} className="text-xs">
                                  {feature.enabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{feature.description}</p>
                            </div>
                            <Switch
                              checked={feature.enabled}
                              onCheckedChange={(enabled) => updateFeatureFlag(feature.id, { enabled })}
                            />
                          </div>
                          
                          {feature.enabled && (
                            <>
                              <Separator />
                              <div className="space-y-3">
                                <div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-muted-foreground">Rollout Percentage</span>
                                    <span className="text-xs font-mono">{feature.rolloutPercentage}%</span>
                                  </div>
                                  <Slider
                                    value={[feature.rolloutPercentage]}
                                    onValueChange={([value]) => updateFeatureFlag(feature.id, { rolloutPercentage: value })}
                                    max={100}
                                    step={5}
                                    className="w-full"
                                  />
                                </div>
                                
                                {feature.testPath && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs"
                                    onClick={() => window.open(feature.testPath, '_blank')}
                                  >
                                    <Play className="w-3 h-3 mr-1" />
                                    Test Feature
                                  </Button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </TabsContent>

          {/* Testing Tab */}
          <TabsContent value="testing" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TestTube className="w-4 h-4" />
                  Automated Test Scenarios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {testScenarios.map(scenario => (
                  <div key={scenario.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{scenario.name}</div>
                      <div className="text-xs text-muted-foreground">{scenario.description}</div>
                    </div>
                    <Button size="sm" variant="outline" onClick={scenario.action}>
                      <Play className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Quick Feature Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                  <Sparkles className="w-3 h-3 mr-2" />
                  Revolutionary Quick Create
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                  <Palette className="w-3 h-3 mr-2" />
                  Style Variations Testing
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                  <Eye className="w-3 h-3 mr-2" />
                  Immersive Viewer Demo
                </Button>
                <Button size="sm" variant="outline" className="w-full justify-start text-xs">
                  <Brain className="w-3 h-3 mr-2" />
                  AI Learning Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Debug Tools */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bug className="w-4 h-4" />
                  Debug Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Clear Performance Cache
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Reset User Preferences
                </Button>
                <Button size="sm" variant="outline" className="w-full text-xs">
                  Export Debug Report
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
};