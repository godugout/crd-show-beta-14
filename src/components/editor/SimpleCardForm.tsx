
import React, { useState } from 'react';
import { CRDCard } from '@/components/ui/design-system/Card';
import { CRDInput } from '@/components/ui/design-system/Input';
import { Textarea } from '@/components/ui/textarea';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSimpleCardEditor } from '@/hooks/useSimpleCardEditor';
import { useDropzone } from 'react-dropzone';
import { uploadCardImage } from '@/lib/cardImageUploader';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { CardRarity } from '@/types/card';

export const SimpleCardForm = () => {
  const { user } = useAuth();
  const { cardData, updateField, saveCard, publishCard, isSaving } = useSimpleCardEditor();
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles.length || !user) return;

    const file = acceptedFiles[0];
    setIsUploading(true);

    try {
      const result = await uploadCardImage({
        file,
        cardId: cardData.id || 'temp',
        userId: user.id
      });

      if (result) {
        updateField('image_url', result.url);
        if (result.thumbnailUrl) {
          updateField('thumbnail_url', result.thumbnailUrl);
        }
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1
  });

  const addTag = () => {
    if (tagInput.trim() && !cardData.tags.includes(tagInput.trim()) && cardData.tags.length < 10) {
      updateField('tags', [...cardData.tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField('tags', cardData.tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!user) {
    return (
      <CRDCard className="max-w-2xl mx-auto mt-8 bg-crd-darkGray border-crd-mediumGray">
        <div className="pt-6 p-6">
          <p className="text-center text-crd-lightGray">
            Please sign in to create cards
          </p>
        </div>
      </CRDCard>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6 bg-crd-darkest min-h-screen">
      <CRDCard className="bg-crd-darkGray border-crd-mediumGray">
        <div className="p-6 border-b border-crd-mediumGray">
          <h2 className="text-2xl font-bold text-crd-white">Create New Card</h2>
        </div>
        <div className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <Label className="text-crd-white font-medium">Card Image</Label>
            <div
              {...getRootProps()}
              className={`mt-2 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-crd-mediumGray hover:border-crd-green/50 bg-crd-darker'
              }`}
            >
              <input {...getInputProps()} />
              {cardData.image_url ? (
                <div className="space-y-2">
                  <img 
                    src={cardData.image_url} 
                    alt="Card preview" 
                    className="max-h-40 mx-auto rounded"
                  />
                  <p className="text-sm text-crd-lightGray">Click or drag to replace image</p>
                </div>
              ) : (
                <div>
                  {isUploading ? (
                    <p className="text-crd-white">Uploading...</p>
                  ) : (
                    <p className="text-crd-lightGray">Drag and drop an image here, or click to select</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-crd-white font-medium">Title *</Label>
            <CRDInput
              id="title"
              variant="crd"
              value={cardData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter card title"
              className="mt-1"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-crd-white font-medium">Description</Label>
            <Textarea
              id="description"
              value={cardData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Enter card description"
              className="mt-1 bg-crd-dark border-crd-mediumGray text-crd-white placeholder:text-crd-lightGray focus-visible:ring-crd-blue focus-visible:border-crd-blue"
              rows={3}
            />
          </div>

          {/* Rarity */}
          <div>
            <Label className="text-crd-white font-medium">Rarity</Label>
            <Select 
              value={cardData.rarity} 
              onValueChange={(value) => updateField('rarity', value as CardRarity)}
            >
              <SelectTrigger className="mt-1 bg-crd-dark border-crd-mediumGray text-crd-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-crd-dark border-crd-mediumGray">
                <SelectItem value="common" className="text-crd-white hover:bg-crd-mediumGray">Common</SelectItem>
                <SelectItem value="uncommon" className="text-crd-white hover:bg-crd-mediumGray">Uncommon</SelectItem>
                <SelectItem value="rare" className="text-crd-white hover:bg-crd-mediumGray">Rare</SelectItem>
                <SelectItem value="epic" className="text-crd-white hover:bg-crd-mediumGray">Epic</SelectItem>
                <SelectItem value="legendary" className="text-crd-white hover:bg-crd-mediumGray">Legendary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-crd-white font-medium">Tags</Label>
            <div className="mt-1 space-y-2">
              <div className="flex gap-2">
                <CRDInput
                  variant="crd"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a tag and press Enter"
                  className="flex-1"
                />
                <CRDButton 
                  type="button" 
                  onClick={addTag} 
                  variant="outline"
                  className="bg-transparent border-crd-mediumGray text-crd-lightGray hover:bg-crd-mediumGray hover:text-crd-white"
                >
                  Add
                </CRDButton>
              </div>
              {cardData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cardData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-crd-blue/20 text-crd-blue rounded-md text-sm border border-crd-blue/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-crd-blue hover:text-crd-white transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <CRDButton 
              onClick={saveCard} 
              disabled={isSaving || !cardData.title.trim()}
              variant="primary"
              className="flex-1"
            >
              {isSaving ? 'Saving...' : 'Save Card'}
            </CRDButton>
            <CRDButton 
              onClick={publishCard} 
              disabled={isSaving || !cardData.title.trim()}
              variant="secondary"
              className="flex-1"
            >
              Save & Publish
            </CRDButton>
          </div>
        </div>
      </CRDCard>
    </div>
  );
};
