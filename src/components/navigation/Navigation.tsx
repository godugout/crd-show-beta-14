
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

const navigationItems = [
  { label: 'HOME', href: '/', active: false },
  { label: 'EXPLORE', href: '/explore', active: false },
  { label: 'CREATE', href: '/create', active: false },
  { label: 'MARKETPLACE', href: '/marketplace', active: false },
  { label: 'COLLECTIONS', href: '/collections', active: false },
];

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const location = useLocation();

  return (
    <nav className={cn("hidden lg:flex items-center gap-2 xl:gap-6", className)}>
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href || 
                        (item.href === '/collections' && location.pathname.startsWith('/collections'));
        
        return (
          <Link
            key={item.label}
            to={item.href}
            className={cn(
              "text-sm font-semibold uppercase tracking-normal px-2 xl:px-4 py-2 transition-colors duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
              isActive 
                ? "text-crd-orange" 
                : "text-zinc-400 hover:text-white"
            )}
          >
            <span className="hidden xl:inline">{item.label}</span>
            <span className="xl:hidden">{item.label.charAt(0)}</span>
          </Link>
        );
      })}
    </nav>
  );
};
