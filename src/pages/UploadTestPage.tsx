import React from 'react';
import { UniversalUploadComponent } from '@/components/media/UniversalUploadComponent';

const UploadTestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-crd-darkest pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-crd-bright mb-4">
              Upload Test Page
            </h1>
            <p className="text-crd-light">
              Test all upload methods: drag & drop, browse, camera, and folder upload
            </p>
          </div>
          
          <div className="bg-crd-base border border-crd-border rounded-lg p-6">
            <UniversalUploadComponent
              onFilesSelected={(files) => {
                console.log('Files selected:', files);
                files.forEach(file => {
                  console.log(`- ${file.name} (${file.type}, ${file.size} bytes)`);
                });
              }}
              onError={(error) => {
                console.error('Upload error:', error);
              }}
              accept={{
                'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
                'video/*': ['.mp4', '.mov', '.avi'],
                'application/pdf': ['.pdf']
              }}
              maxSize={50 * 1024 * 1024} // 50MB
              maxFiles={10}
              multiple={true}
            />
          </div>
          
          <div className="mt-8 bg-crd-base border border-crd-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-crd-bright mb-4">Debug Information</h2>
            <div className="text-sm text-crd-light space-y-2">
              <p>• Check browser console for detailed logs</p>
              <p>• Drag files onto the drop zone</p>
              <p>• Click "Browse Files" to open file picker</p>
              <p>• Click "Camera" to take photos (mobile)</p>
              <p>• Click "Select Folder" to upload entire folders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadTestPage;