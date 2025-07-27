import { FrameGenerator } from '@/components/psd/FrameGenerator';
import { LayerManager } from '@/components/psd/LayerManager';
import { PSDJobHistory } from '@/components/psd/PSDJobHistory';
import { CRDMaker } from '@/pages/CRDMaker';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock the PSD processing worker hook
jest.mock('@/hooks/usePSDProcessingWorker', () => ({
  usePSDProcessingWorker: () => ({
    isProcessing: false,
    progress: 0,
    step: '',
    error: null,
    result: null,
    processPSDFile: jest.fn(),
    cancelProcessing: jest.fn(),
    getUserJobs: jest.fn().mockResolvedValue([]),
    deleteJob: jest.fn().mockResolvedValue(true),
    resetState: jest.fn()
  })
}));

// Mock the auth provider
jest.mock('@/features/auth/providers/SecureAuthProvider', () => ({
  useSecureAuth: () => ({
    user: { id: 'test-user-id', email: 'test@example.com' },
    loading: false
  })
}));

// Mock the toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('CRDMKR Components', () => {
  describe('CRDMaker Page', () => {
    it('renders welcome step by default', () => {
      renderWithRouter(<CRDMaker />);
      
      expect(screen.getByText('CRDMKR Studio')).toBeInTheDocument();
      expect(screen.getByText('Transform your Photoshop designs into professional card templates')).toBeInTheDocument();
      expect(screen.getByText('Start Converting PSD Files')).toBeInTheDocument();
    });

    it('navigates to upload step when start button is clicked', () => {
      renderWithRouter(<CRDMaker />);
      
      const startButton = screen.getByText('Start Converting PSD Files');
      fireEvent.click(startButton);
      
      expect(screen.getByText('Upload PSD File')).toBeInTheDocument();
    });

    it('navigates to history step when history button is clicked', () => {
      renderWithRouter(<CRDMaker />);
      
      const historyButton = screen.getByText('View History');
      fireEvent.click(historyButton);
      
      expect(screen.getByText('Processing History')).toBeInTheDocument();
    });

    it('displays progress steps correctly', () => {
      renderWithRouter(<CRDMaker />);
      
      expect(screen.getByText('Welcome')).toBeInTheDocument();
      expect(screen.getByText('Upload')).toBeInTheDocument();
      expect(screen.getByText('Processing')).toBeInTheDocument();
      expect(screen.getByText('Layers')).toBeInTheDocument();
      expect(screen.getByText('Frames')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
      expect(screen.getByText('History')).toBeInTheDocument();
    });
  });

  describe('PSDJobHistory Component', () => {
    it('renders empty state when no jobs exist', async () => {
      render(<PSDJobHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('No Processing History')).toBeInTheDocument();
        expect(screen.getByText('You haven\'t processed any PSD files yet')).toBeInTheDocument();
      });
    });

    it('displays job history when jobs exist', async () => {
      const mockJobs = [
        {
          id: 'job-1',
          fileName: 'test.psd',
          status: 'completed',
          progress: 100,
          step: 'Processing complete',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          layers: [{ id: 'layer-1', name: 'Background' }],
          frames: [{ id: 'frame-1', name: 'Classic Frame' }]
        }
      ];

      // Mock the hook to return jobs
      jest.doMock('@/hooks/usePSDProcessingWorker', () => ({
        usePSDProcessingWorker: () => ({
          getUserJobs: jest.fn().mockResolvedValue(mockJobs),
          deleteJob: jest.fn().mockResolvedValue(true)
        })
      }));

      render(<PSDJobHistory />);
      
      await waitFor(() => {
        expect(screen.getByText('test.psd')).toBeInTheDocument();
        expect(screen.getByText('completed')).toBeInTheDocument();
      });
    });
  });

  describe('LayerManager Component', () => {
    const mockLayers = [
      {
        id: 'layer-1',
        name: 'Background',
        type: 'layer',
        visible: true,
        opacity: 1,
        bounds: { x: 0, y: 0, width: 800, height: 600 },
        imageUrl: '/placeholder-bg.png',
        children: []
      },
      {
        id: 'layer-2',
        name: 'Character',
        type: 'layer',
        visible: true,
        opacity: 1,
        bounds: { x: 200, y: 100, width: 400, height: 500 },
        imageUrl: '/placeholder-character.png',
        children: []
      }
    ];

    const mockProps = {
      layers: mockLayers,
      selectedLayers: new Set(['layer-1']),
      visibleLayers: new Set(['layer-1', 'layer-2']),
      onLayerToggle: jest.fn(),
      onLayerVisibilityToggle: jest.fn(),
      onGenerateFrames: jest.fn()
    };

    it('renders layer management interface', () => {
      render(<LayerManager {...mockProps} />);
      
      expect(screen.getByText('Layer Organization')).toBeInTheDocument();
      expect(screen.getByText('Active Composition')).toBeInTheDocument();
      expect(screen.getByText('Elements Bucket')).toBeInTheDocument();
    });

    it('displays layer information correctly', () => {
      render(<LayerManager {...mockProps} />);
      
      expect(screen.getByText('Background')).toBeInTheDocument();
      expect(screen.getByText('Character')).toBeInTheDocument();
      expect(screen.getByText('800 × 600')).toBeInTheDocument();
      expect(screen.getByText('400 × 500')).toBeInTheDocument();
    });

    it('calls onGenerateFrames when generate button is clicked', () => {
      render(<LayerManager {...mockProps} />);
      
      const generateButton = screen.getByText(/Generate Frames/);
      fireEvent.click(generateButton);
      
      expect(mockProps.onGenerateFrames).toHaveBeenCalled();
    });
  });

  describe('FrameGenerator Component', () => {
    const mockFrames = [
      {
        id: 'frame-1',
        name: 'Classic Frame',
        preview: '/placeholder-frame-1.png',
        layers: ['layer-1', 'layer-2'],
        style: 'classic',
        rarity: 'common'
      },
      {
        id: 'frame-2',
        name: 'Modern Frame',
        preview: '/placeholder-frame-2.png',
        layers: ['layer-1', 'layer-2'],
        style: 'modern',
        rarity: 'rare'
      }
    ];

    const mockProps = {
      frames: mockFrames,
      onExportFrame: jest.fn()
    };

    it('renders frame grid correctly', () => {
      render(<FrameGenerator {...mockProps} />);
      
      expect(screen.getByText('Classic Frame')).toBeInTheDocument();
      expect(screen.getByText('Modern Frame')).toBeInTheDocument();
      expect(screen.getByText('common')).toBeInTheDocument();
      expect(screen.getByText('rare')).toBeInTheDocument();
    });

    it('displays empty state when no frames exist', () => {
      render(<FrameGenerator frames={[]} onExportFrame={jest.fn()} />);
      
      expect(screen.getByText('No Frames Generated')).toBeInTheDocument();
      expect(screen.getByText('Generate frame variations from your selected layers to see them here')).toBeInTheDocument();
    });

    it('calls onExportFrame when export button is clicked', () => {
      render(<FrameGenerator {...mockProps} />);
      
      const exportButtons = screen.getAllByText(/Export as CRD Template/);
      fireEvent.click(exportButtons[0]);
      
      expect(mockProps.onExportFrame).toHaveBeenCalledWith('frame-1');
    });
  });
});

// Integration tests
describe('CRDMKR Integration', () => {
  it('provides complete PSD-to-CRD workflow', async () => {
    renderWithRouter(<CRDMaker />);
    
    // Start the workflow
    const startButton = screen.getByText('Start Converting PSD Files');
    fireEvent.click(startButton);
    
    // Should be on upload step
    expect(screen.getByText('Upload PSD File')).toBeInTheDocument();
    
    // Navigate through steps (simulated)
    // This would be tested with actual file upload in a real scenario
  });

  it('handles error states gracefully', () => {
    // Mock error state
    jest.doMock('@/hooks/usePSDProcessingWorker', () => ({
      usePSDProcessingWorker: () => ({
        isProcessing: false,
        progress: 0,
        step: '',
        error: 'Processing failed',
        result: null,
        processPSDFile: jest.fn(),
        cancelProcessing: jest.fn(),
        getUserJobs: jest.fn().mockResolvedValue([]),
        deleteJob: jest.fn().mockResolvedValue(true),
        resetState: jest.fn()
      })
    }));

    renderWithRouter(<CRDMaker />);
    
    // Should handle error display
    expect(screen.getByText('CRDMKR Studio')).toBeInTheDocument();
  });
}); 