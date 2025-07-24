
import React, { useState } from 'react';
import { CRDButton } from '@/components/ui/design-system/Button';
import { Database, Loader2 } from 'lucide-react';
import { seedDatabaseWithSampleCards } from '@/utils/seedDatabase';
import { toast } from 'sonner';

interface DatabaseSeedPromptProps {
  onSeedComplete: () => void;
}

export const DatabaseSeedPrompt: React.FC<DatabaseSeedPromptProps> = ({ onSeedComplete }) => {
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    try {
      await seedDatabaseWithSampleCards();
      toast.success('Database seeded with sample cards');
      onSeedComplete();
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error('Failed to seed database');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-crd-darkest flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <Database className="w-24 h-24 text-crd-mediumGray mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-crd-white mb-2">
            No Cards Found
          </h1>
          <p className="text-crd-lightGray mb-6">
            Your database appears to be empty. Would you like to add some sample cards to get started?
          </p>
        </div>

        <CRDButton
          variant="primary"
          onClick={handleSeedDatabase}
          disabled={isSeeding}
          className="w-full"
        >
          {isSeeding ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="w-4 h-4 mr-2" />
              Seed Sample Cards
            </>
          )}
        </CRDButton>
      </div>
    </div>
  );
};
