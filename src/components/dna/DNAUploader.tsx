import React, { useState, useCallback } from 'react';
import { Upload, FileImage, X, Check, AlertCircle, Code2 } from 'lucide-react';
import { CRDCard, CRDButton } from '@/components/ui/design-system';
import { cn } from '@/lib/utils';

interface DNAFile {
  file: File;
  parsed: {
    group: string;
    teamCode: string;
    styleCode: string;
    fontStyle: 'Script' | 'Block';
    colorCode: string;
  } | null;
  preview: string;
  status: 'pending' | 'valid' | 'invalid';
  errors: string[];
}

// DNA filename parser
const parseDNAFilename = (filename: string): DNAFile['parsed'] => {
  try {
    const cleanName = filename.replace(/\.(png|jpg|jpeg|svg)$/i, '');
    const parts = cleanName.split('_');
    
    if (parts.length !== 4 || parts[0] !== 'CS') {
      return null;
    }
    
    const [, group, teamCode, styleCode] = parts;
    const fontStyle = styleCode.endsWith('S') ? 'Script' : 'Block';
    const colorCode = styleCode.slice(0, -1);
    
    return { group, teamCode, styleCode, fontStyle, colorCode };
  } catch {
    return null;
  }
};

interface DNAUploaderProps {
  onFilesProcessed?: (files: DNAFile[]) => void;
  maxFiles?: number;
}

