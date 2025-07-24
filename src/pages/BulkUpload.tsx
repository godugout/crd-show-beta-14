import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRDButton } from '@/components/ui/design-system/Button';
import { CRDCard } from '@/components/ui/design-system/Card';
import { Progress } from '@/components/ui/progress';
import { Upload, X, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { toast } from 'sonner';
import { analyzeCardImage } from '@/services/cardAnalyzer';
import { CardRepository } from '@/repositories/cardRepository';
import { useAuth } from '@/features/auth/providers/AuthProvider';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  analysis?: any;
  error?: string;
}

const BulkUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: `${Date.now()}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
        status: 'pending'
      }));
      
      setUploadedFiles(prev => [...prev, ...newFiles]);
      toast.success(`Added ${acceptedFiles.length} images for processing`);
    }
  });

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return updated;
    });
  };

  const processImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Standard card dimensions
        canvas.width = 350;
        canvas.height = 490;
        
        // Fill with white background
        ctx!.fillStyle = '#ffffff';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        
        // Calculate dimensions to fit image
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;
        
        ctx!.drawImage(img, x, y, img.width * scale, img.height * scale);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const processAllFiles = async () => {
    if (!user) {
      toast.error('You must be logged in to create cards');
      return;
    }

    console.log('🚀 Starting bulk upload process for user:', user.id);
    setIsProcessing(true);
    setProgress(0);
    
    const pendingFiles = uploadedFiles.filter(f => f.status === 'pending');
    console.log(`📊 Processing ${pendingFiles.length} files`);
    let completed = 0;

    for (const fileData of pendingFiles) {
      try {
        console.log(`🔄 Processing file: ${fileData.file.name}`);
        
        // Update status to analyzing
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'analyzing' } : f
        ));

        // Convert image to data URL
        console.log('🖼️ Converting image to data URL...');
        const imageDataUrl = await processImageToDataUrl(fileData.file);
        
        // Analyze with AI
        console.log('🤖 Analyzing image with AI...');
        const analysis = await analyzeCardImage(imageDataUrl);
        console.log('📋 AI Analysis result:', analysis);
        
        // Prepare card data with proper validation
        const cardData = {
          title: analysis.title || `Card ${Date.now()}`,
          description: analysis.description || 'A unique trading card.',
          creator_id: user.id,
          image_url: imageDataUrl,
          thumbnail_url: imageDataUrl,
          rarity: analysis.rarity || 'common', // Let the repository handle mapping
          tags: analysis.tags || ['custom'],
          design_metadata: {
            aiGenerated: true,
            originalFilename: fileData.file.name,
            analysis: analysis
          },
          visibility: 'public', // Use string, let repository handle mapping
          is_public: true,
          series: analysis.series || 'AI Collection'
        };

        console.log('💾 Creating card with data:', cardData);
        
        // Create card in database
        const cardResult = await CardRepository.createCard(cardData);

        if (cardResult) {
          console.log('✅ Successfully created card:', cardResult.id);
          // Update status to complete
          setUploadedFiles(prev => prev.map(f => 
            f.id === fileData.id ? { 
              ...f, 
              status: 'complete', 
              analysis: { ...analysis, cardId: cardResult.id }
            } : f
          ));
        } else {
          throw new Error('Failed to create card in database - CardRepository returned null');
        }

      } catch (error) {
        console.error('❌ Error processing file:', fileData.file.name, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileData.id ? { 
            ...f, 
            status: 'error', 
            error: errorMessage
          } : f
        ));
      }

      completed++;
      setProgress((completed / pendingFiles.length) * 100);
    }

    setIsProcessing(false);
    
    const successCount = uploadedFiles.filter(f => f.status === 'complete').length;
    const errorCount = uploadedFiles.filter(f => f.status === 'error').length;
    
    console.log(`📊 Upload complete: ${successCount} successful, ${errorCount} failed`);
    
    if (successCount > 0) {
      toast.success(`Successfully created ${successCount} cards!`);
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} cards failed to process. Check console for details.`);
    }
  };

  const viewInGallery = () => {
    navigate('/gallery');
  };

  const completedCount = uploadedFiles.filter(f => f.status === 'complete').length;
  const errorCount = uploadedFiles.filter(f => f.status === 'error').length;
  const pendingCount = uploadedFiles.filter(f => f.status === 'pending').length;

  return (
    <div className="min-h-screen bg-crd-darkest">
      {/* Header */}
      <div className="bg-crd-darker border-b border-crd-mediumGray/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-crd-white">Bulk Card Upload</h1>
          <CRDButton
            onClick={() => navigate('/gallery')}
            variant="outline"
            className="border-crd-mediumGray/20 text-crd-white hover:bg-crd-mediumGray hover:text-crd-white"
          >
            View Gallery
          </CRDButton>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        {uploadedFiles.length === 0 && (
          <CRDCard className="bg-crd-darker border-crd-mediumGray/20 p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
                isDragActive 
                  ? 'border-crd-green bg-crd-green/10' 
                  : 'border-crd-mediumGray hover:border-crd-green/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 text-crd-lightGray mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-crd-white mb-2">
                {isDragActive ? 'Drop images here' : 'Upload Card Images'}
              </h3>
              <p className="text-crd-lightGray text-lg">
                Drag and drop multiple images, or click to browse
              </p>
              <p className="text-crd-lightGray text-sm mt-2">
                AI will automatically analyze and create cards with metadata
              </p>
            </div>
          </CRDCard>
        )}

        {/* File Grid */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex items-center justify-between bg-crd-darker rounded-lg p-4 border border-crd-mediumGray/20">
              <div className="flex items-center gap-4">
                <span className="text-crd-white font-medium">
                  {uploadedFiles.length} images uploaded
                </span>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">{completedCount} completed</span>
                  <span className="text-yellow-400">{pendingCount} pending</span>
                  {errorCount > 0 && <span className="text-red-400">{errorCount} errors</span>}
                </div>
              </div>
              
              <div className="flex gap-3">
                <CRDButton
                  onClick={processAllFiles}
                  disabled={isProcessing || pendingCount === 0}
                  variant="primary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Processing...' : `Create ${pendingCount} Cards`}
                </CRDButton>
                
                {completedCount > 0 && (
                  <CRDButton
                    onClick={viewInGallery}
                    variant="outline"
                    className="border-crd-mediumGray/20 text-crd-white hover:bg-crd-mediumGray hover:text-crd-white"
                  >
                    View in Gallery
                  </CRDButton>
                )}
              </div>
            </div>

            {/* Progress */}
            {isProcessing && (
              <div className="bg-crd-darker rounded-lg p-4 border border-crd-mediumGray/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-crd-white">Processing cards...</span>
                  <span className="text-crd-lightGray">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {/* Files Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {uploadedFiles.map((fileData) => (
                <CRDCard key={fileData.id} className="bg-crd-darker border-crd-mediumGray/20 overflow-hidden">
                  <div className="relative">
                    <img
                      src={fileData.preview}
                      alt="Upload preview"
                      className="w-full aspect-[3/4] object-cover"
                    />
                    
                    {/* Status Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      {fileData.status === 'pending' && (
                        <CRDButton
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFile(fileData.id)}
                          className="absolute top-2 right-2 text-crd-white hover:bg-red-500"
                        >
                          <X className="w-4 h-4" />
                        </CRDButton>
                      )}
                      
                      {fileData.status === 'analyzing' && (
                        <div className="text-center">
                          <Sparkles className="w-8 h-8 text-crd-green animate-pulse mx-auto mb-2" />
                          <span className="text-crd-white text-sm">Analyzing...</span>
                        </div>
                      )}
                      
                      {fileData.status === 'complete' && (
                        <div className="text-center">
                          <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                          <span className="text-crd-white text-sm">Complete</span>
                        </div>
                      )}
                      
                      {fileData.status === 'error' && (
                        <div className="text-center">
                          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                          <span className="text-crd-white text-sm">Error</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* File Info */}
                  <div className="p-3">
                    <p className="text-crd-white text-sm font-medium truncate">
                      {fileData.file.name}
                    </p>
                    <p className="text-crd-lightGray text-xs">
                      {(fileData.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    
                    {fileData.analysis && (
                      <div className="mt-2 text-xs">
                        <p className="text-crd-green font-medium truncate">
                          {fileData.analysis.title}
                        </p>
                        <p className="text-crd-lightGray">
                          {fileData.analysis.rarity}
                        </p>
                      </div>
                    )}
                    
                    {fileData.error && (
                      <p className="text-red-400 text-xs mt-2" title={fileData.error}>
                        {fileData.error.length > 50 ? fileData.error.substring(0, 50) + '...' : fileData.error}
                      </p>
                    )}
                  </div>
                </CRDCard>
              ))}
            </div>

            {/* Add More Button */}
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-crd-mediumGray rounded-xl p-6 text-center cursor-pointer hover:border-crd-green/50 transition-colors"
            >
              <input {...getInputProps()} />
              <Upload className="w-8 h-8 text-crd-lightGray mx-auto mb-2" />
              <p className="text-crd-lightGray">Add more images</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
