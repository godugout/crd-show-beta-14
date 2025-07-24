import React from 'react';

interface SparkleTextProps {
  children: React.ReactNode;
  className?: string;
}

export const SparkleText: React.FC<SparkleTextProps> = ({ children, className = '' }) => {
  return (
    <span className={`sparkle-container ${className}`}>
      <span className="animate-gradient-flow font-bold">
        {children}
      </span>
      {/* Sparkle elements */}
      <span className="sparkle" />
      <span className="sparkle sparkle-large" />
      <span className="sparkle" />
      <span className="sparkle sparkle-large" />
      <span className="sparkle" />
      <span className="sparkle" />
      <span className="sparkle sparkle-large" />
      <span className="sparkle" />
    </span>
  );
};