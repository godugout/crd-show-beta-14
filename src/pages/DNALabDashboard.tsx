import React, { useState, useEffect } from 'react';
import { AdminRoute } from '@/features/admin/components/AdminRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Shield, 
  Palette, 
  DollarSign, 
  Activity,
  Database,
  BarChart3,
  Settings,
  Search,
  Bell,
  Zap,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const StatCard = ({ title, value, change, icon: Icon, className = "" }) => (
  <Card className={`p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20 ${className}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-crd-mutedText">{title}</p>
        <p className="text-2xl font-bold text-crd-lightText">{value}</p>
        {change && (
          <Badge variant={change.startsWith('+') ? 'default' : 'destructive'} className="mt-2">
            {change}
          </Badge>
        )}
      </div>
      <Icon className="h-8 w-8 text-crd-blue/60" />
    </div>
  </Card>
);

const QuickActionCard = ({ title, description, icon: Icon, onClick, disabled = false }) => (
  <Card 
    className={`p-4 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20 hover:border-crd-blue/40 transition-all cursor-pointer ${disabled ? 'opacity-50' : ''}`}
    onClick={disabled ? undefined : onClick}
  >
    <div className="flex items-center space-x-3">
      <Icon className="h-6 w-6 text-crd-blue" />
      <div>
        <h3 className="font-semibold text-crd-lightText">{title}</h3>
        <p className="text-sm text-crd-mutedText">{description}</p>
      </div>
    </div>
  </Card>
);

export default function DNALabDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    users: { total: 0, growth: 0 },
    cards: { total: 0, growth: 0 },
    revenue: { total: 0, growth: 0 },
    activity: { total: 0, growth: 0 }
  });
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenue: [],
    cardTypes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch user count
      const { count: userCount } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch card count
      const { count: cardCount } = await supabase
        .from('cards')
        .select('*', { count: 'exact', head: true });

      // Fetch transaction data
      const { data: transactions } = await supabase
        .from('marketplace_transactions')
        .select('amount, created_at')
        .order('created_at', { ascending: false });

      // Calculate revenue
      const totalRevenue = transactions?.reduce((sum, t) => sum + (t.amount || 0), 0) || 0;

      // Fetch recent activity
      const { count: activityCount } = await supabase
        .from('social_activities')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Mock growth percentages (in real app, compare with previous period)
      setDashboardData({
        users: { total: userCount || 0, growth: 12.5 },
        cards: { total: cardCount || 0, growth: 8.3 },
        revenue: { total: totalRevenue, growth: 15.7 },
        activity: { total: activityCount || 0, growth: 22.1 }
      });

      // Generate chart data
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          users: Math.floor(Math.random() * 100) + 50,
          revenue: Math.floor(Math.random() * 1000) + 500
        };
      });

      setChartData({
        userGrowth: last7Days,
        revenue: last7Days,
        cardTypes: [
          { name: 'Common', value: 45, color: '#8B5CF6' },
          { name: 'Rare', value: 30, color: '#06B6D4' },
          { name: 'Epic', value: 20, color: '#F59E0B' },
          { name: 'Legendary', value: 5, color: '#EF4444' }
        ]
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      onClick: () => navigate('/dna/lab/users')
    },
    {
      title: "Content Moderation",
      description: "Review flagged content and reports",
      icon: Shield,
      onClick: () => navigate('/dna/lab/moderation')
    },
    {
      title: "Creator Economy",
      description: "Manage creators and earnings",
      icon: Palette,
      onClick: () => navigate('/dna/lab/creators')
    },
    {
      title: "Financial Operations",
      description: "Transaction monitoring and payouts",
      icon: DollarSign,
      onClick: () => navigate('/dna/lab/finance')
    },
    {
      title: "Feature Experiments",
      description: "A/B tests and feature flags",
      icon: Zap,
      onClick: () => navigate('/dna/lab/experiments')
    },
    {
      title: "System Operations",
      description: "Performance and infrastructure",
      icon: Database,
      onClick: () => navigate('/dna/lab/ops')
    },
    {
      title: "Business Intelligence",
      description: "Advanced analytics and reports",
      icon: BarChart3,
      onClick: () => navigate('/dna/lab/insights')
    },
    {
      title: "Community Management",
      description: "Forums, challenges, and events",
      icon: Activity,
      onClick: () => navigate('/dna/lab/community')
    }
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-purple-900/10 to-blue-900/10">
        {/* Header */}
        <div className="border-b border-crd-blue/20 bg-crd-darkest/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  🧬 DNA Lab Control Center
                </h1>
                <p className="text-crd-mutedText">Advanced Administration & Analytics</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  <Search className="h-4 w-4 mr-2" />
                  Global Search
                </Button>
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={loading ? '...' : dashboardData.users.total.toLocaleString()}
              change={`+${dashboardData.users.growth}%`}
              icon={Users}
            />
            <StatCard
              title="Cards Created"
              value={loading ? '...' : dashboardData.cards.total.toLocaleString()}
              change={`+${dashboardData.cards.growth}%`}
              icon={Palette}
            />
            <StatCard
              title="Revenue (30d)"
              value={loading ? '...' : `$${dashboardData.revenue.total.toLocaleString()}`}
              change={`+${dashboardData.revenue.growth}%`}
              icon={DollarSign}
            />
            <StatCard
              title="Activity (30d)"
              value={loading ? '...' : dashboardData.activity.total.toLocaleString()}
              change={`+${dashboardData.activity.growth}%`}
              icon={Activity}
            />
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <h3 className="text-lg font-semibold text-crd-lightText mb-4">User Growth (7 days)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="users" stroke="#06B6D4" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <h3 className="text-lg font-semibold text-crd-lightText mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="revenue" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Card Distribution */}
          <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
            <h3 className="text-lg font-semibold text-crd-lightText mb-4">Card Rarity Distribution</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.cardTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    dataKey="value"
                  >
                    {chartData.cardTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col justify-center space-y-4">
                {chartData.cardTypes.map((type, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-crd-lightText">{type.name}</span>
                    <span className="text-crd-mutedText ml-auto">{type.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div>
            <h2 className="text-xl font-semibold text-crd-lightText mb-6">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <QuickActionCard key={index} {...action} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <h3 className="text-lg font-semibold text-crd-lightText mb-4">Recent System Activity</h3>
              <div className="space-y-3">
                {[
                  { time: '2 min ago', event: 'New user registered', type: 'success' },
                  { time: '5 min ago', event: 'Content flagged for review', type: 'warning' },
                  { time: '12 min ago', event: 'Feature flag updated', type: 'info' },
                  { time: '23 min ago', event: 'Payout processed', type: 'success' },
                  { time: '1 hour ago', event: 'Database backup completed', type: 'info' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-crd-darkest/50">
                    <div>
                      <p className="text-sm text-crd-lightText">{activity.event}</p>
                      <p className="text-xs text-crd-mutedText">{activity.time}</p>
                    </div>
                    <Badge 
                      variant={activity.type === 'success' ? 'default' : activity.type === 'warning' ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <h3 className="text-lg font-semibold text-crd-lightText mb-4">System Alerts</h3>
              <div className="space-y-3">
                {[
                  { severity: 'high', message: 'Unusual login patterns detected', action: 'Review Security' },
                  { severity: 'medium', message: 'Storage usage at 78%', action: 'Monitor' },
                  { severity: 'low', message: 'Scheduled maintenance in 2 days', action: 'Prepare' }
                ].map((alert, index) => (
                  <div key={index} className="p-3 rounded-lg bg-crd-darkest/50 border-l-4 border-crd-danger/60">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-crd-lightText">{alert.message}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {alert.severity} priority
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">
                        {alert.action}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}