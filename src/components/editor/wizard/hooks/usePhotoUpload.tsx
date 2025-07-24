
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { unifiedCardAnalyzer, UnifiedAnalysisResult } from '@/services/imageAnalysis/unifiedCardAnalyzer';

interface ImageDetails {
  dimensions: { width: number; height: number };
  aspectRatio: number;
  fileSize: string;
}

export const usePhotoUpload = (
  onPhotoSelect: (photo: string) => void,
  onAnalysisComplete?: (analysis: UnifiedAnalysisResult) => void
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [imageDetails, setImageDetails] = useState<ImageDetails | null>(null);

  const processImageForCard = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = document.createElement('img');
      
      img.onload = () => {
        // Standard trading card aspect ratio is 2.5:3.5 (roughly 0.714)
        const targetAspectRatio = 2.5 / 3.5;
        const sourceAspectRatio = img.width / img.height;
        
        // Set canvas to optimal card dimensions (300x420 pixels for good quality)
        canvas.width = 300;
        canvas.height = 420;
        
        // Clear canvas with white background
        ctx!.fillStyle = '#ffffff';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (sourceAspectRatio > targetAspectRatio) {
          // Image is wider - fit to height and center horizontally
          drawHeight = canvas.height;
          drawWidth = drawHeight * sourceAspectRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller - fit to width and center vertically
          drawWidth = canvas.width;
          drawHeight = drawWidth / sourceAspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }
        
        // Draw the image centered and fitted
        ctx!.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        // Store image details
        setImageDetails({
          dimensions: { width: img.width, height: img.height },
          aspectRatio: sourceAspectRatio,
          fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
        
        resolve(dataUrl);
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const handlePhotoAnalysis = useCallback(async (imageDataUrl: string) => {
    if (!onAnalysisComplete) return;
    
    setIsAnalyzing(true);
    try {
      toast.info('Running comprehensive card analysis...', { icon: <Sparkles className="w-4 h-4" /> });
      const analysis = await unifiedCardAnalyzer.analyzeCard(imageDataUrl);
      onAnalysisComplete(analysis);
      
      if (analysis.confidence > 0.7) {
        toast.success(`High confidence analysis complete! Found: ${analysis.title}`);
      } else if (analysis.confidence > 0.4) {
        toast.success('Analysis complete with moderate confidence. Please review the details.');
      } else {
        toast.info('Analysis complete but low confidence. Manual entry recommended.');
      }
    } catch (error) {
      console.error('Enhanced analysis failed:', error);
      toast.error('Analysis failed, but you can still fill details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete]);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      toast.info('Processing image for card format...');
      const processedImageUrl = await processImageForCard(file);
      onPhotoSelect(processedImageUrl);
      toast.success('Photo processed and ready for analysis!');
      
      // Trigger enhanced AI analysis
      await handlePhotoAnalysis(processedImageUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    }
  }, [processImageForCard, onPhotoSelect, handlePhotoAnalysis]);

  return {
    isAnalyzing,
    imageDetails,
    handleFileUpload,
  };
};
