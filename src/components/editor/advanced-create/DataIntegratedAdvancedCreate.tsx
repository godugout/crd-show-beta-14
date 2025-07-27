import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Textarea } from '@/components/ui/textarea';
import { useCardEditor } from '@/hooks/useCardEditor';
import {
  BarChart,
  Calendar,
  Database,
  FileJson,
  Globe,
  Link,
  RefreshCw,
  Settings,
  Upload,
  Zap,
} from 'lucide-react';
import Papa from 'papaparse';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface DataSource {
  id: string;
  name: string;
  type: 'api' | 'csv' | 'social' | 'weather';
  connected: boolean;
  lastSync?: string;
  config?: any;
}

interface BulkVariation {
  id: string;
  name: string;
  template: any;
  variations: Array<{
    name: string;
    data: Record<string, any>;
  }>;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'schedule' | 'performance' | 'event';
  action: 'create' | 'update' | 'price';
  config: any;
  enabled: boolean;
}

interface DataIntegratedAdvancedCreateProps {
  onComplete?: (cards: any[]) => void;
  onCancel?: () => void;
}

export const DataIntegratedAdvancedCreate: React.FC<
  DataIntegratedAdvancedCreateProps
> = ({ onComplete, onCancel }) => {
  const cardEditor = useCardEditor();
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: '1', name: 'ESPN API', type: 'api', connected: false },
    { id: '2', name: 'Team Roster CSV', type: 'csv', connected: false },
    { id: '3', name: 'Twitter Stats', type: 'social', connected: false },
    { id: '4', name: 'Game Weather', type: 'weather', connected: false },
  ]);

  const [bulkVariations, setBulkVariations] = useState<BulkVariation[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // CSV Upload handling
  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: results => {
        console.log('CSV Parsed:', results.data);

        // Create bulk variations from CSV data
        const variation: BulkVariation = {
          id: Date.now().toString(),
          name: file.name.replace('.csv', ''),
          template: cardEditor.cardData,
          variations: results.data.map((row: any) => ({
            name: row.player_name || row.name || 'Unknown',
            data: row,
          })),
        };

        setBulkVariations(prev => [...prev, variation]);
        toast.success(`Loaded ${results.data.length} rows from ${file.name}`);

        // Mark CSV data source as connected
        setDataSources(prev =>
          prev.map(ds =>
            ds.type === 'csv'
              ? { ...ds, connected: true, lastSync: new Date().toISOString() }
              : ds
          )
        );
      },
      error: error => {
        toast.error('Failed to parse CSV file');
        console.error('CSV Parse error:', error);
      },
    });
  };

  // Connect to external API
  const connectToAPI = async (source: DataSource) => {
    setIsProcessing(true);
    try {
      // Simulate API connection
      if (source.type === 'api') {
        // In production, this would make actual API calls
        const mockData = {
          players: [
            {
              name: 'LeBron James',
              team: 'Lakers',
              ppg: 25.4,
              apg: 7.8,
              rpg: 7.9,
            },
            {
              name: 'Stephen Curry',
              team: 'Warriors',
              ppg: 29.5,
              apg: 6.3,
              rpg: 5.2,
            },
            {
              name: 'Kevin Durant',
              team: 'Suns',
              ppg: 28.2,
              apg: 5.0,
              rpg: 6.7,
            },
          ],
        };

        // Create variations from API data
        const variation: BulkVariation = {
          id: Date.now().toString(),
          name: `${source.name} Import`,
          template: cardEditor.cardData,
          variations: mockData.players.map(player => ({
            name: player.name,
            data: player,
          })),
        };

        setBulkVariations(prev => [...prev, variation]);

        setDataSources(prev =>
          prev.map(ds =>
            ds.id === source.id
              ? { ...ds, connected: true, lastSync: new Date().toISOString() }
              : ds
          )
        );

        toast.success(`Connected to ${source.name}`);
      }
    } catch (error) {
      toast.error(`Failed to connect to ${source.name}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Create automation rule
  const createAutomationRule = () => {
    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: 'Post-Game Update',
      trigger: 'event',
      action: 'update',
      config: {
        event: 'game_end',
        updateFields: ['stats', 'lastGame'],
      },
      enabled: true,
    };

    setAutomationRules(prev => [...prev, newRule]);
    toast.success('Automation rule created');
  };

  // Generate bulk cards
  const generateBulkCards = async (variation: BulkVariation) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      const cards = [];

      for (let i = 0; i < variation.variations.length; i++) {
        const varData = variation.variations[i];

        // Create card with variation data
        const card = {
          ...variation.template,
          id: `${variation.id}-${i}`,
          title: varData.name,
          description: `Auto-generated from ${variation.name}`,
          metadata: {
            ...variation.template.metadata,
            imported_data: varData.data,
            source: variation.name,
            created_at: new Date().toISOString(),
          },
        };

        cards.push(card);
        setProgress(((i + 1) / variation.variations.length) * 100);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      toast.success(`Generated ${cards.length} cards from ${variation.name}`);

      if (onComplete) {
        onComplete(cards);
      }
    } catch (error) {
      toast.error('Failed to generate cards');
      console.error('Bulk generation error:', error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      <div className='container max-w-7xl mx-auto p-6 space-y-8'>
        {/* Header */}
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold'>Advanced Data-Driven Creation</h1>
          <p className='text-xl text-muted-foreground'>
            Connect external data sources and automate card creation at scale
          </p>
        </div>

        <Tabs defaultValue='sources' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='sources'>
              <Database className='w-4 h-4 mr-2' />
              Data Sources
            </TabsTrigger>
            <TabsTrigger value='variations'>
              <RefreshCw className='w-4 h-4 mr-2' />
              Bulk Variations
            </TabsTrigger>
            <TabsTrigger value='automation'>
              <Zap className='w-4 h-4 mr-2' />
              Automation
            </TabsTrigger>
            <TabsTrigger value='analytics'>
              <BarChart className='w-4 h-4 mr-2' />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Data Sources */}
          <TabsContent value='sources' className='mt-6 space-y-4'>
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Connect Data Sources
              </h3>

              <div className='grid gap-4'>
                {dataSources.map(source => (
                  <Card key={source.id} className='p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        {source.type === 'api' && (
                          <Globe className='w-5 h-5 text-blue-500' />
                        )}
                        {source.type === 'csv' && (
                          <FileJson className='w-5 h-5 text-green-500' />
                        )}
                        {source.type === 'social' && (
                          <Link className='w-5 h-5 text-purple-500' />
                        )}
                        {source.type === 'weather' && (
                          <Calendar className='w-5 h-5 text-orange-500' />
                        )}

                        <div>
                          <h4 className='font-medium'>{source.name}</h4>
                          <p className='text-sm text-muted-foreground'>
                            {source.connected
                              ? `Last sync: ${new Date(source.lastSync!).toLocaleString()}`
                              : 'Not connected'}
                          </p>
                        </div>
                      </div>

                      {source.type === 'csv' && !source.connected && (
                        <div>
                          <Input
                            type='file'
                            accept='.csv'
                            onChange={handleCSVUpload}
                            className='hidden'
                            id={`csv-upload-${source.id}`}
                          />
                          <Label htmlFor={`csv-upload-${source.id}`}>
                            <Button variant='outline' asChild>
                              <span>
                                <Upload className='w-4 h-4 mr-2' />
                                Upload CSV
                              </span>
                            </Button>
                          </Label>
                        </div>
                      )}

                      {source.type === 'api' && (
                        <Button
                          variant={source.connected ? 'secondary' : 'default'}
                          onClick={() => connectToAPI(source)}
                          disabled={isProcessing}
                        >
                          {source.connected ? 'Sync Now' : 'Connect'}
                        </Button>
                      )}

                      {(source.type === 'social' ||
                        source.type === 'weather') && (
                        <Button variant='outline' disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Custom API Configuration */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Custom API Configuration
              </h3>
              <div className='space-y-4'>
                <div>
                  <Label>API Endpoint</Label>
                  <Input placeholder='https://api.example.com/stats' />
                </div>
                <div>
                  <Label>API Key</Label>
                  <Input type='password' placeholder='Your API key' />
                </div>
                <div>
                  <Label>Data Mapping</Label>
                  <Textarea
                    placeholder='Map API fields to card properties (JSON format)'
                    className='font-mono text-sm'
                  />
                </div>
                <Button>
                  <Link className='w-4 h-4 mr-2' />
                  Add Custom API
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Bulk Variations */}
          <TabsContent value='variations' className='mt-6 space-y-4'>
            {bulkVariations.length === 0 ? (
              <Card className='p-12 text-center'>
                <Database className='w-12 h-12 mx-auto mb-4 text-muted-foreground' />
                <h3 className='text-lg font-semibold mb-2'>No Data Loaded</h3>
                <p className='text-muted-foreground mb-4'>
                  Connect a data source to create bulk variations
                </p>
                <Button
                  variant='outline'
                  onClick={() =>
                    document.getElementById('csv-upload-2')?.click()
                  }
                >
                  <Upload className='w-4 h-4 mr-2' />
                  Upload CSV
                </Button>
              </Card>
            ) : (
              bulkVariations.map(variation => (
                <Card key={variation.id} className='p-6'>
                  <div className='flex items-start justify-between mb-4'>
                    <div>
                      <h3 className='text-lg font-semibold'>
                        {variation.name}
                      </h3>
                      <p className='text-sm text-muted-foreground'>
                        {variation.variations.length} variations ready
                      </p>
                    </div>
                    <Button
                      onClick={() => generateBulkCards(variation)}
                      disabled={isProcessing}
                    >
                      Generate All Cards
                    </Button>
                  </div>

                  {isProcessing && (
                    <div className='space-y-2'>
                      <Progress value={progress} />
                      <p className='text-sm text-muted-foreground text-center'>
                        Generating cards... {Math.round(progress)}%
                      </p>
                    </div>
                  )}

                  {/* Preview variations */}
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-2 mt-4'>
                    {variation.variations.slice(0, 4).map((v, idx) => (
                      <Card key={idx} className='p-3 text-center'>
                        <p className='text-sm font-medium truncate'>{v.name}</p>
                        <p className='text-xs text-muted-foreground'>
                          {Object.keys(v.data).length} fields
                        </p>
                      </Card>
                    ))}
                    {variation.variations.length > 4 && (
                      <Card className='p-3 flex items-center justify-center'>
                        <p className='text-sm text-muted-foreground'>
                          +{variation.variations.length - 4} more
                        </p>
                      </Card>
                    )}
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Automation */}
          <TabsContent value='automation' className='mt-6 space-y-4'>
            <Card className='p-6'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-semibold'>Automation Rules</h3>
                <Button onClick={createAutomationRule}>
                  <Zap className='w-4 h-4 mr-2' />
                  Create Rule
                </Button>
              </div>

              {automationRules.length === 0 ? (
                <p className='text-muted-foreground text-center py-8'>
                  No automation rules configured
                </p>
              ) : (
                <div className='space-y-3'>
                  {automationRules.map(rule => (
                    <Card key={rule.id} className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={checked => {
                              setAutomationRules(prev =>
                                prev.map(r =>
                                  r.id === rule.id
                                    ? { ...r, enabled: checked }
                                    : r
                                )
                              );
                            }}
                          />
                          <div>
                            <h4 className='font-medium'>{rule.name}</h4>
                            <p className='text-sm text-muted-foreground'>
                              {rule.trigger} → {rule.action}
                            </p>
                          </div>
                        </div>
                        <Button variant='ghost' size='sm'>
                          <Settings className='w-4 h-4' />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>

            {/* Scheduled Releases */}
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>Scheduled Releases</h3>
              <div className='space-y-4'>
                <div>
                  <Label>Release Date & Time</Label>
                  <Input type='datetime-local' />
                </div>
                <div>
                  <Label>Release Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder='Select release type' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='single'>Single Card</SelectItem>
                      <SelectItem value='batch'>Batch Release</SelectItem>
                      <SelectItem value='series'>Series Drop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  <Calendar className='w-4 h-4 mr-2' />
                  Schedule Release
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value='analytics' className='mt-6'>
            <Card className='p-6'>
              <h3 className='text-lg font-semibold mb-4'>
                Performance Analytics
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <Card className='p-4 text-center'>
                  <BarChart className='w-8 h-8 mx-auto mb-2 text-blue-500' />
                  <p className='text-2xl font-bold'>0</p>
                  <p className='text-sm text-muted-foreground'>Cards Created</p>
                </Card>
                <Card className='p-4 text-center'>
                  <TrendingUp className='w-8 h-8 mx-auto mb-2 text-green-500' />
                  <p className='text-2xl font-bold'>0%</p>
                  <p className='text-sm text-muted-foreground'>
                    Avg. Performance
                  </p>
                </Card>
                <Card className='p-4 text-center'>
                  <Zap className='w-8 h-8 mx-auto mb-2 text-purple-500' />
                  <p className='text-2xl font-bold'>0</p>
                  <p className='text-sm text-muted-foreground'>Active Rules</p>
                </Card>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
