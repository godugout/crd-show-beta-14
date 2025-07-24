import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Lock, Coins } from 'lucide-react';
import { usePayment } from '@/hooks/usePayment';
import { useTokens } from '@/hooks/useTokens';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: string;
    card: {
      title: string;
    };
    price: number;
    current_bid?: number;
    listing_type: string;
  };
  onSuccess: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  listing,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  
  const { createPaymentIntent, finalizeTransaction, isProcessing } = usePayment();
  const { tokenBalance, spendTokens, isProcessing: isTokenProcessing } = useTokens();

  const finalPrice = listing.listing_type === 'auction' 
    ? (listing.current_bid || listing.price)
    : listing.price;

  // Convert USD to CRD tokens (1 USD = 100 CRD)
  const tokenPrice = Math.round(finalPrice * 100);
  const hasEnoughTokens = (tokenBalance?.token_balance || 0) >= tokenPrice;

  const handleTokenPayment = async () => {
    if (!hasEnoughTokens) {
      toast.error('Insufficient CRD tokens');
      return;
    }

    const success = await spendTokens(
      tokenPrice,
      'marketplace_purchase',
      `Purchase: ${listing.card.title}`
    );

    if (success) {
      onSuccess();
      onClose();
      toast.success('Purchase completed with CRD tokens!');
    }
  };

  const handleCardPayment = async () => {
    if (!cardNumber || !expiryDate || !cvv || !nameOnCard) {
      return;
    }

    // Create payment intent
    const paymentData = await createPaymentIntent(listing.id, finalPrice);
    if (!paymentData) return;

    // In a real implementation, you would integrate with Stripe Elements here
    // For demo purposes, we'll simulate successful payment
    const success = await finalizeTransaction(paymentData.payment_intent_id);
    
    if (success) {
      onSuccess();
      onClose();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Complete Purchase
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{listing.card.title}</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Price (USD):</span>
                <span className="text-xl font-bold">${finalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Price (CRD):</span>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4" />
                  <span>{tokenPrice.toLocaleString()} CRD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <Tabs defaultValue="tokens" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tokens" className="flex items-center gap-2">
                <Coins className="w-4 h-4" />
                CRD Tokens
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Credit Card
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tokens" className="space-y-4">
              {/* Token Balance */}
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Your CRD Balance:</span>
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-600" />
                    <span className="font-bold">{(tokenBalance?.token_balance || 0).toLocaleString()}</span>
                  </div>
                </div>
                {!hasEnoughTokens && (
                  <p className="text-sm text-destructive">
                    Insufficient tokens. You need {tokenPrice.toLocaleString()} CRD tokens.
                  </p>
                )}
              </div>

              <Button
                onClick={handleTokenPayment}
                className="w-full"
                disabled={isTokenProcessing || !hasEnoughTokens}
              >
                {isTokenProcessing ? 'Processing...' : `Pay ${tokenPrice.toLocaleString()} CRD`}
              </Button>
            </TabsContent>

            <TabsContent value="card" className="space-y-4">
              {/* Payment Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input
                    id="card-number"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                      maxLength={3}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Name on Card</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={nameOnCard}
                    onChange={(e) => setNameOnCard(e.target.value)}
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="h-4 w-4" />
                <span>Your payment information is secure and encrypted</span>
              </div>

              <Button
                onClick={handleCardPayment}
                className="w-full"
                disabled={isProcessing || !cardNumber || !expiryDate || !cvv || !nameOnCard}
              >
                {isProcessing ? 'Processing...' : `Pay $${finalPrice.toLocaleString()}`}
              </Button>
            </TabsContent>
          </Tabs>

          {/* Cancel Button */}
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            disabled={isProcessing || isTokenProcessing}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};