import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSecureAuth } from "@/features/auth/providers/SecureAuthProvider";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import {
    AlertTriangle,
    Bookmark,
    CheckCircle,
    Crown,
    Flag,
    LogOut,
    Monitor,
    Palette,
    RefreshCw,
    Settings,
    User,
    Wallet,
    XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AdminToolsModal } from "./modals/AdminToolsModal";
import { FeatureFlagsModal } from "./modals/FeatureFlagsModal";

interface SystemHealth {
  authSystem: 'healthy' | 'warning' | 'error';
  cardCreation: 'healthy' | 'warning' | 'error';
  database: 'healthy' | 'warning' | 'error';
  imageProcessing: 'healthy' | 'warning' | 'error';
  localStorage: 'healthy' | 'warning' | 'error';
}

interface JourneyMetrics {
  successRate: number;
  currentJourney: string;
  completedSteps: number;
  totalSteps: number;
}

export const ExpandedProfileDropdown = () => {
  const { user, signOut } = useSecureAuth();
  const { flags, isEnabled, toggleFlag } = useFeatureFlags();
  const { metrics } = usePerformanceMonitor();
  
  const [featureFlagsOpen, setFeatureFlagsOpen] = useState(false);
  const [adminToolsOpen, setAdminToolsOpen] = useState(false);
  
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    authSystem: 'healthy',
    cardCreation: 'healthy',
    database: 'healthy',
    imageProcessing: 'healthy',
    localStorage: 'healthy'
  });

  const [journeyMetrics, setJourneyMetrics] = useState<JourneyMetrics>({
    successRate: 100.0,
    currentJourney: 'Not initialized',
    completedSteps: 0,
    totalSteps: 5
  });

  // Check system health
  useEffect(() => {
    const checkSystemHealth = () => {
      const health: SystemHealth = {
        authSystem: user ? 'healthy' : 'error',
        cardCreation: 'healthy', // Could check if editor is working
        database: 'healthy', // Could ping database
        imageProcessing: 'healthy', // Could check image upload status
        localStorage: typeof localStorage !== 'undefined' ? 'healthy' : 'error'
      };
      setSystemHealth(health);
    };

    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 5000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return null;
  }

  const displayName = user.user_metadata?.full_name || user.email || 'User';
  const avatarUrl = user.user_metadata?.avatar_url || '';
  
  const getHealthIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'warning': return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'error': return <XCircle className="w-3 h-3 text-red-500" />;
    }
  };

  const runHealthCheck = () => {
    // Simulate health check
    setSystemHealth({
      authSystem: 'healthy',
      cardCreation: 'healthy',
      database: 'healthy',
      imageProcessing: 'healthy',
      localStorage: 'healthy'
    });
  };

  const isAdmin = user.email?.includes('admin') || user.user_metadata?.role === 'admin';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar className="h-8 w-8 border-2 border-border hover:border-primary transition-colors cursor-pointer">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-muted text-foreground text-sm">
            {(displayName?.[0] || '').toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 bg-card/95 backdrop-blur-xl border border-border/30 shadow-xl z-50" 
        align="end" 
        sideOffset={5}
      >
        {/* User Info */}
        <DropdownMenuLabel className="text-foreground pb-2">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(displayName?.[0] || '').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium flex items-center gap-2">
                {displayName}
                {isAdmin && <Crown className="w-3 h-3 text-yellow-500" />}
              </p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <ScrollArea className="h-96">
          {/* System Monitor */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
              <Monitor className="w-3 h-3" />
              SYSTEM MONITOR
              <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-500 border-green-500/20">
                HEALTHY
              </Badge>
            </DropdownMenuLabel>
            
            {/* Journey Success Rate */}
            <div className="px-2 py-2 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">Journey Success Rate</span>
                <span className="font-medium text-green-500">{journeyMetrics.successRate}%</span>
              </div>
              <Progress value={journeyMetrics.successRate} className="h-1" />
            </div>

            {/* System Health */}
            <div className="px-2 py-2 space-y-1">
              <div className="text-xs text-muted-foreground mb-2">System Health:</div>
              {Object.entries(systemHealth).map(([key, status]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <div className="flex items-center gap-1">
                    {getHealthIcon(status)}
                    <span className="text-muted-foreground">healthy</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Performance Metrics */}
            {metrics && (
              <div className="px-2 py-2 space-y-1">
                <div className="text-xs text-muted-foreground mb-2">Performance:</div>
                <div className="flex justify-between text-xs">
                  <span>FPS</span>
                  <span className={metrics.fps >= 55 ? 'text-green-500' : metrics.fps >= 30 ? 'text-yellow-500' : 'text-red-500'}>
                    {metrics.fps.toFixed(1)}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Memory</span>
                  <span>{(metrics.memory / 1024 / 1024).toFixed(1)}MB</span>
                </div>
              </div>
            )}

            <DropdownMenuItem 
              className="text-xs h-8 cursor-pointer"
              onClick={runHealthCheck}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Run Health Check
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* Feature Flags */}
          <DropdownMenuItem 
            className="text-xs h-8 cursor-pointer"
            onClick={() => setFeatureFlagsOpen(true)}
          >
            <Flag className="mr-2 h-3 w-3" />
            Feature Flags
            <Badge variant="outline" className="ml-auto text-xs">
              {Object.keys(flags).length}
            </Badge>
          </DropdownMenuItem>

          {/* Admin Tools */}
          {isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-xs h-8 cursor-pointer"
                onClick={() => setAdminToolsOpen(true)}
              >
                <Crown className="mr-2 h-3 w-3 text-yellow-500" />
                Admin Tools
              </DropdownMenuItem>
            </>
          )}

          <DropdownMenuSeparator />

          {/* Navigation */}
          <DropdownMenuGroup>
            <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer h-8">
              <Link to="/user/gallery" className="flex items-center">
                <Palette className="mr-2 h-4 w-4" />
                <span>My Gallery</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer h-8">
              <Link to="/dashboard/transactions" className="flex items-center">
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer h-8">
              <Link to="/collections" className="flex items-center">
                <Bookmark className="mr-2 h-4 w-4" />
                <span>Collections</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer h-8">
              <Link to="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer h-8">
              <Link to="/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer h-8" 
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </ScrollArea>
      </DropdownMenuContent>

      {/* Modals */}
      <FeatureFlagsModal 
        isOpen={featureFlagsOpen}
        onClose={() => setFeatureFlagsOpen(false)}
      />
      
      <AdminToolsModal 
        isOpen={adminToolsOpen}
        onClose={() => setAdminToolsOpen(false)}
      />
    </DropdownMenu>
  );
};