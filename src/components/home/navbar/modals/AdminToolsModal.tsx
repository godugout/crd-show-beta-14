import React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Crown,
  Database, 
  User, 
  Activity, 
  Bug,
  Code,
  Shield,
  Settings,
  Zap
} from "lucide-react";

interface AdminToolsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminToolsModal: React.FC<AdminToolsModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const adminTools = [
    {
      title: "DNA Manager",
      description: "Manage CRD DNA templates and themes",
      href: "/dna/manager",
      icon: Database,
      color: "text-blue-500"
    },
    {
      title: "User Management",
      description: "Manage users, roles, and permissions",
      href: "/admin/users",
      icon: User,
      color: "text-green-500"
    },
    {
      title: "Analytics Dashboard",
      description: "View system analytics and metrics",
      href: "/admin/analytics",
      icon: Activity,
      color: "text-purple-500"
    },
    {
      title: "System Settings",
      description: "Configure global system settings",
      href: "/admin/settings",
      icon: Settings,
      color: "text-orange-500"
    },
    {
      title: "Debug Console",
      description: "Debug tools and error tracking",
      href: "/admin/debug",
      icon: Bug,
      color: "text-red-500"
    },
    {
      title: "Performance Monitor",
      description: "Real-time performance monitoring",
      href: "/admin/performance",
      icon: Zap,
      color: "text-yellow-500"
    }
  ];

  const handleToolClick = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-card/95 backdrop-blur-xl border border-border/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Crown className="w-5 h-5 text-yellow-500" />
            Admin Tools
            <Badge variant="outline" className="ml-auto bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              Administrator
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
          {adminTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.href}
                variant="outline"
                className="h-auto p-4 text-left justify-start hover:bg-accent/50 border border-border bg-card/50"
                asChild
                onClick={handleToolClick}
              >
                <Link to={tool.href} className="block w-full">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-1 ${tool.color}`} />
                    <div className="flex-1 space-y-1">
                      <div className="font-medium text-foreground">{tool.title}</div>
                      <div className="text-sm text-muted-foreground">{tool.description}</div>
                    </div>
                  </div>
                </Link>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Administrator Access</span>
          </div>
          <p className="text-xs text-muted-foreground">
            These tools provide administrative access to system configuration and management. 
            Use responsibly and ensure proper backup procedures are in place.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};