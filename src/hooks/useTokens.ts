import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TokenBalance {
  token_balance: number;
  lifetime_earned: number;
  lifetime_spent: number;
  last_transaction_at?: string;
}

export interface TokenTransaction {
  id: string;
  transaction_type: string;
  amount: number;
  source: string;
  description?: string;
  created_at: string;
}

export const useTokens = () => {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance | null>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchTokenBalance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_tokens')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching token balance:', error);
        return;
      }

      if (data) {
        setTokenBalance(data);
      } else {
        // Initialize with zero balance
        setTokenBalance({
          token_balance: 0,
          lifetime_earned: 0,
          lifetime_spent: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const purchaseTokens = async (tokenAmount: number): Promise<{ client_secret: string; payment_intent_id: string } | null> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('purchase-tokens', {
        body: {
          token_amount: tokenAmount,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to create token purchase');
        return null;
      }

      return data;
    } catch (error) {
      console.error('Token purchase error:', error);
      toast.error('Failed to purchase tokens');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const finalizeTokenPurchase = async (paymentIntentId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke('finalize-token-purchase', {
        body: {
          payment_intent_id: paymentIntentId,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to finalize token purchase');
        return false;
      }

      toast.success(`Successfully added ${data.tokens_added} CRD tokens!`);
      await fetchTokenBalance(); // Refresh balance
      await fetchTransactions(); // Refresh transactions
      return true;
    } catch (error) {
      console.error('Token purchase finalization error:', error);
      toast.error('Failed to complete token purchase');
      return false;
    }
  };

  const spendTokens = async (amount: number, source: string, description?: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase.rpc('update_user_token_balance', {
        user_uuid: user.id,
        amount_change: -amount,
        transaction_type_param: 'spend',
        source_param: source,
        description_param: description,
      });

      if (error || !data) {
        toast.error('Insufficient tokens or transaction failed');
        return false;
      }

      await fetchTokenBalance();
      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error spending tokens:', error);
      toast.error('Failed to process token payment');
      return false;
    }
  };

  useEffect(() => {
    fetchTokenBalance();
    fetchTransactions();
  }, []);

  return {
    tokenBalance,
    transactions,
    isLoading,
    isProcessing,
    purchaseTokens,
    finalizeTokenPurchase,
    spendTokens,
    fetchTokenBalance,
    fetchTransactions,
  };
};