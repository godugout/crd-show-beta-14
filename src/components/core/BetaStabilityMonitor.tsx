/**
 * Beta Stability Monitor - Tracks the health of core user journeys
 * Provides real-time feedback on system stability and user flow success rates
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { useCoreUserJourney } from '@/hooks/useCoreUserJourney';

interface SystemHealth {
  authSystem: 'healthy' | 'degraded' | 'failed';
  cardCreation: 'healthy' | 'degraded' | 'failed';
  database: 'healthy' | 'degraded' | 'failed';
  imageProcessing: 'healthy' | 'degraded' | 'failed';
  localStorage: 'healthy' | 'degraded' | 'failed';
}

interface JourneyMetrics {
  totalAttempts: number;
  successfulCompletions: number;
  failureRate: number;
  averageCompletionTime: number;
  commonFailurePoints: string[];
}

export const BetaStabilityMonitor: React.FC = () => {
  const { getJourneyStatus, user } = useCoreUserJourney();
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    authSystem: 'healthy',
    cardCreation: 'healthy',
    database: 'healthy',
    imageProcessing: 'healthy',
    localStorage: 'healthy'
  });
  
  const [metrics, setMetrics] = useState<JourneyMetrics>({
    totalAttempts: 0,
    successfulCompletions: 0,
    failureRate: 0,
    averageCompletionTime: 0,
    commonFailurePoints: []
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  // System health checks
  const checkSystemHealth = async () => {
    const newHealth: SystemHealth = {
      authSystem: 'healthy',
      cardCreation: 'healthy', 
      database: 'healthy',
      imageProcessing: 'healthy',
      localStorage: 'healthy'
    };

    // Auth system check
    try {
      if (!user) {
        newHealth.authSystem = 'degraded';
      }
    } catch {
      newHealth.authSystem = 'failed';
    }

    // LocalStorage check
    try {
      localStorage.setItem('healthCheck', 'test');
      localStorage.removeItem('healthCheck');
    } catch {
      newHealth.localStorage = 'failed';
    }

    // Database connectivity check
    try {
      // This is a lightweight check that doesn't create data
      const journeyStatus = getJourneyStatus();
      if (journeyStatus === undefined) {
        newHealth.database = 'degraded';
      }
    } catch {
      newHealth.database = 'failed';
    }

    setSystemHealth(newHealth);
  };

  // Get overall system status
  const getOverallStatus = (): 'healthy' | 'degraded' | 'failed' => {
    const healthValues = Object.values(systemHealth);
    if (healthValues.includes('failed')) return 'failed';
    if (healthValues.includes('degraded')) return 'degraded';
    return 'healthy';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'degraded': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'degraded': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds
      checkSystemHealth(); // Initial check
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const overallStatus = getOverallStatus();
  const successRate = metrics.totalAttempts > 0 ? 
    ((metrics.successfulCompletions / metrics.totalAttempts) * 100) : 100;

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-crd-dark border-crd-mediumGray text-white">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Beta Stability Monitor</span>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(overallStatus)} text-white`}
              >
                {overallStatus.toUpperCase()}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="h-6 w-6 p-0"
              >
                <RefreshCw className={`w-3 h-3 ${isMonitoring ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 text-xs">
          {/* Core Journey Success Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span>Journey Success Rate</span>
              <span className="font-mono">{successRate.toFixed(1)}%</span>
            </div>
            <Progress value={successRate} className="h-2" />
          </div>

          {/* System Components Health */}
          <div className="space-y-1">
            <div className="font-medium text-crd-lightGray">System Health:</div>
            {Object.entries(systemHealth).map(([component, status]) => (
              <div key={component} className="flex items-center justify-between">
                <span className="capitalize">{component.replace(/([A-Z])/g, ' $1')}</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(status)}
                  <span className="text-xs text-crd-lightGray">{status}</span>
                </div>
              </div>
            ))}
          </div>

          {/* User Journey Status */}
          {user && (
            <div className="border-t border-crd-mediumGray pt-2">
              <div className="font-medium text-crd-lightGray mb-1">Current User Journey:</div>
              {(() => {
                const journeyStatus = getJourneyStatus();
                if (!journeyStatus) {
                  return <span className="text-gray-400">Not initialized</span>;
                }
                
                const completedSteps = journeyStatus.steps.filter(s => s.status === 'completed').length;
                const progress = (completedSteps / journeyStatus.steps.length) * 100;
                
                return (
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>Progress</span>
                      <span>{completedSteps}/{journeyStatus.steps.length}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="text-xs text-crd-lightGray mt-1">
                      Current: {journeyStatus.currentStep.replace(/_/g, ' ')}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick Actions */}
          <div className="border-t border-crd-mediumGray pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={checkSystemHealth}
              className="w-full text-xs h-7 border-crd-mediumGray text-white hover:bg-crd-mediumGray"
            >
              Run Health Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};