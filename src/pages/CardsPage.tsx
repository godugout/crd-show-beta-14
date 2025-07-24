
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Plus } from 'lucide-react';

const CardsPage = () => {
  return (
    <div className="min-h-screen bg-crd-darkest">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-crd-white mb-2">My Cards</h1>
            <p className="text-crd-lightGray">Create and manage your trading cards</p>
          </div>
          <CRDButton asChild variant="primary">
            <Link to="/create">
              <Plus className="w-4 h-4 mr-2" />
              Create Card
            </Link>
          </CRDButton>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-crd-darker rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-crd-mediumGray/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-crd-lightGray" />
          </div>
          <h3 className="text-xl font-semibold text-crd-white mb-2">No cards yet</h3>
          <p className="text-crd-lightGray mb-6">
            Start creating your first card to see it here
          </p>
          <CRDButton asChild variant="primary">
            <Link to="/create">
              Create Your First Card
            </Link>
          </CRDButton>
        </div>
      </div>
    </div>
  );
};

export default CardsPage;
