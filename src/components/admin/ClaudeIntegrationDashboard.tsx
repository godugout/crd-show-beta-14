import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Activity,
    Bot,
    Code,
    Database,
    GitBranch,
    Palette,
    Play,
    RefreshCw,
    Settings,
    TestTube,
    TrendingUp,
    Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface SubagentStatus {
  name: string;
  status: 'active' | 'inactive' | 'error';
  lastUsed: Date;
  usageCount: number;
  description: string;
  icon: React.ReactNode;
}

interface ClaudeMetrics {
  totalCommits: number;
  averageProcessingTime: number;
  errorCount: number;
  lastCommitTime: Date;
  isMonitoring: boolean;
}

export const ClaudeIntegrationDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<ClaudeMetrics>({
    totalCommits: 0,
    averageProcessingTime: 0,
    errorCount: 0,
    lastCommitTime: new Date(),
    isMonitoring: false
  });

  const [subagents] = useState<SubagentStatus[]>([
    {
      name: 'React/TypeScript Reviewer',
      status: 'active',
      lastUsed: new Date(),
      usageCount: 15,
      description: 'Reviews React components and TypeScript code for best practices',
      icon: <Code className="w-5 h-5" />
    },
    {
      name: 'Supabase Database Specialist',
      status: 'active',
      lastUsed: new Date(Date.now() - 300000), // 5 minutes ago
      usageCount: 8,
      description: 'Manages database schemas and Supabase configurations',
      icon: <Database className="w-5 h-5" />
    },
    {
      name: 'UI/UX Component Specialist',
      status: 'active',
      lastUsed: new Date(Date.now() - 600000), // 10 minutes ago
      usageCount: 12,
      description: 'Optimizes component design and user experience',
      icon: <Palette className="w-5 h-5" />
    },
    {
      name: 'Performance Build Optimizer',
      status: 'inactive',
      lastUsed: new Date(Date.now() - 3600000), // 1 hour ago
      usageCount: 5,
      description: 'Optimizes build performance and bundle size',
      icon: <TrendingUp className="w-5 h-5" />
    },
    {
      name: 'Testing QA Specialist',
      status: 'error',
      lastUsed: new Date(Date.now() - 7200000), // 2 hours ago
      usageCount: 3,
      description: 'Ensures code quality through testing and QA processes',
      icon: <TestTube className="w-5 h-5" />
    }
  ]);

  const [activeTab, setActiveTab] = useState('overview');

  // Simulate metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalCommits: prev.totalCommits + Math.floor(Math.random() * 2),
        averageProcessingTime: Math.max(100, prev.averageProcessingTime + (Math.random() - 0.5) * 50),
        isMonitoring: true
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">
              Claude Code Integration Dashboard
            </h1>
            <p className="text-crd-lightGray">
              Monitor and manage your Claude Code integration and subagents
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`border-crd-green/30 ${metrics.isMonitoring ? 'text-crd-green' : 'text-crd-lightGray'}`}
            >
              <Bot className="w-3 h-3 mr-1" />
              {metrics.isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-crd-darker/50">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="subagents">Subagents</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Auto-Commit Status */}
              <Card className="bg-crd-darker/90 border-crd-mediumGray/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-crd-white flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-crd-green" />
                    Auto-Commit Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Status</span>
                    <Badge variant="outline" className="border-crd-green/30 text-crd-green">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Total Commits</span>
                    <span className="text-crd-white font-semibold">{metrics.totalCommits}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Avg Processing</span>
                    <span className="text-crd-white font-semibold">{Math.round(metrics.averageProcessingTime)}ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Errors</span>
                    <span className="text-crd-white font-semibold">{metrics.errorCount}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Subagents Overview */}
              <Card className="bg-crd-darker/90 border-crd-mediumGray/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-crd-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-crd-green" />
                    Subagents
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Active</span>
                    <span className="text-crd-white font-semibold">
                      {subagents.filter(s => s.status === 'active').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Inactive</span>
                    <span className="text-crd-white font-semibold">
                      {subagents.filter(s => s.status === 'inactive').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Errors</span>
                    <span className="text-crd-white font-semibold">
                      {subagents.filter(s => s.status === 'error').length}
                    </span>
                  </div>
                  <Progress 
                    value={(subagents.filter(s => s.status === 'active').length / subagents.length) * 100} 
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card className="bg-crd-darker/90 border-crd-mediumGray/40">
                <CardHeader className="pb-4">
                  <CardTitle className="text-crd-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-crd-green" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">CPU Usage</span>
                    <span className="text-crd-white font-semibold">23%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Memory</span>
                    <span className="text-crd-white font-semibold">156MB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Response Time</span>
                    <span className="text-crd-white font-semibold">45ms</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-crd-lightGray">Uptime</span>
                    <span className="text-crd-white font-semibold">2h 34m</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Subagents Tab */}
          <TabsContent value="subagents" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {subagents.map((subagent, index) => (
                <Card key={index} className="bg-crd-darker/90 border-crd-mediumGray/40">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-crd-white flex items-center gap-2">
                        {subagent.icon}
                        {subagent.name}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(subagent.status)} text-white`}
                      >
                        {getStatusText(subagent.status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-crd-lightGray text-sm">{subagent.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-crd-lightGray">Usage Count</span>
                      <span className="text-crd-white font-semibold">{subagent.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-crd-lightGray">Last Used</span>
                      <span className="text-crd-white font-semibold">
                        {subagent.lastUsed.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Play className="w-3 h-3 mr-1" />
                        Activate
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="w-3 h-3 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-6">
            <Card className="bg-crd-darker/90 border-crd-mediumGray/40">
              <CardHeader>
                <CardTitle className="text-crd-white">Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-crd-white font-semibold mb-4">Commit Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Today</span>
                        <span className="text-crd-white font-semibold">12 commits</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">This Week</span>
                        <span className="text-crd-white font-semibold">47 commits</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">This Month</span>
                        <span className="text-crd-white font-semibold">156 commits</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-crd-white font-semibold mb-4">Error Tracking</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">TypeScript Errors</span>
                        <span className="text-crd-white font-semibold">0</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">ESLint Warnings</span>
                        <span className="text-crd-white font-semibold">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Build Failures</span>
                        <span className="text-crd-white font-semibold">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-crd-darker/90 border-crd-mediumGray/40">
              <CardHeader>
                <CardTitle className="text-crd-white">Claude Code Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-crd-white font-semibold">Auto-Commit Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Enable Auto-Commit</span>
                        <Button size="sm" variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Commit Interval</span>
                        <span className="text-crd-white font-semibold">30s</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Validation</span>
                        <span className="text-crd-white font-semibold">Strict</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-crd-white font-semibold">Subagent Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Auto-Activate</span>
                        <Button size="sm" variant="outline">Enabled</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Max Concurrent</span>
                        <span className="text-crd-white font-semibold">3</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-crd-lightGray">Timeout</span>
                        <span className="text-crd-white font-semibold">30s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}; 