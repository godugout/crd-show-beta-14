import React from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = [
  { label: 'HOME', href: '/', active: false },
  { label: 'EXPLORE', href: '/explore', active: false },
  { label: 'CREATE', href: '/create', active: false },
  { label: 'MARKETPLACE', href: '/marketplace', active: false },
  { label: 'COLLECTIONS', href: '/collections', active: false },
];

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path || 
           (path === '/collections' && location.pathname.startsWith('/collections'));
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[280px] bg-[#141416] border-l border-[hsl(var(--theme-navbar-border)/0.2)] z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[hsl(var(--theme-navbar-border)/0.2)]">
          <h2 className="text-lg font-semibold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-6">
          <ul className="space-y-4">
            {navigationItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "block py-3 px-4 text-base font-semibold uppercase tracking-wide rounded-lg transition-all duration-200 min-h-[44px] flex items-center",
                    isActive(item.href)
                      ? "text-crd-orange bg-crd-orange/10 border border-crd-orange/20"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Auth Section */}
        <div className="p-6 border-t border-[hsl(var(--theme-navbar-border)/0.2)] mt-auto">
          {user ? (
            <div className="space-y-3">
              <div className="text-sm text-gray-400">
                Signed in as {user.email}
              </div>
              <Link
                to="/profile"
                onClick={onClose}
                className="block w-full py-3 px-4 text-center bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors min-h-[44px] flex items-center justify-center"
              >
                Profile
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              onClick={onClose}
              className="block w-full py-3 px-4 text-center bg-crd-orange text-white rounded-lg hover:bg-crd-orange/90 transition-colors font-medium min-h-[44px] flex items-center justify-center"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
};