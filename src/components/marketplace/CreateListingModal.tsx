import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface CreateListingModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserCard {
  id: string;
  title: string;
  image_url?: string;
  rarity: string;
}

export const CreateListingModal = ({ open, onClose, onSuccess }: CreateListingModalProps) => {
  const [loading, setLoading] = useState(false);
  const [userCards, setUserCards] = useState<UserCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(false);
  
  const [formData, setFormData] = useState({
    card_id: '',
    listing_type: 'fixed_price',
    price: '',
    auction_duration: '24',
    description: ''
  });

  // Fetch user's cards
  useEffect(() => {
    if (open) {
      fetchUserCards();
    }
  }, [open]);

  const fetchUserCards = async () => {
    setLoadingCards(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to create a listing');
        return;
      }

      const { data, error } = await supabase
        .from('cards')
        .select('id, title, image_url, rarity')
        .eq('creator_id', user.id)
        .eq('is_public', true);

      if (error) {
        console.error('Error fetching cards:', error);
        toast.error('Failed to load your cards');
        return;
      }

      setUserCards(data || []);
    } catch (error) {
      console.error('Error fetching user cards:', error);
      toast.error('Failed to load your cards');
    } finally {
      setLoadingCards(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.card_id || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to create a listing');
        return;
      }

      const listingData: any = {
        card_id: formData.card_id,
        seller_id: user.id,
        listing_type: formData.listing_type,
        price: parseFloat(formData.price),
        description: formData.description,
        status: 'active'
      };

      // Add auction end time if it's an auction
      if (formData.listing_type === 'auction') {
        const auctionEndTime = new Date();
        auctionEndTime.setHours(auctionEndTime.getHours() + parseInt(formData.auction_duration));
        listingData.auction_end_time = auctionEndTime.toISOString();
      }

      const { error } = await supabase
        .from('marketplace_listings')
        .insert([listingData]);

      if (error) {
        console.error('Error creating listing:', error);
        toast.error('Failed to create listing');
        return;
      }

      toast.success('Listing created successfully!');
      onSuccess();
      
      // Reset form
      setFormData({
        card_id: '',
        listing_type: 'fixed_price',
        price: '',
        auction_duration: '24',
        description: ''
      });

    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const selectedCard = userCards.find(card => card.id === formData.card_id);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Listing</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card Selection */}
          <div className="space-y-3">
            <Label>Select Card *</Label>
            {loadingCards ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : userCards.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Upload className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No cards available for listing</p>
                <p className="text-sm">Create and publish some cards first</p>
              </div>
            ) : (
              <Select value={formData.card_id} onValueChange={(value) => setFormData({...formData, card_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a card to list" />
                </SelectTrigger>
                <SelectContent>
                  {userCards.map(card => (
                    <SelectItem key={card.id} value={card.id}>
                      <div className="flex items-center gap-3">
                        {card.image_url && (
                          <img src={card.image_url} alt={card.title} className="w-8 h-8 object-cover rounded" />
                        )}
                        <div>
                          <div className="font-medium">{card.title}</div>
                          <div className="text-sm text-muted-foreground capitalize">{card.rarity}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Selected Card Preview */}
            {selectedCard && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {selectedCard.image_url && (
                      <img 
                        src={selectedCard.image_url} 
                        alt={selectedCard.title}
                        className="w-20 h-24 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{selectedCard.title}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{selectedCard.rarity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Listing Type */}
          <div className="space-y-3">
            <Label>Listing Type *</Label>
            <Select value={formData.listing_type} onValueChange={(value) => setFormData({...formData, listing_type: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed_price">Fixed Price</SelectItem>
                <SelectItem value="auction">Auction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price */}
          <div className="space-y-3">
            <Label>
              {formData.listing_type === 'auction' ? 'Starting Price *' : 'Price *'}
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="pl-8"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Auction Duration */}
          {formData.listing_type === 'auction' && (
            <div className="space-y-3">
              <Label>Auction Duration</Label>
              <Select value={formData.auction_duration} onValueChange={(value) => setFormData({...formData, auction_duration: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="48">48 hours</SelectItem>
                  <SelectItem value="72">3 days</SelectItem>
                  <SelectItem value="168">7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-3">
            <Label>Description</Label>
            <Textarea
              placeholder="Add details about your card, its condition, or any special features..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !formData.card_id || !formData.price}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};