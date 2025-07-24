import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type CaseStyle = 'none' | 'penny-sleeve' | 'toploader' | 'magnetic' | 'graded';

interface StudioCaseSelectorProps {
  selectedCase: CaseStyle;
  onCaseChange: (caseStyle: CaseStyle) => void;
  className?: string;
}

export const getCaseStyles = (caseStyle: CaseStyle) => {
  switch (caseStyle) {
    case 'penny-sleeve':
      return {
        border: '1px solid hsl(var(--crd-mediumGray))',
        borderRadius: '8px',
        padding: '2px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
      };
    case 'toploader':
      return {
        border: '3px solid hsl(var(--crd-mediumGray))',
        borderRadius: '4px',
        padding: '4px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
      };
    case 'magnetic':
      return {
        border: '2px solid #22c55e',
        borderRadius: '6px',
        padding: '3px',
        boxShadow: '0 0 20px rgba(34, 197, 94, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
        background: 'linear-gradient(145deg, rgba(34, 197, 94, 0.05), transparent)'
      };
    case 'graded':
      return {
        border: '4px solid #000000',
        borderRadius: '2px',
        padding: '8px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4), 0 3px 6px rgba(0, 0, 0, 0.3)',
        position: 'relative' as const,
        '&::after': {
          content: '"PSA 10"',
          position: 'absolute',
          top: '-2px',
          right: '-2px',
          background: '#000000',
          color: '#ffffff',
          padding: '2px 6px',
          fontSize: '10px',
          fontWeight: 'bold',
          borderRadius: '0 0 0 4px'
        }
      };
    default:
      return {};
  }
};

const caseOptions = [
  { value: 'none', label: 'No Case', description: 'Raw card display' },
  { value: 'penny-sleeve', label: 'Penny Sleeve', description: 'Basic protection with subtle border' },
  { value: 'toploader', label: 'Toploader', description: 'Rigid case with thick border and shadow' },
  { value: 'magnetic', label: 'Magnetic Case', description: 'Premium case with green glow effect' },
  { value: 'graded', label: 'Graded Slab', description: 'Professional grading with black border' }
];

export const StudioCaseSelector: React.FC<StudioCaseSelectorProps> = ({
  selectedCase,
  onCaseChange,
  className = ''
}) => {
  return (
    <Card className={`bg-crd-dark/95 backdrop-blur-sm border-crd-mediumGray ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-crd-white text-sm">Card Case</CardTitle>
      </CardHeader>
      
      <CardContent>
        <Select value={selectedCase} onValueChange={(value: CaseStyle) => onCaseChange(value)}>
          <SelectTrigger className="bg-crd-darker border-crd-mediumGray text-crd-white">
            <SelectValue placeholder="Select case style" />
          </SelectTrigger>
          <SelectContent className="bg-crd-dark border-crd-mediumGray">
            {caseOptions.map((option) => (
              <SelectItem 
                key={option.value} 
                value={option.value}
                className="text-crd-white hover:bg-crd-mediumGray focus:bg-crd-mediumGray"
              >
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-crd-lightGray">{option.description}</div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};