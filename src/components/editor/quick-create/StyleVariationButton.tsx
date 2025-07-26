import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StyleVariationButtonProps {
  variation: {
    id: 'epic' | 'classic' | 'futuristic';
    name: string;
    icon: LucideIcon;
    gradient: string;
  };
  isActive: boolean;
  isLoading: boolean;
  onClick: () => void;
}

export const StyleVariationButton: React.FC<StyleVariationButtonProps> = ({
  variation,
  isActive,
  isLoading,
  onClick
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onClick();
  };

  const Icon = variation.icon;

  return (
    <motion.button
      className={`
        relative w-12 h-12 rounded-xl p-2 border-2 transition-all duration-200 ease-out
        ${isActive 
          ? `bg-gradient-to-br ${variation.gradient} border-white/30 shadow-lg shadow-primary/20` 
          : 'bg-card/50 border-border hover:border-primary/30 backdrop-blur-sm'
        }
        ${isLoading ? 'pointer-events-none' : 'cursor-pointer'}
      `}
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ 
        scale: isActive ? 1.05 : 1.02,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isActive ? 1.05 : 1,
        rotate: isClicked ? [0, -5, 5, 0] : 0
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Loading shimmer effect */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: [-100, 100] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      )}

      {/* Active glow effect */}
      {isActive && (
        <motion.div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${variation.gradient} opacity-20 blur-md`}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      )}

      {/* Icon */}
      <motion.div
        className="relative z-10 w-full h-full flex items-center justify-center"
        animate={{ 
          rotate: isLoading ? 360 : 0 
        }}
        transition={{ 
          duration: isLoading ? 1 : 0, 
          repeat: isLoading ? Infinity : 0,
          ease: "linear"
        }}
      >
        <Icon 
          size={20} 
          className={`
            ${isActive ? 'text-white' : 'text-muted-foreground hover:text-primary'}
            transition-colors duration-200
          `}
        />
      </motion.div>

      {/* Click ripple effect */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 rounded-xl border-2 border-white/50"
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
};