import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, Save } from 'lucide-react';
import { crdDataService } from '@/services/crdDataService';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { toast } from 'sonner';
import type { CardData } from '@/types/card';

interface CardCreationInterfaceProps {
  onComplete?: (cardData: CardData) => void;
  onCancel?: () => void;
}

export const CardCreationInterface: React.FC<CardCreationInterfaceProps> = ({
  onComplete,
  onCancel
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be smaller than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCard = async () => {
    if (!user) {
      toast.error('Please sign in to create cards');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a card title');
      return;
    }

    if (!imageFile && !imagePreview) {
      toast.error('Please select an image for your card');
      return;
    }

    setIsCreating(true);

    try {
      // Convert image to base64 for storage
      let imageUrl = imagePreview;
      if (imageFile) {
        const reader = new FileReader();
        imageUrl = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      // Create card data
      const cardData: CardData = {
        id: `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: title.trim(),
        description: description.trim(),
        image_url: imageUrl,
        thumbnail_url: imageUrl, // Using same image for thumbnail
        creator_id: user.id,
        created_at: new Date().toISOString(),
        is_public: false,
        visibility: 'private' as const,
        rarity: 'common' as const,
        tags: [],
        design_metadata: {},
        creator_attribution: {
          creator_id: user.id,
          collaboration_type: 'solo'
        },
        publishing_options: {
          marketplace_listing: false,
          crd_catalog_inclusion: true,
          print_available: false
        }
      };

      // Save using crdDataService
      const success = await crdDataService.saveCard(cardData.id, cardData);
      
      if (success) {
        toast.success('Card created successfully!');
        console.log('✅ Card saved to IndexedDB:', cardData);
        
        if (onComplete) {
          onComplete(cardData);
        }
      } else {
        throw new Error('Failed to save card');
      }
    } catch (error) {
      console.error('❌ Error creating card:', error);
      toast.error('Failed to create card. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Create Your Card</h1>
        <p className="text-crd-lightGray">Design a simple trading card with an image and title</p>
      </div>

      <Card className="p-6 bg-crd-darker border-crd-mediumGray">
        <div className="space-y-6">
          {/* Card Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white font-medium">
              Card Title *
            </Label>
            <Input
              id="title"
              placeholder="Enter your card title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-crd-darkest border-crd-mediumGray text-white"
              maxLength={100}
            />
          </div>

          {/* Card Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your card..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-crd-darkest border-crd-mediumGray text-white min-h-[100px]"
              maxLength={500}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-white font-medium">
              Card Image *
            </Label>
            
            <div className="space-y-4">
              {/* Upload Button */}
              <div className="flex items-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-crd-mediumGray text-white hover:bg-crd-mediumGray"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <span className="text-sm text-crd-lightGray">
                  PNG, JPG up to 5MB
                </span>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative">
                  <div className="bg-crd-darkest border border-crd-mediumGray rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 bg-crd-mediumGray rounded-lg flex items-center justify-center overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Card preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium mb-1">Preview</p>
                        <p className="text-crd-lightGray text-sm">
                          Your card image is ready
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!imagePreview && (
                <div className="bg-crd-darkest border-2 border-dashed border-crd-mediumGray rounded-lg p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-crd-mediumGray mx-auto mb-4" />
                  <p className="text-crd-lightGray">
                    Upload an image to see preview
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleCreateCard}
              disabled={isCreating || !title.trim()}
              className="flex-1 bg-crd-primary hover:bg-crd-primary/90 text-white"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Card
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-crd-mediumGray text-white hover:bg-crd-mediumGray"
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};