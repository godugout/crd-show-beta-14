import React from 'react';
import { Check, Coins, Crown, Star } from 'lucide-react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { toast } from 'sonner';

const Pricing = () => {
  const { plans, userSubscription, isProcessing, createSubscription } = useSubscription();
  const { currentPalette } = useTeamTheme();

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
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-16 flex-1">
        {/* Premium Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative">
            <div 
              className="absolute inset-0 blur-3xl opacity-30"
              style={{
                background: `linear-gradient(135deg, ${currentPalette?.colors.primary || 'hsl(var(--primary))'}, ${currentPalette?.colors.secondary || 'hsl(var(--secondary))'}, ${currentPalette?.colors.accent || 'hsl(var(--accent))'})`
              }}
            ></div>
            <h1 className="relative text-5xl md:text-6xl font-bold mb-6 text-foreground">
              Choose Your <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${currentPalette?.colors.primary || 'hsl(var(--primary))'}, ${currentPalette?.colors.accent || 'hsl(var(--accent))'})`
                }}
              >Plan</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From hobbyist creators to professional collectors, we have the perfect plan for your CRD journey.
          </p>
        </div>

        {/* Premium CRD Token Section */}
        <div className="relative mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div 
            className="absolute inset-0 rounded-lg blur-xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${currentPalette?.colors.accent || 'hsl(var(--accent))'}, ${currentPalette?.colors.primary || 'hsl(var(--primary))'})`
            }}
          ></div>
          <div 
            className="relative bg-card border rounded-lg p-8"
            style={{
              borderColor: `${currentPalette?.colors.accent || 'hsl(var(--accent))'}40`
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div 
                className="p-3 rounded-lg"
                style={{
                  backgroundColor: `${currentPalette?.colors.accent || 'hsl(var(--accent))'}20`
                }}
              >
                <Coins 
                  className="w-8 h-8"
                  style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                />
              </div>
              <h2 className="text-3xl font-bold text-foreground flex items-center gap-2">
                🪙 CRD Tokens
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 
                  className="font-semibold mb-3 text-lg"
                  style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                >
                  What are CRD Tokens?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  CRD tokens are our premium in-app currency. Use them for marketplace purchases, auction bids, 
                  and exclusive features. <span className="token-amount">1 USD = 100 CRD</span>
                </p>
              </div>
              <div>
                <h3 
                  className="font-semibold mb-3 text-lg"
                  style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                >
                  Premium Usage
                </h3>
                <ul className="text-muted-foreground space-y-2">
                  <li className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                    ></span>
                    Marketplace purchases (100-5000 CRD typical)
                  </li>
                  <li className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                    ></span>
                    Auction bidding (50 CRD minimum)
                  </li>
                  <li className="flex items-center gap-2">
                    <span 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                    ></span>
                    Premium card templates and effects
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const features = plan.features as Record<string, any>;
            const isCurrent = isCurrentPlan(plan.id);
            const isPopular = plan.name === 'Collector';

            return (
              <div 
                key={plan.id} 
                className={`
                  relative bg-card border rounded-xl transition-all duration-300 hover-scale animate-fade-in
                  ${isCurrent ? 'ring-2 ring-primary' : 'hover:border-primary/40'}
                  ${isPopular ? 'ring-2' : ''}
                `}
                style={{ 
                  animationDelay: `${index * 0.1}s`,
                  ...(isPopular ? { 
                    borderColor: currentPalette?.colors.accent || 'hsl(var(--accent))',
                    ringColor: `${currentPalette?.colors.accent || 'hsl(var(--accent))'}40`
                  } : {})
                }}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div 
                      className="text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse"
                      style={{
                        background: `linear-gradient(135deg, ${currentPalette?.colors.primary || 'hsl(var(--primary))'}, ${currentPalette?.colors.accent || 'hsl(var(--accent))'})`
                      }}
                    >
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center pb-6">
                    <div className="flex justify-center mb-4">
                      <div 
                        className="p-3 rounded-lg"
                        style={{
                          backgroundColor: `${currentPalette?.colors.primary || 'hsl(var(--primary))'}20`
                        }}
                      >
                        {getPlanIcon(plan.name)}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">{plan.name}</h3>
                    <div className="text-5xl font-bold text-foreground mb-2">
                      ${plan.price_monthly}
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    </div>
                    {plan.price_annual && plan.price_annual > 0 && (
                      <p 
                        className="text-sm"
                        style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                      >
                        or ${plan.price_annual}/year (save {Math.round((1 - plan.price_annual / (plan.price_monthly * 12)) * 100)}%)
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3">
                      <Check 
                        className="w-5 h-5 flex-shrink-0"
                        style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                      />
                      <span className="text-muted-foreground">
                        {plan.monthly_card_limit === -1 
                          ? 'Unlimited cards per month' 
                          : `${plan.monthly_card_limit} cards per month`}
                      </span>
                    </div>
                    
                    {features.basic_effects && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Basic card effects</span>
                      </div>
                    )}
                    
                    {features.premium_effects && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Premium card effects</span>
                      </div>
                    )}
                    
                    {features.community_access && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Community access</span>
                      </div>
                    )}
                    
                    {features.marketplace_access && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Marketplace buying</span>
                      </div>
                    )}
                    
                    {features.marketplace_selling && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Marketplace selling (70/30 split)</span>
                      </div>
                    )}
                    
                    {features.analytics && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Advanced analytics</span>
                      </div>
                    )}
                    
                    {features.priority_support && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Priority support</span>
                      </div>
                    )}
                    
                    {features.revenue_sharing && (
                      <div className="flex items-center gap-3">
                        <Check 
                          className="w-5 h-5 flex-shrink-0"
                          style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                        />
                        <span className="text-muted-foreground">Revenue sharing program</span>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`btn-primary w-full ${isCurrent ? 'opacity-50 cursor-not-allowed' : 'hover-scale'}`}
                    disabled={isCurrent || isProcessing}
                    onClick={() => handleSelectPlan(plan.id, plan.name, plan.price_monthly)}
                  >
                    {isCurrent ? 'Current Plan' : `Get ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Premium Platform Fees Visualization */}
        <div className="relative mb-16 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div 
            className="absolute inset-0 rounded-lg blur-xl opacity-20"
            style={{
              background: `linear-gradient(135deg, ${currentPalette?.colors.primary || 'hsl(var(--primary))'}, ${currentPalette?.colors.accent || 'hsl(var(--accent))'})`
            }}
          ></div>
          <div className="relative bg-card border border-border rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Platform Fees</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 bg-card border border-border rounded-lg hover-scale">
                <h3 className="font-semibold mb-3 text-foreground">Marketplace Sales</h3>
                <div 
                  className="text-4xl font-bold mb-3"
                  style={{ color: currentPalette?.colors.accent || 'hsl(var(--accent))' }}
                >
                  2.5%
                </div>
                <p className="text-muted-foreground">Platform fee on all marketplace transactions</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-lg hover-scale">
                <h3 className="font-semibold mb-3 text-foreground">Creator Revenue</h3>
                <div 
                  className="text-4xl font-bold mb-3"
                  style={{ color: currentPalette?.colors.primary || 'hsl(var(--primary))' }}
                >
                  70%
                </div>
                <p className="text-muted-foreground">Creator keeps 70%, platform takes 30%</p>
              </div>
              <div className="text-center p-6 bg-card border border-border rounded-lg hover-scale">
                <h3 className="font-semibold mb-3 text-foreground">Auction Fees</h3>
                <div 
                  className="text-4xl font-bold mb-3"
                  style={{ color: currentPalette?.colors.secondary || 'hsl(var(--secondary))' }}
                >
                  2.5%
                </div>
                <p className="text-muted-foreground">Fee on final auction sale price</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium FAQ Section */}
        <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-lg p-6 hover-scale">
              <h3 className="font-semibold mb-3 text-foreground text-lg">Can I change plans anytime?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 hover-scale">
              <h3 className="font-semibold mb-3 text-foreground text-lg">What payment methods do you accept?</h3>
              <p className="text-muted-foreground leading-relaxed">
                We accept all major credit cards, PayPal, and our in-app CRD tokens for marketplace purchases.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 hover-scale">
              <h3 className="font-semibold mb-3 text-foreground text-lg">How do CRD tokens work?</h3>
              <p className="text-muted-foreground leading-relaxed">
                CRD tokens are purchased at <span className="token-amount">$1 USD = 100 CRD</span>. Use them for marketplace purchases, auctions, and premium features.
              </p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6 hover-scale">
              <h3 className="font-semibold mb-3 text-foreground text-lg">Is there a free trial?</h3>
              <p className="text-muted-foreground leading-relaxed">
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