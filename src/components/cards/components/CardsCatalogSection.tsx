
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { UnifiedCardCatalog } from '@/components/catalog/UnifiedCardCatalog';

export const CardsCatalogSection: React.FC = () => {
  return (
    <Card className="bg-crd-dark border-crd-mediumGray">
      <CardContent className="p-6">
        <UnifiedCardCatalog />
      </CardContent>
    </Card>
  );
};
