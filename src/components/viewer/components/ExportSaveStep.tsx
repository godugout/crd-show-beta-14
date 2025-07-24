import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Save, Share2, FileImage, FileText } from 'lucide-react';
import type { CardData } from '@/hooks/useCardEditor';

interface ExportSaveStepProps {
  card: CardData;
  onExport: (format: 'png' | 'pdf' | 'json') => void;
  onSave: () => void;
  onShare: () => void;
}

export const ExportSaveStep = ({ card, onExport, onSave, onShare }: ExportSaveStepProps) => {
  const [filename, setFilename] = useState(card.title.replace(/\s+/g, '_').toLowerCase());
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'pdf' | 'json'>('png');

  const formats = [
    { value: 'png', label: 'PNG Image', icon: FileImage, description: 'High-quality image format' },
    { value: 'pdf', label: 'PDF Document', icon: FileText, description: 'Print-ready format' },
    { value: 'json', label: 'JSON Data', icon: FileText, description: 'Card data export' }
  ] as const;

  const handleExport = () => {
    onExport(selectedFormat);
  };

  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500';
      case 'uncommon':
        return 'bg-green-500';
      case 'rare':
        return 'bg-blue-500';
      case 'ultra-rare':
        return 'bg-purple-500';
      case 'legendary':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-white font-semibold">Export & Save</h2>
        <p className="text-gray-400">Choose your preferred format and save options.</p>
      </div>
      
      <div className="bg-editor-darker rounded-lg p-4">
        <h3 className="text-white font-medium mb-3">Card Preview</h3>
        <div className="flex items-center space-x-3">
          <div className="w-16 h-20 bg-editor-tool rounded border overflow-hidden">
            {card.image_url && (
              <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">{card.title}</h4>
            <p className="text-gray-400 text-sm">{card.description || 'No description'}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getRarityBadgeColor(card.rarity)}`}>
                {card.rarity}
              </span>
              <span className="text-gray-400 text-xs">
                {card.tags.length} tags
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-white font-medium">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formats.map((format) => (
            <Button
              key={format.value}
              variant={selectedFormat === format.value ? 'default' : 'outline'}
              className="justify-start space-x-2"
              onClick={() => setSelectedFormat(format.value)}
            >
              <format.icon className="w-4 h-4" />
              <span>{format.label}</span>
            </Button>
          ))}
        </div>
        <div>
          <Label htmlFor="filename" className="text-white">Filename</Label>
          <Input
            id="filename"
            className="bg-editor-darker border-editor-border text-white mt-1"
            value={filename}
            onChange={(e) => setFilename(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="secondary" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button variant="secondary" onClick={onSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
