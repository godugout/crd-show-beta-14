import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

export interface SubscriptionPlan {
  id: string;
  name: string;
  price_monthly: number;
  price_annual?: number;
  features: Json;
  monthly_card_limit?: number;
  is_active: boolean;
  sort_order: number;
}

export interface UserSubscription {
  id: string;
  plan_id: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  canceled_at?: string;
  subscription_plans: SubscriptionPlan;
}

export const useSubscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching subscription plans:', error);
        return;
      }

      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const fetchUserSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        console.error('Error fetching user subscription:', error);
        return;
      }

      setUserSubscription(data || null);
    } catch (error) {
      console.error('Error fetching user subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (planId: string, billingCycle: 'monthly' | 'annual' = 'monthly'): Promise<string | null> => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-subscription', {
        body: {
          plan_id: planId,
          billing_cycle: billingCycle,
        },
      });

      if (error) {
        toast.error(error.message || 'Failed to create subscription');
        return null;
      }

      if (data.subscription_type === 'free') {
        toast.success('Free subscription activated!');
        await fetchUserSubscription();
        return null;
      }

      return data.checkout_url;
    } catch (error) {
      console.error('Subscription creation error:', error);
      toast.error('Failed to create subscription');
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  const hasFeature = (featureKey: string): boolean => {
    if (!userSubscription?.subscription_plans?.features) return false;
    const features = userSubscription.subscription_plans.features as Record<string, any>;
    return features[featureKey] === true;
  };

  const getCardLimit = (): number => {
    if (!userSubscription?.subscription_plans?.monthly_card_limit) return 10; // Default free limit
    const limit = userSubscription.subscription_plans.monthly_card_limit;
    return limit === -1 ? Infinity : limit;
  };

  const isSubscribed = (): boolean => {
    return userSubscription?.status === 'active';
  };

  const getCurrentPlan = (): SubscriptionPlan | null => {
    return userSubscription?.subscription_plans || null;
  };

  useEffect(() => {
    fetchPlans();
    fetchUserSubscription();
  }, []);

  return {
    plans,
    userSubscription,
    isLoading,
    isProcessing,
    createSubscription,
    hasFeature,
    getCardLimit,
    isSubscribed,
    getCurrentPlan,
    fetchUserSubscription,
  };
};