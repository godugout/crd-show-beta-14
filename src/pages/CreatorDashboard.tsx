import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  Eye, 
  Heart, 
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface CreatorStats {
  totalEarnings: number;
  pendingEarnings: number;
  cardsSold: number;
  totalViews: number;
  totalLikes: number;
}

interface Transaction {
  id: string;
  gross_amount: number;
  net_amount: number;
  platform_fee: number;
  transaction_date: string;
  status: string;
  card_title?: string;
}

const CreatorDashboard = () => {
  const [stats, setStats] = useState<CreatorStats>({
    totalEarnings: 0,
    pendingEarnings: 0,
    cardsSold: 0,
    totalViews: 0,
    totalLikes: 0
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please log in to view your dashboard');
        return;
      }

      // Fetch creator earnings
      const { data: earnings } = await supabase
        .from('creator_earnings')
        .select('*')
        .eq('creator_id', user.id);

      // Fetch card stats
      const { data: cards } = await supabase
        .from('cards')
        .select('view_count, favorite_count')
        .eq('creator_id', user.id);

      // Fetch marketplace transactions
      const { data: marketTransactions } = await supabase
        .from('marketplace_transactions')
        .select(`
          id,
          amount,
          created_at,
          status,
          marketplace_listings (
            cards (
              title
            )
          )
        `)
        .eq('buyer_id', user.id);

      // Calculate stats
      const totalEarnings = earnings?.reduce((sum, earning) => sum + (earning.net_amount || 0), 0) || 0;
      const pendingEarnings = earnings?.filter(e => e.status === 'pending').reduce((sum, earning) => sum + (earning.net_amount || 0), 0) || 0;
      const totalViews = cards?.reduce((sum, card) => sum + (card.view_count || 0), 0) || 0;
      const totalLikes = cards?.reduce((sum, card) => sum + (card.favorite_count || 0), 0) || 0;

      setStats({
        totalEarnings,
        pendingEarnings,
        cardsSold: marketTransactions?.length || 0,
        totalViews,
        totalLikes
      });

      // Format transactions
      const formattedTransactions = (marketTransactions || []).map(t => ({
        id: t.id,
        gross_amount: t.amount || 0,
        net_amount: (t.amount || 0) * 0.95, // 95% after 5% platform fee
        platform_fee: (t.amount || 0) * 0.05,
        transaction_date: t.created_at,
        status: t.status || 'completed',
        card_title: t.marketplace_listings?.cards?.title
      }));

      setTransactions(formattedTransactions);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, change }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Creator Dashboard</h1>
            <p className="text-muted-foreground">Track your earnings and performance</p>
          </div>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard
            title="Total Earnings"
            value={`$${stats.totalEarnings.toFixed(2)}`}
            icon={DollarSign}
            change="+20.1% from last month"
          />
          <StatCard
            title="Pending Earnings"
            value={`$${stats.pendingEarnings.toFixed(2)}`}
            icon={TrendingUp}
            change="Available for payout"
          />
          <StatCard
            title="Cards Sold"
            value={stats.cardsSold}
            icon={ExternalLink}
            change="+5 this month"
          />
          <StatCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={Eye}
            change="+12% from last month"
          />
          <StatCard
            title="Total Likes"
            value={stats.totalLikes.toLocaleString()}
            icon={Heart}
            change="+8% from last month"
          />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList>
            <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No transactions yet
                    </p>
                  ) : (
                    transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">
                            {transaction.card_title || 'Card Sale'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(transaction.transaction_date), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${transaction.net_amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Gross: ${transaction.gross_amount.toFixed(2)}
                          </p>
                        </div>
                        <Badge 
                          variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                          className="ml-4"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <Calendar className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Detailed analytics and insights will be available here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payouts">
            <Card>
              <CardHeader>
                <CardTitle>Payout Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Pending Balance</h4>
                    <p className="text-2xl font-bold">${stats.pendingEarnings.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Minimum payout: $10.00
                    </p>
                  </div>
                  
                  <Button 
                    disabled={stats.pendingEarnings < 10}
                    className="w-full"
                  >
                    Request Payout
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Payouts are processed weekly on Fridays. Fees may apply.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorDashboard;