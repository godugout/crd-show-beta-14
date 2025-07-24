import React from 'react';
import { AdminRoute } from '@/features/admin/components/AdminRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
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
  Zap
} from 'lucide-react';

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
              value="47,392"
              change="+12.5%"
              icon={Users}
            />
            <StatCard
              title="Cards Created"
              value="1,284,567"
              change="+8.3%"
              icon={Palette}
            />
            <StatCard
              title="Revenue (30d)"
              value="$89,432"
              change="+15.7%"
              icon={DollarSign}
            />
            <StatCard
              title="System Health"
              value="99.8%"
              change="+0.1%"
              icon={Activity}
            />
          </div>

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