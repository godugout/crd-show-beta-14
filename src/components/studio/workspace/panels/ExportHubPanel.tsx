import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Share,
  Download,
  Image,
  Video,
  FileText,
  Instagram,
  Twitter,
  Facebook,
  Printer,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface ExportHubPanelProps {
  card: any;
  onShare: (card: any) => void;
  onDownload: (card: any) => void;
  workspaceMode: string;
  deviceType: string;
}

const EXPORT_FORMATS = [
  { id: 'png', name: 'PNG', description: 'High quality image', icon: Image, sizes: ['1080x1080', '1920x1080', '4K'] },
  { id: 'jpg', name: 'JPG', description: 'Compressed image', icon: Image, sizes: ['1080x1080', '1920x1080', '4K'] },
  { id: 'mp4', name: 'MP4', description: 'Video animation', icon: Video, sizes: ['1080p', '4K', '8K'] },
  { id: 'gif', name: 'GIF', description: 'Animated image', icon: Video, sizes: ['512x512', '1024x1024'] },
  { id: 'pdf', name: 'PDF', description: 'Print ready', icon: FileText, sizes: ['Letter', 'A4', 'Custom'] },
];

const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: Instagram, formats: ['1080x1080', '1080x1350', 'Story'], color: 'bg-pink-500' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, formats: ['1200x675', '1080x1080'], color: 'bg-blue-500' },
  { id: 'facebook', name: 'Facebook', icon: Facebook, formats: ['1200x630', '1080x1080'], color: 'bg-blue-600' },
];

const PRINT_SPECS = [
  { id: 'trading-card', name: 'Trading Card', size: '2.5" x 3.5"', dpi: 300 },
  { id: 'poster', name: 'Poster', size: '18" x 24"', dpi: 300 },
  { id: 'business-card', name: 'Business Card', size: '3.5" x 2"', dpi: 300 },
];

export const ExportHubPanel: React.FC<ExportHubPanelProps> = ({
  card,
  onShare,
  onDownload,
  workspaceMode,
  deviceType
}) => {
  const [activeTab, setActiveTab] = useState('formats');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportHistory, setExportHistory] = useState([
    { id: 1, name: 'card-hero-4k.png', time: '2 min ago', status: 'completed' },
    { id: 2, name: 'card-animation.mp4', time: '5 min ago', status: 'completed' },
    { id: 3, name: 'card-instagram.jpg', time: '1 hour ago', status: 'failed' },
  ]);

  const isCompact = deviceType === 'mobile' || workspaceMode === 'beginner';
  const showAdvanced = workspaceMode === 'director';

  const handleExport = async (format: string, size?: string) => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Trigger download after completion
    setTimeout(() => {
      onDownload(card);
    }, 2000);
  };

  const QuickExportButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    variant = "outline" 
  }: {
    icon: any;
    label: string;
    onClick: () => void;
    variant?: "outline" | "default";
  }) => (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={onClick}
      className={cn("flex-1 gap-2", isCompact && "flex-col h-auto py-2")}
      disabled={isExporting}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </Button>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Share className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">Export & Share</span>
        </div>

        {/* Quick Export */}
        <div className={cn("grid gap-2", isCompact ? "grid-cols-2" : "grid-cols-1")}>
          <QuickExportButton
            icon={Download}
            label="Download"
            onClick={() => handleExport('png', '4K')}
            variant="default"
          />
          <QuickExportButton
            icon={Share}
            label="Share"
            onClick={() => onShare(card)}
          />
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="p-3 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs font-medium">Exporting...</span>
            <span className="text-xs text-muted-foreground ml-auto">{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="h-1" />
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className={cn(
          "grid m-3 mb-0",
          isCompact ? "grid-cols-2" : showAdvanced ? "grid-cols-4" : "grid-cols-3"
        )}>
          <TabsTrigger value="formats" className="text-xs">
            <Image className="w-3 h-3 mr-1" />
            {!isCompact && 'Formats'}
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            {!isCompact && 'Social'}
          </TabsTrigger>
          {!isCompact && (
            <TabsTrigger value="print" className="text-xs">
              <Printer className="w-3 h-3 mr-1" />
              Print
            </TabsTrigger>
          )}
          {showAdvanced && (
            <TabsTrigger value="history" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              History
            </TabsTrigger>
          )}
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="formats" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3">
                {EXPORT_FORMATS.map(format => {
                  const Icon = format.icon;
                  return (
                    <div key={format.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{format.name}</span>
                        <span className="text-xs text-muted-foreground">{format.description}</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-1">
                        {format.sizes.map(size => (
                          <Button
                            key={size}
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(format.id, size)}
                            className="text-xs h-7"
                            disabled={isExporting}
                          >
                            {size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="social" className="h-full m-0">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-3">
                {SOCIAL_PLATFORMS.map(platform => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.id} className="border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("w-6 h-6 rounded flex items-center justify-center", platform.color)}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{platform.name}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-1">
                        {platform.formats.map(format => (
                          <Button
                            key={format}
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport('jpg', format)}
                            className="text-xs h-7"
                            disabled={isExporting}
                          >
                            {format}
                          </Button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {!isCompact && (
            <TabsContent value="print" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-3">
                  {PRINT_SPECS.map(spec => (
                    <div key={spec.id} className="border border-border rounded-lg p-3">
                      <div className="mb-2">
                        <span className="text-sm font-medium">{spec.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{spec.size}</Badge>
                          <Badge variant="outline" className="text-xs">{spec.dpi} DPI</Badge>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport('pdf', spec.id)}
                        className="w-full text-xs"
                        disabled={isExporting}
                      >
                        <Printer className="w-3 h-3 mr-1" />
                        Export for Print
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}

          {showAdvanced && (
            <TabsContent value="history" className="h-full m-0">
              <ScrollArea className="h-full">
                <div className="p-3 space-y-2">
                  {exportHistory.map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 border border-border rounded">
                      {item.status === 'completed' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      {item.status === 'completed' && (
                        <Button variant="outline" size="sm" className="text-xs h-6 px-2">
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};