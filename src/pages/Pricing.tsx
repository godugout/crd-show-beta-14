import React from 'react';
import { Check, Coins, Crown, Star } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';

const Pricing = () => {
  const { plans, userSubscription, isProcessing, createSubscription } = useSubscription();

  const handleSelectPlan = async (planId: string, planName: string, price: number) => {
    if (price === 0) {
      // Free plan
      const url = await createSubscription(planId, 'monthly');
      if (!url) {
        // Already handled in hook
        return;
      }
    } else {
      // Paid plan - open Stripe checkout
      const url = await createSubscription(planId, 'monthly');
      if (url) {
        window.open(url, '_blank');
      }
    }
  };

  const getPlanIcon = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return <Star className="w-6 h-6" />;
      case 'collector':
        return <Coins className="w-6 h-6" />;
      case 'creator pro':
        return <Crown className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const isCurrentPlan = (planId: string) => {
    return userSubscription?.plan_id === planId;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From hobbyist creators to professional collectors, we have the perfect plan for your CRD journey.
          </p>
        </div>

        {/* CRD Token Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-6 mb-12">
          <div className="flex items-center gap-3 mb-3">
            <Coins className="w-8 h-8 text-yellow-600" />
            <h2 className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">CRD Tokens</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">What are CRD Tokens?</h3>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm">
                CRD tokens are our in-app currency. Use them for marketplace purchases, auction bids, 
                and premium features. 1 USD = 100 CRD tokens.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-yellow-700 dark:text-yellow-300">Usage Examples</h3>
              <ul className="text-yellow-600 dark:text-yellow-400 text-sm space-y-1">
                <li>• Marketplace purchases (100-5000 CRD typical)</li>
                <li>• Auction bidding (50 CRD minimum)</li>
                <li>• Premium card templates and effects</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const features = plan.features as Record<string, any>;
            const isCurrent = isCurrentPlan(plan.id);
            const isPopular = plan.name === 'Collector';

            return (
              <Card key={plan.id} className={`relative ${isCurrent ? 'ring-2 ring-primary' : ''}`}>
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.name)}
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold">
                    ${plan.price_monthly}
                    <span className="text-lg font-normal text-muted-foreground">/month</span>
                  </div>
                  {plan.price_annual && plan.price_annual > 0 && (
                    <p className="text-sm text-muted-foreground">
                      or ${plan.price_annual}/year (save {Math.round((1 - plan.price_annual / (plan.price_monthly * 12)) * 100)}%)
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">
                        {plan.monthly_card_limit === -1 
                          ? 'Unlimited cards per month' 
                          : `${plan.monthly_card_limit} cards per month`}
                      </span>
                    </div>
                    
                    {features.basic_effects && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Basic card effects</span>
                      </div>
                    )}
                    
                    {features.premium_effects && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Premium card effects</span>
                      </div>
                    )}
                    
                    {features.community_access && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Community access</span>
                      </div>
                    )}
                    
                    {features.marketplace_access && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Marketplace buying</span>
                      </div>
                    )}
                    
                    {features.marketplace_selling && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Marketplace selling (70/30 split)</span>
                      </div>
                    )}
                    
                    {features.analytics && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Advanced analytics</span>
                      </div>
                    )}
                    
                    {features.priority_support && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Priority support</span>
                      </div>
                    )}
                    
                    {features.revenue_sharing && (
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">Revenue sharing program</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <CRDButton
                    variant={isCurrent ? "outline" : "primary"}
                    className="w-full"
                    disabled={isCurrent || isProcessing}
                    onClick={() => handleSelectPlan(plan.id, plan.name, plan.price_monthly)}
                  >
                    {isCurrent ? 'Current Plan' : `Get ${plan.name}`}
                  </CRDButton>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Platform Fees Section */}
        <div className="bg-muted/50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Platform Fees</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Marketplace Sales</h3>
              <div className="text-3xl font-bold text-primary mb-2">2.5%</div>
              <p className="text-sm text-muted-foreground">Platform fee on all marketplace transactions</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Creator Revenue</h3>
              <div className="text-3xl font-bold text-green-600 mb-2">70%</div>
              <p className="text-sm text-muted-foreground">Creator keeps 70%, platform takes 30%</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Auction Fees</h3>
              <div className="text-3xl font-bold text-blue-600 mb-2">2.5%</div>
              <p className="text-sm text-muted-foreground">Fee on final auction sale price</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground text-sm">
                We accept all major credit cards, PayPal, and our in-app CRD tokens for marketplace purchases.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">How do CRD tokens work?</h3>
              <p className="text-muted-foreground text-sm">
                CRD tokens are purchased at $1 USD = 100 CRD. Use them for marketplace purchases, auctions, and premium features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground text-sm">
                Our Free plan gives you full access to basic features. Upgrade anytime to unlock premium capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;