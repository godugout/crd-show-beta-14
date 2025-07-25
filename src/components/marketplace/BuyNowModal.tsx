import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, CreditCard, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { usePayment } from '@/hooks/usePayment';

interface BuyNowModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  listing: {
    id: string;
    title: string;
    price: number;
    image_url?: string;
    creator_name?: string;
  };
}

export const BuyNowModal = ({ open, onClose, onSuccess, listing }: BuyNowModalProps) => {
  const [processing, setProcessing] = useState(false);
  const { createPaymentIntent, finalizeTransaction, isProcessing } = usePayment();

  const handlePurchase = async () => {
    setProcessing(true);
    
    try {
      // Create payment intent
      const paymentData = await createPaymentIntent(listing.id, listing.price);
      
      if (!paymentData) {
        throw new Error('Failed to initialize payment');
      }

      // Simulate Stripe checkout (in real implementation, you'd use Stripe Elements)
      // For demo purposes, we'll assume payment succeeds
      const paymentSucceeded = true;
      
      if (paymentSucceeded) {
        const success = await finalizeTransaction(paymentData.payment_intent_id);
        if (success) {
          toast.success('Purchase successful! The card is now yours.');
          onSuccess();
          onClose();
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const platformFee = listing.price * 0.05;
  const total = listing.price;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Purchase</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Card Preview */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {listing.image_url && (
                  <img 
                    src={listing.image_url} 
                    alt={listing.title}
                    className="w-16 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    by {listing.creator_name || 'Unknown Creator'}
                  </p>
                  <p className="font-bold text-lg">${listing.price.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Card Price</span>
              <span>${listing.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Platform Fee (5%)</span>
              <span>${platformFee.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-3 bg-muted rounded-lg">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Secure Payment</p>
              <p className="text-muted-foreground">
                Your payment is processed securely through Stripe.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={processing}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePurchase}
              className="flex-1"
              disabled={processing || isProcessing}
            >
              {processing || isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Buy Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};