export const DNAUploader: React.FC<DNAUploaderProps> = ({ 
  onFilesProcessed, 
  maxFiles = 50 
}) => {
  const [dnaFiles, setDnaFiles] = useState<DNAFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = useCallback(async (file: File): Promise<DNAFile> => {
    const preview = URL.createObjectURL(file);
    const parsed = parseDNAFilename(file.name);
    const errors: string[] = [];

    // Validation
    if (!parsed) {
      errors.push('Invalid filename format. Expected: CS_[GROUP]_[TEAM]_[STYLE].png');
    }

    if (!file.type.startsWith('image/')) {
      errors.push('File must be an image');
    }

    if (file.size > 5 * 1024 * 1024) {
      errors.push('File size must be less than 5MB');
    }

    const status = errors.length === 0 ? 'valid' : 'invalid';

    return {
      file,
      parsed,
      preview,
      status,
      errors
    };
  }, []);

  const handleFiles = useCallback(async (files: FileList) => {
    if (files.length + dnaFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    setIsProcessing(true);
    
    const newFiles: DNAFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const processedFile = await processFile(files[i]);
      newFiles.push(processedFile);
    }

    setDnaFiles(prev => [...prev, ...newFiles]);
    setIsProcessing(false);

    if (onFilesProcessed) {
      onFilesProcessed([...dnaFiles, ...newFiles]);
    }
  }, [dnaFiles, maxFiles, processFile, onFilesProcessed]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setDnaFiles(prev => {
      const newFiles = prev.filter((_, i) => i !== index);
      if (onFilesProcessed) {
        onFilesProcessed(newFiles);
      }
      return newFiles;
    });
  }, [onFilesProcessed]);

  const clearAll = useCallback(() => {
    dnaFiles.forEach(file => URL.revokeObjectURL(file.preview));
    setDnaFiles([]);
    if (onFilesProcessed) {
      onFilesProcessed([]);
    }
  }, [dnaFiles, onFilesProcessed]);

  const validFiles = dnaFiles.filter(f => f.status === 'valid');
  const invalidFiles = dnaFiles.filter(f => f.status === 'invalid');

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <CRDCard 
        className={cn(
          "border-2 border-dashed transition-all duration-300 p-8 text-center cursor-pointer",
          isDragOver 
            ? "border-crd-blue bg-crd-blue/5" 
            : "border-crd-mediumGray/50 hover:border-crd-blue/50"
        )}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          id="dna-upload"
        />
        
        <label htmlFor="dna-upload" className="cursor-pointer">
          <div className="space-y-4">
            <Upload 
              className={cn(
                "mx-auto transition-colors",
                isDragOver ? "text-crd-blue" : "text-crd-lightGray"
              )} 
              size={48} 
            />
            
            <div>
              <h3 className="text-xl font-semibold text-crd-white mb-2">
                Upload CRD:DNA Logo Files
              </h3>
              <p className="text-crd-lightGray mb-4">
                Drop files or click to browse. Follow the naming convention:
              </p>
              <code className="bg-crd-darkGray px-3 py-1 rounded text-crd-blue text-sm">
                CS_[GROUP]_[TEAM]_[STYLE].png
              </code>
            </div>
            
            <div className="text-sm text-crd-lightGray space-y-1">
              <p>• Accepted formats: PNG, JPG, SVG</p>
              <p>• Maximum file size: 5MB</p>
              <p>• Maximum files: {maxFiles}</p>
            </div>
          </div>
        </label>
      </CRDCard>

      {/* Processing Indicator */}
      {isProcessing && (
        <CRDCard className="p-4">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-crd-blue"></div>
            <span className="text-crd-white">Processing files...</span>
          </div>
        </CRDCard>
      )}

      {/* File Stats */}
      {dnaFiles.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-blue">{dnaFiles.length}</div>
            <div className="text-sm text-crd-lightGray">Total Files</div>
          </CRDCard>
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-green">{validFiles.length}</div>
            <div className="text-sm text-crd-lightGray">Valid</div>
          </CRDCard>
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-orange">{invalidFiles.length}</div>
            <div className="text-sm text-crd-lightGray">Invalid</div>
          </CRDCard>
          <CRDCard className="p-4 text-center">
            <div className="text-2xl font-bold text-crd-purple">
              {new Set(validFiles.map(f => f.parsed?.group)).size}
            </div>
            <div className="text-sm text-crd-lightGray">Groups</div>
          </CRDCard>
        </div>
      )}

      {/* File List */}
      {dnaFiles.length > 0 && (
        <CRDCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-crd-white">Uploaded Files</h3>
            <CRDButton variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </CRDButton>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dnaFiles.map((dnaFile, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-center space-x-4 p-3 rounded-lg border",
                  dnaFile.status === 'valid' 
                    ? "border-crd-green/30 bg-crd-green/5" 
                    : "border-crd-orange/30 bg-crd-orange/5"
                )}
              >
                {/* Preview */}
                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={dnaFile.preview} 
                    alt={dnaFile.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-crd-white truncate">
                      {dnaFile.file.name}
                    </span>
                    {dnaFile.status === 'valid' ? (
                      <Check className="text-crd-green flex-shrink-0" size={16} />
                    ) : (
                      <AlertCircle className="text-crd-orange flex-shrink-0" size={16} />
                    )}
                  </div>
                  
                  {dnaFile.parsed ? (
                    <div className="text-sm text-crd-lightGray">
                      {dnaFile.parsed.group} • {dnaFile.parsed.teamCode} • {dnaFile.parsed.styleCode} • {dnaFile.parsed.fontStyle}
                    </div>
                  ) : (
                    <div className="text-sm text-crd-orange">
                      {dnaFile.errors[0]}
                    </div>
                  )}
                  
                  {dnaFile.errors.length > 1 && (
                    <div className="text-xs text-crd-orange mt-1">
                      +{dnaFile.errors.length - 1} more error(s)
                    </div>
                  )}
                </div>
                
                {/* Size */}
                <div className="text-xs text-crd-lightGray flex-shrink-0">
                  {(dnaFile.file.size / 1024).toFixed(1)}KB
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="text-crd-lightGray hover:text-crd-white flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </CRDCard>
      )}

      {/* Instructions */}
      <CRDCard className="p-6 border border-crd-blue/20">
        <div className="flex items-start space-x-3">
          <Code2 className="text-crd-blue flex-shrink-0 mt-1" size={20} />
          <div>
            <h4 className="font-semibold text-crd-white mb-2">DNA Naming Convention</h4>
            <div className="text-sm text-crd-lightGray space-y-2">
              <p><strong>Format:</strong> CS_[GROUP]_[TEAM]_[STYLE].png</p>
              <p><strong>GROUP:</strong> MLB, NBA, NHL, NFL, UNI, SK, CL, ORIG, 3D, GRADIENT</p>
              <p><strong>TEAM:</strong> Team abbreviation (LAD, BOS, NYY, etc.)</p>
              <p><strong>STYLE:</strong> Color code (2 letters) + S (Script) or B (Block)</p>
              <div className="mt-3 space-y-1">
                <p><strong>Examples:</strong></p>
                <code className="block text-crd-blue">CS_MLB_LAD_BS.png</code>
                <code className="block text-crd-blue">CS_NBA_LAL_PGS.png</code>
                <code className="block text-crd-blue">CS_UNI_UCLA_BBS.png</code>
              </div>
            </div>
          </div>
        </div>
      </CRDCard>
    </div>
  );
};