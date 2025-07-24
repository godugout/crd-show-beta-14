
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, CreditCard, Bookmark, Settings, LogOut } from "lucide-react";

export const ProfileDropdown = () => {
  const { user, signOut } = useAuth();

  if (!user) {
    return null;
  }

  // The auth user object has different properties than our custom User type
  const displayName = user.user_metadata?.full_name || user.email || 'User';
  const avatarUrl = user.user_metadata?.avatar_url || '';
  
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
        className="w-56 bg-card/95 backdrop-blur-xl border border-border/30 shadow-xl" 
        align="end" 
        sideOffset={5}
      >
        <DropdownMenuLabel className="text-foreground">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer min-h-[44px]">
          <Link to="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer min-h-[44px]">
          <Link to="/cards" className="flex items-center">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>My Cards</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer min-h-[44px]">
          <Link to="/collections" className="flex items-center">
            <Bookmark className="mr-2 h-4 w-4" />
            <span>Collections</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-border/50" />
        <DropdownMenuItem asChild className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer min-h-[44px]">
          <Link to="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-foreground hover:bg-accent/50 focus:bg-accent/50 cursor-pointer min-h-[44px]" 
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
