import React, { useState } from 'react';
import { CRDDNABrowser } from '@/components/crd/CRDDNABrowser';
import { SampleCardGenerator } from '@/components/crd/SampleCardGenerator';
import { DNABlendingSimulator } from '@/components/crd/DNABlendingSimulator';
import { GamingAttributesPlayground } from '@/components/crd/GamingAttributesPlayground';
import { CollectionPreview } from '@/components/crd/CollectionPreview';
import { CRDEntry } from '@/lib/cardshowDNA';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DNATestPage: React.FC = () => {
  const [selectedDNA, setSelectedDNA] = useState<CRDEntry[]>([]);
  const [activeTab, setActiveTab] = useState('browser');

  const handleDNASelect = (entry: CRDEntry) => {
    setSelectedDNA(prev => {
      const isAlreadySelected = prev.find(dna => dna.id === entry.id);
      if (isAlreadySelected) {
        return prev.filter(dna => dna.id !== entry.id);
      }
      return [...prev, entry];
    });
  };

  const clearSelection = () => {
    setSelectedDNA([]);
  };

  return (
    <div className="min-h-screen bg-[#141416] pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-[#FCFCFD] mb-4">
              CRD:DNA Testing Laboratory
            </h1>
            <p className="text-[#E6E8EC] text-lg">
              Experiment with DNA segments, blending, gaming attributes, and card generation
            </p>
            {selectedDNA.length > 0 && (
              <div className="mt-4 flex items-center justify-center gap-4">
                <span className="text-[#FCFCFD] font-medium">
                  Selected DNA: {selectedDNA.length}
                </span>
                <button
                  onClick={clearSelection}
                  className="text-[#3772FF] hover:text-[#2D9CDB] text-sm underline transition-colors duration-200"
                >
                  Clear Selection
                </button>
              </div>
            )}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-[#1A1D24] border-[#353945]">
              <TabsTrigger value="browser">DNA Browser</TabsTrigger>
              <TabsTrigger value="generator">Card Generator</TabsTrigger>
              <TabsTrigger value="blending">DNA Blending</TabsTrigger>
              <TabsTrigger value="gaming">Gaming Attributes</TabsTrigger>
              <TabsTrigger value="collection">Collection Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="browser" className="space-y-6">
              <Card className="bg-[#1A1D24] border-[#353945] rounded-2xl hover:bg-[#23262F] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-[#FCFCFD]">DNA Segment Browser</CardTitle>
                  <CardDescription className="text-[#E6E8EC]">
                    Browse and select DNA segments to experiment with. Click entries to add them to your selection.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CRDDNABrowser
                    onEntrySelect={handleDNASelect}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="generator" className="space-y-6">
              <SampleCardGenerator selectedDNA={selectedDNA} />
            </TabsContent>

            <TabsContent value="blending" className="space-y-6">
              <DNABlendingSimulator selectedDNA={selectedDNA} />
            </TabsContent>

            <TabsContent value="gaming" className="space-y-6">
              <GamingAttributesPlayground selectedDNA={selectedDNA} />
            </TabsContent>

            <TabsContent value="collection" className="space-y-6">
              <CollectionPreview selectedDNA={selectedDNA} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DNATestPage;