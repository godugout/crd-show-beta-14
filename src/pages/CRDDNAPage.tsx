import React from 'react';
import { CRDDNABrowser } from '@/components/crd/CRDDNABrowser';
import { CRDEntry } from '@/lib/cardshowDNA';
import { useTeamTheme } from '@/hooks/useTeamTheme';
import { getPaletteByFileName } from '@/lib/teamPalettes';
import { toast } from 'sonner';

export const CRDDNAPage = () => {
  const { applyTheme } = useTeamTheme();

  const handleEntrySelect = (entry: CRDEntry) => {
    const palette = getPaletteByFileName(entry.fileName);
    if (palette) {
      applyTheme(palette);
      toast.success(`Applied ${entry.teamName || entry.styleCode} theme`);
    } else {
      toast.error('Theme not found for this entry');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <CRDDNABrowser onEntrySelect={handleEntrySelect} />
    </div>
  );
};