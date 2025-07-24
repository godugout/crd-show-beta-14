import React from 'react';
import { getCRDEntryByFileName, CRDEntry } from '@/lib/cardshowDNA';

interface CRDLogoProps {
  fileName: string;
  className?: string;
  fallbackText?: string;
}

export const CRDLogo: React.FC<CRDLogoProps> = ({ 
  fileName, 
  className = "", 
  fallbackText 
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const entry = getCRDEntryByFileName(fileName);
  
  React.useEffect(() => {
    if (entry?.imagePath) {
      // Preload and validate image
      const img = new Image();
      img.onload = () => setIsLoading(false);
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      img.src = entry.imagePath;
    } else {
      setIsLoading(false);
      setHasError(true);
    }
  }, [entry?.imagePath]);
  
  // Entry not found in CRD:DNA database
  if (!entry) {
    return (
      <div className={`flex items-center justify-center bg-muted/50 border border-dashed border-muted-foreground/30 rounded-md ${className}`}>
        <span className="text-muted-foreground text-xs font-mono">
          {fallbackText || fileName}
        </span>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 rounded-md animate-pulse ${className}`}>
        <div className="w-4 h-4 bg-muted-foreground/20 rounded"></div>
      </div>
    );
  }

  // Error state with CRD:DNA fallback
  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-destructive/10 border border-dashed border-destructive/30 rounded-md text-destructive ${className}`}>
        <span className="text-xs font-mono text-center px-1">
          {entry.teamName || entry.styleCode || fallbackText || fileName}
        </span>
      </div>
    );
  }

  // Successful render with enhanced accessibility
  return (
    <div className="relative group">
      <img
        src={entry.imagePath}
        alt={`${entry.teamName || entry.styleCode} logo - ${entry.styleTag || 'Standard'} style`}
        className={className}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
      />
      {/* CRD:DNA metadata tooltip */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-popover border rounded-md px-2 py-1 text-xs text-popover-foreground shadow-lg whitespace-nowrap z-50">
          {fileName} • {entry.rarity} • Power: {entry.powerLevel}
        </div>
      </div>
    </div>
  );
};

// Specific MLB logo components
export const MLBLogo = ({ teamCode, style, className }: { 
  teamCode: string; 
  style?: string; 
  className?: string; 
}) => {
  // Find matching entry by team code and style
  const fileName = style 
    ? `CS_MLB_${teamCode}_${style}.png`
    : `CS_MLB_${teamCode}.png`;
  
  return <CRDLogo fileName={fileName} className={className} />;
};

// Classic decade logos
export const ClassicMLBLogo = ({ teamCode, decade, className }: {
  teamCode: string;
  decade: '70s' | '80s' | '00s';
  className?: string;
}) => {
  const fileName = `CS_MLB_CL_${teamCode}_${decade}.png`;
  return <CRDLogo fileName={fileName} className={className} />;
};

// Uniform style logos
export const UniformLogo = ({ styleCode, className }: {
  styleCode: string;
  className?: string;
}) => {
  const fileName = `CS_UNI_${styleCode}.png`;
  return <CRDLogo fileName={fileName} className={className} />;
};

// Sketch style logos  
export const SketchLogo = ({ styleCode, className }: {
  styleCode: string;
  className?: string;
}) => {
  const fileName = `CS_SK_${styleCode}.png`;
  return <CRDLogo fileName={fileName} className={className} />;
};

// Component to display CRD entry details
export const CRDEntryCard = ({ entry, className }: {
  entry: CRDEntry;
  className?: string;
}) => {
  return (
    <div className={`p-4 border border-border rounded-lg bg-card ${className}`}>
      <div className="flex items-center gap-4">
        <CRDLogo fileName={entry.fileName} className="w-16 h-16" />
        <div className="flex-1">
          <h3 className="font-semibold">
            {entry.teamName || entry.styleCode}
          </h3>
          {entry.teamCity && (
            <p className="text-sm text-muted-foreground">{entry.teamCity}</p>
          )}
          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              {entry.group}
            </span>
            {entry.styleTag && (
              <span className="text-xs bg-secondary/10 text-secondary-foreground px-2 py-1 rounded">
                {entry.styleTag}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};