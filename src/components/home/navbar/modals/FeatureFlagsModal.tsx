import React from "react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Flag } from "lucide-react";

interface FeatureFlagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureFlagsModal: React.FC<FeatureFlagsModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { flags, toggleFlag } = useFeatureFlags();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-xl border border-border/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Flag className="w-5 h-5" />
            Feature Flags
            <Badge variant="outline" className="ml-auto">
              {Object.keys(flags).length} flags
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-96">
          <div className="space-y-4 p-2">
            {Object.entries(flags).map(([key, flag]) => (
              <div 
                key={key} 
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="font-medium text-sm text-foreground">{flag.name}</div>
                  <div className="text-sm text-muted-foreground">{flag.description || key}</div>
                  <div className="text-xs text-muted-foreground">Key: {key}</div>
                </div>
                <Switch
                  checked={flag.enabled}
                  onCheckedChange={() => toggleFlag(key)}
                  className="ml-4"
                />
              </div>
            ))}
            {Object.keys(flags).length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Flag className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No feature flags available</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};