"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StarsBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  starCount?: number;
}

export function StarsBackground({
  children,
  className,
  starCount = 25
}: StarsBackgroundProps) {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  // Generate static star positions once
  const stars = React.useMemo(() => {
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      animationDelay: Math.random() * 2
    }));
  }, [starCount]);

  // Track mouse movement
  React.useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full h-full overflow-hidden bg-black",
        className
      )}
    >
      {/* Static Stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{
            opacity: [star.opacity, star.opacity * 0.3, star.opacity],
            x: mousePosition.x * 10 * star.size,
            y: mousePosition.y * 10 * star.size,
          }}
          transition={{
            opacity: {
              duration: 3,
              repeat: Infinity,
              delay: star.animationDelay,
              ease: "easeInOut",
            },
            x: {
              duration: 0.5,
              ease: "easeOut",
            },
            y: {
              duration: 0.5,
              ease: "easeOut",
            },
          }}
        />
      ))}
      
      {children}
    </div>
  );
}