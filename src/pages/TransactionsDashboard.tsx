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
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Transactions Dashboard</h1>
            <p className="text-muted-foreground">Manage your payments, earnings, and payouts</p>
          </div>
          <Button onClick={handleRefreshData} disabled={isLoading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                All-time creator earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.pendingEarnings.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting payout
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalPayouts.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Successfully paid out
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.transactionCount}</div>
              <p className="text-xs text-muted-foreground">
                Total transactions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          {[
            { key: 'transactions', label: 'Transactions' },
            { key: 'earnings', label: 'Earnings' },
            { key: 'payouts', label: 'Payouts' },
          ].map((tab) => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.key as any)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {activeTab === 'transactions' && 'Recent Transactions'}
              {activeTab === 'earnings' && 'Creator Earnings'}
              {activeTab === 'payouts' && 'Payout History'}
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            {activeTab === 'transactions' && (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(transaction.status)}
                      <div>
                        <p className="font-medium">
                          {transaction.marketplace_listings?.card?.title || 'Marketplace Transaction'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${transaction.amount.toFixed(2)}</p>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="space-y-4">
                {earnings.map((earning) => (
                  <div key={earning.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(earning.status)}
                      <div>
                        <p className="font-medium">Creator Earning</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(earning.transaction_date), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${earning.net_amount.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">
                        Gross: ${(earning.gross_amount || earning.amount || 0).toFixed(2)} - Fee: ${earning.platform_fee.toFixed(2)}
                      </p>
                      <Badge className={getStatusColor(earning.status)}>
                        {earning.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="space-y-4">
                {payouts.map((payout) => (
                  <div key={payout.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(payout.status)}
                      <div>
                        <p className="font-medium">Payout</p>
                        <p className="text-sm text-muted-foreground">
                          Created: {formatDistanceToNow(new Date(payout.created_at), { addSuffix: true })}
                          {payout.processed_at && (
                            <span> • Processed: {formatDistanceToNow(new Date(payout.processed_at), { addSuffix: true })}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${payout.amount.toFixed(2)}</p>
                      <Badge className={getStatusColor(payout.status)}>
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsDashboard;