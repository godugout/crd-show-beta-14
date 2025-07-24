import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface PaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentIntent = async (
    listingId: string,
    amount: number
  ): Promise<PaymentIntentResponse | null> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-payment-intent', {
        body: {
          listing_id: listingId,
          amount: amount,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to create payment');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Payment intent error:', error);
      toast.error('Failed to initialize payment');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeTransaction = async (paymentIntentId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('finalize-transaction', {
        body: {
          payment_intent_id: paymentIntentId,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to finalize transaction');
        return false;
      }

      toast.success('Transaction completed successfully!');
      return true;
    } catch (error) {
      console.error('Transaction finalization error:', error);
      toast.error('Failed to complete transaction');
      return false;
    }
  };

  return {
    createPaymentIntent,
    finalizeTransaction,
    isProcessing,
  };
};