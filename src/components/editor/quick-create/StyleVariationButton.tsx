import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StyleVariationButtonProps {
  variation: {
    id: 'epic' | 'classic' | 'futuristic';
    name: string;
    icon: LucideIcon;
    gradient: string;
    primaryColor: string;
  };
  isActive: boolean;
  isLoading: boolean;
  onHover: (id: 'epic' | 'classic' | 'futuristic') => void;
  onHoverEnd: () => void;
  onClick: () => void;
  isPreviewMode?: boolean;
}

export const StyleVariationButton: React.FC<StyleVariationButtonProps> = ({
  variation,
  isActive,
  isLoading,
  onHover,
  onHoverEnd,
  onClick,
  isPreviewMode
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
    onHover(variation.id);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    onHoverEnd();
  };

  const handleClick = () => {
    onClick();
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const Icon = variation.icon;

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden rounded-xl p-3 w-12 h-12",
        "transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
        isActive && "ring-2 ring-offset-2 ring-offset-background shadow-lg"
      )}
      style={{
        background: variation.gradient,
        boxShadow: isActive ? `0 8px 32px ${variation.primaryColor}40` : undefined
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      disabled={isLoading}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        scale: isPressed ? 0.95 : 1,
        filter: isLoading ? 'brightness(0.7)' : 'brightness(1)'
      }}
    >
      {/* Preview indicator overlay */}
      <AnimatePresence>
        {isHovering && !isActive && !isLoading && (
          <motion.div
            className="absolute inset-0 bg-white/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Loading shimmer effect */}
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      )}

      {/* Icon with glow effect */}
      <div className={cn(
        "relative z-10 flex items-center justify-center",
        isActive && "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
      )}>
        <Icon 
          size={20}
          className={cn(
            "text-white transition-all duration-200",
            isHovering && "scale-110",
            isActive && "animate-pulse"
          )}
        />
      </div>

      {/* Active indicator dot */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-sm"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        )}
      </AnimatePresence>

      {/* Preview mode indicator */}
      {isPreviewMode && isHovering && (
        <motion.div
          className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}

      {/* Ripple effect on click */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-xl"
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 1.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};