import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Download,
  CreditCard,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { useTeamTheme } from '@/hooks/useTeamTheme';

interface Transaction {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  transaction_type?: string;
  payment_method?: string;
  marketplace_listings?: {
    card: {
      title: string;
    };
  };
}

interface Earning {
  id: string;
  amount?: number;
  gross_amount?: number;
  platform_fee: number;
  net_amount: number;
  status: string;
  transaction_date: string;
}

interface Payout {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at?: string;
}

const TransactionsDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    totalPayouts: 0,
    transactionCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transactions' | 'earnings' | 'payouts'>('transactions');
  const { currentPalette, currentThemeId } = useTeamTheme();

  const fetchTransactions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('marketplace_transactions')
        .select(`
          *,
          marketplace_listings (
            card:cards (
              title
            )
          )
        `)
        .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchEarnings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('creator_earnings')
        .select('*')
        .eq('creator_id', user.id)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error('Error fetching earnings:', error);
        return;
      }

      setEarnings(data || []);

      // Calculate stats
      const totalEarnings = data?.reduce((sum, earning) => sum + earning.net_amount, 0) || 0;
      const pendingEarnings = data?.filter(e => e.status === 'pending')
        .reduce((sum, earning) => sum + earning.net_amount, 0) || 0;

      setStats(prev => ({
        ...prev,
        totalEarnings,
        pendingEarnings,
      }));
    } catch (error) {
      console.error('Error fetching earnings:', error);
    }
  };

  const fetchPayouts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('creator_payouts')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payouts:', error);
        return;
      }

      setPayouts(data || []);

      const totalPayouts = data?.filter(p => p.status === 'paid')
        .reduce((sum, payout) => sum + payout.amount, 0) || 0;

      setStats(prev => ({
        ...prev,
        totalPayouts,
        transactionCount: transactions.length,
      }));
    } catch (error) {
      console.error('Error fetching payouts:', error);
    }
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    await Promise.all([
      fetchTransactions(),
      fetchEarnings(),
      fetchPayouts(),
    ]);
    setIsLoading(false);
    toast.success('Data refreshed successfully');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'text-green-700 border border-green-200';
      case 'pending':
        return 'text-yellow-700 border border-yellow-200';
      case 'failed':
      case 'refunded':
        return 'text-red-700 border border-red-200';
      default:
        return 'text-muted-foreground border border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <RefreshCw className="w-4 h-4" />;
      case 'failed':
      case 'refunded':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <RefreshCw className="w-4 h-4" />;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchTransactions(),
        fetchEarnings(),
        fetchPayouts(),
      ]);
      setIsLoading(false);
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div key={currentThemeId} className="min-h-screen bg-background flex flex-col">
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        {/* Premium Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              🪙 CRD <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, hsl(var(--theme-accent)), hsl(var(--theme-primary)))'
                }}
              >Wallet</span>
            </h1>
            <p className="text-muted-foreground">Manage your payments, earnings, and payouts</p>
          </div>
          <button 
            onClick={handleRefreshData} 
            disabled={isLoading}
            className="flex items-center gap-2 hover-scale px-4 sm:px-6 py-2 text-sm sm:text-base min-h-[40px] rounded-md font-medium transition-all duration-200"
            style={{
              backgroundColor: 'hsl(var(--theme-primary))',
              color: 'white'
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Premium Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Earnings",
              value: `$${stats.totalEarnings.toFixed(2)}`,
              description: "All-time creator earnings",
              icon: DollarSign,
              color: 'hsl(var(--theme-accent))',
              delay: "0s"
            },
            {
              title: "Pending Earnings", 
              value: `$${stats.pendingEarnings.toFixed(2)}`,
              description: "Awaiting payout",
              icon: TrendingUp,
              color: 'hsl(var(--theme-secondary))',
              delay: "0.1s"
            },
            {
              title: "Total Payouts",
              value: `$${stats.totalPayouts.toFixed(2)}`,
              description: "Successfully paid out",
              icon: CreditCard,
              color: 'hsl(var(--theme-primary))',
              delay: "0.2s"
            },
            {
              title: "Transactions",
              value: stats.transactionCount.toString(),
              description: "Total transactions", 
              icon: Calendar,
              color: 'hsl(var(--theme-accent))',
              delay: "0.3s"
            }
          ].map((stat) => (
            <div 
              key={stat.title}
              className="bg-card border border-border rounded-lg p-6 hover-scale animate-fade-in"
              style={{ animationDelay: stat.delay }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon 
                    className="h-5 w-5"
                    style={{ color: stat.color }}
                  />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Premium Tabs */}
        <div className="flex space-x-2 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { key: 'transactions', label: 'Transactions' },
            { key: 'earnings', label: 'Earnings' },
            { key: 'payouts', label: 'Payouts' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`
                px-4 sm:px-6 py-2 text-sm sm:text-base min-h-[40px] rounded-md font-medium transition-all duration-200 hover-scale
                ${activeTab === tab.key 
                  ? 'text-primary-foreground' 
                  : 'bg-card text-muted-foreground hover:text-foreground border border-border'
                }
              `}
              style={activeTab === tab.key ? {
                background: 'hsl(var(--theme-primary))'
              } : {}}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Premium Content Card */}
        <div className="bg-card border border-border rounded-lg animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-bold text-foreground">
              {activeTab === 'transactions' && 'Recent Transactions'}
              {activeTab === 'earnings' && 'Creator Earnings'}
              {activeTab === 'payouts' && 'Payout History'}
            </h2>
            <button 
              className="flex items-center gap-2 px-4 sm:px-6 py-2 text-sm sm:text-base min-h-[40px] rounded-md font-medium transition-all duration-200 hover-scale"
              style={{
                backgroundColor: 'hsl(var(--theme-accent))',
                color: 'white'
              }}
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="p-6">
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <div 
                    key={transaction.id} 
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover-scale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div style={{ color: 'hsl(var(--theme-accent))' }}>
                        {getStatusIcon(transaction.status)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {transaction.marketplace_listings?.card?.title || 'Marketplace Transaction'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground token-amount">${transaction.amount.toFixed(2)}</p>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-card/50 ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-4">
                {earnings.map((earning, index) => (
                  <div 
                    key={earning.id} 
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover-scale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div style={{ color: 'hsl(var(--theme-accent))' }}>
                        {getStatusIcon(earning.status)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Creator Earning</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(earning.transaction_date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground token-amount">${earning.net_amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        Gross: ${(earning.gross_amount || earning.amount || 0).toFixed(2)} - Fee: ${earning.platform_fee.toFixed(2)}
                      </p>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-card/50 ${getStatusColor(earning.status)}`}
                      >
                        {earning.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="space-y-4">
                {payouts.map((payout, index) => (
                  <div 
                    key={payout.id} 
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover-scale"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div style={{ color: 'hsl(var(--theme-accent))' }}>
                        {getStatusIcon(payout.status)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Payout</p>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDistanceToNow(new Date(payout.created_at), { addSuffix: true })}
                          {payout.processed_at && (
                            <span> • Processed: {formatDistanceToNow(new Date(payout.processed_at), { addSuffix: true })}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground token-amount">${payout.amount.toFixed(2)}</p>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium bg-card/50 ${getStatusColor(payout.status)}`}
                      >
                        {payout.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsDashboard;