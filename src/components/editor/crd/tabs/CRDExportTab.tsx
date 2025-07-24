import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileImage, Printer, Share2 } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';

interface CRDExportTabProps {
  onExport: (format: string, options: any) => void;
}

const EXPORT_FORMATS = [
  {
    id: 'pdf-print',
    name: 'PDF (Print Ready)',
    description: 'High-resolution PDF with bleed and trim marks',
    icon: Printer,
    recommended: true
  },
  {
    id: 'png-high',
    name: 'PNG (High Quality)',
    description: '300 DPI PNG for professional printing',
    icon: FileImage,
    recommended: false
  },
  {
    id: 'png-web',
    name: 'PNG (Web)',
    description: '72 DPI PNG optimized for digital sharing',
    icon: Share2,
    recommended: false
  },
  {
    id: 'svg-vector',
    name: 'SVG (Vector)',
    description: 'Scalable vector format for infinite quality',
    icon: FileImage,
    recommended: false
  }
];

const PRINT_OPTIONS = [
  {
    id: 'bleed',
    name: 'Include Bleed',
    description: 'Add 0.125" bleed area for professional printing',
    default: true
  },
  {
    id: 'crop-marks',
    name: 'Crop Marks',
    description: 'Add crop marks for precise cutting',
    default: true
  },
  {
    id: 'color-bars',
    name: 'Color Bars',
    description: 'Include color registration bars',
    default: false
  },
  {
    id: 'safe-area',
    name: 'Safe Area Guide',
    description: 'Show safe area guidelines',
    default: false
  }
];

export const CRDExportTab: React.FC<CRDExportTabProps> = ({ onExport }) => {
  const [selectedFormat, setSelectedFormat] = React.useState('pdf-print');
  const [printOptions, setPrintOptions] = React.useState<Record<string, boolean>>({
    bleed: true,
    'crop-marks': true,
    'color-bars': false,
    'safe-area': false
  });

  const togglePrintOption = (optionId: string) => {
    setPrintOptions(prev => ({
      ...prev,
      [optionId]: !prev[optionId]
    }));
  };

  const handleExport = () => {
    onExport(selectedFormat, {
      printOptions,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      {/* Export Formats */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Format
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {EXPORT_FORMATS.map(format => {
            const IconComponent = format.icon;
            return (
              <div
                key={format.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all relative ${
                  selectedFormat === format.id
                    ? 'border-crd-blue bg-crd-blue/10'
                    : 'border-crd-mediumGray/20 hover:border-crd-blue/50'
                }`}
                onClick={() => setSelectedFormat(format.id)}
              >
                {format.recommended && (
                  <div className="absolute -top-1 -right-1 bg-crd-blue text-white text-xs px-2 py-0.5 rounded-full">
                    Recommended
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <IconComponent className="w-5 h-5 text-crd-blue flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-crd-white text-sm font-medium">{format.name}</div>
                    <div className="text-crd-lightGray text-xs mt-1">{format.description}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Print Options */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {PRINT_OPTIONS.map(option => (
            <div
              key={option.id}
              className="flex items-start gap-3 p-2 rounded hover:bg-crd-mediumGray/10 cursor-pointer"
              onClick={() => togglePrintOption(option.id)}
            >
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 ${
                printOptions[option.id]
                  ? 'border-crd-blue bg-crd-blue'
                  : 'border-crd-mediumGray/40'
              }`}>
                {printOptions[option.id] && (
                  <div className="w-2 h-2 bg-white rounded-sm" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-crd-white text-sm font-medium">{option.name}</div>
                <div className="text-crd-lightGray text-xs mt-1">{option.description}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Resolution & Quality */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-crd-white text-sm">Quality Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-crd-lightGray block mb-1">Resolution</label>
              <select className="w-full bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1 text-sm text-crd-white">
                <option value="300">300 DPI (Print)</option>
                <option value="150">150 DPI (Draft)</option>
                <option value="72">72 DPI (Web)</option>
              </select>
            </div>
            <div>
              <label className="text-crd-lightGray block mb-1">Color Profile</label>
              <select className="w-full bg-crd-darkest border border-crd-mediumGray/20 rounded px-2 py-1 text-sm text-crd-white">
                <option value="cmyk">CMYK (Print)</option>
                <option value="rgb">RGB (Digital)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Actions */}
      <Card className="bg-crd-darker border-crd-mediumGray/20">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <CRDButton 
              variant="primary" 
              className="w-full"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Card
            </CRDButton>
            <div className="grid grid-cols-2 gap-2">
              <CRDButton variant="outline" size="sm" className="text-xs">
                Save Draft
              </CRDButton>
              <CRDButton variant="outline" size="sm" className="text-xs">
                Share Preview
              </CRDButton>
            </div>
          </div>
          <p className="text-xs text-crd-lightGray/70 mt-3 text-center">
            Export will generate your professional-quality CRD Collectible ready for printing or sharing.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};