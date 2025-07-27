import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePSDProcessingWorker } from '@/hooks/usePSDProcessingWorker';
import {
    AlertCircle,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    Eye,
    FileImage,
    RefreshCw,
    Trash2
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface PSDJob {
  id: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  step: string;
  createdAt: string;
  updatedAt: string;
  layers?: any[];
  frames?: any[];
}

export const PSDJobHistory: React.FC = () => {
  const { getUserJobs, deleteJob } = usePSDProcessingWorker();
  const [jobs, setJobs] = useState<PSDJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<PSDJob | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const userJobs = await getUserJobs();
      setJobs(userJobs);
    } catch (error) {
      console.error('Failed to load jobs:', error);
      toast.error('Failed to load processing history');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      const success = await deleteJob(jobId);
      if (success) {
        setJobs(prev => prev.filter(job => job.id !== jobId));
        toast.success('Job deleted successfully');
      } else {
        toast.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  const handleViewJob = (job: PSDJob) => {
    setSelectedJob(job);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderJobCard = (job: PSDJob) => (
    <Card 
      key={job.id}
      className="bg-crd-darker border-crd-mediumGray/30 hover:bg-crd-mediumGray/20 transition-colors"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(job.status)}
              <h3 className="text-crd-white font-medium truncate">{job.fileName}</h3>
              <Badge variant="outline" className={getStatusColor(job.status)}>
                {job.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4 text-sm text-crd-lightGray">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(job.createdAt)}</span>
                </div>
                {job.layers && (
                  <div className="flex items-center gap-1">
                    <FileImage className="w-3 h-3" />
                    <span>{job.layers.length} layers</span>
                  </div>
                )}
                {job.frames && (
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{job.frames.length} frames</span>
                  </div>
                )}
              </div>

              {job.status === 'processing' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-crd-lightGray">{job.step}</span>
                    <span className="text-crd-white">{job.progress}%</span>
                  </div>
                  <Progress value={job.progress} className="h-1" />
                </div>
              )}

              {job.status === 'completed' && job.step && (
                <p className="text-sm text-crd-lightGray">{job.step}</p>
              )}

              {job.status === 'failed' && job.step && (
                <p className="text-sm text-red-400">{job.step}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 ml-4">
            {job.status === 'completed' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleViewJob(job)}
                className="text-crd-blue hover:text-crd-lightBlue"
              >
                <Eye className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteJob(job.id)}
              className="text-crd-lightGray hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderJobDetails = (job: PSDJob) => (
    <Card className="bg-crd-darker border-crd-mediumGray/30">
      <CardHeader>
        <CardTitle className="text-crd-white flex items-center justify-between">
          <span>Job Details: {job.fileName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedJob(null)}
            className="text-crd-lightGray hover:text-crd-white"
          >
            ×
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-crd-lightGray">Status:</span>
            <div className="flex items-center gap-2 mt-1">
              {getStatusIcon(job.status)}
              <span className="text-crd-white capitalize">{job.status}</span>
            </div>
          </div>
          <div>
            <span className="text-crd-lightGray">Created:</span>
            <p className="text-crd-white mt-1">{formatDate(job.createdAt)}</p>
          </div>
          {job.layers && (
            <div>
              <span className="text-crd-lightGray">Layers:</span>
              <p className="text-crd-white mt-1">{job.layers.length} extracted</p>
            </div>
          )}
          {job.frames && (
            <div>
              <span className="text-crd-lightGray">Frames:</span>
              <p className="text-crd-white mt-1">{job.frames.length} generated</p>
            </div>
          )}
        </div>

        {job.layers && job.layers.length > 0 && (
          <div>
            <h4 className="text-crd-white font-medium mb-2">Layers</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {job.layers.slice(0, 6).map((layer: any, index: number) => (
                <div key={index} className="bg-crd-darkGray p-2 rounded text-xs">
                  <div className="w-8 h-8 bg-crd-mediumGray/30 rounded mb-1 flex items-center justify-center">
                    <FileImage className="w-4 h-4 text-crd-mediumGray" />
                  </div>
                  <p className="text-crd-white truncate">{layer.name}</p>
                </div>
              ))}
              {job.layers.length > 6 && (
                <div className="bg-crd-darkGray p-2 rounded text-xs flex items-center justify-center">
                  <span className="text-crd-lightGray">+{job.layers.length - 6} more</span>
                </div>
              )}
            </div>
          </div>
        )}

        {job.frames && job.frames.length > 0 && (
          <div>
            <h4 className="text-crd-white font-medium mb-2">Generated Frames</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {job.frames.map((frame: any, index: number) => (
                <div key={index} className="bg-crd-darkGray p-2 rounded text-xs">
                  <div className="w-8 h-8 bg-gradient-to-br from-crd-blue to-crd-purple rounded mb-1 flex items-center justify-center">
                    <Download className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-crd-white truncate">{frame.name}</p>
                  <p className="text-crd-lightGray text-xs capitalize">{frame.rarity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="text-center py-8">
        <RefreshCw className="w-8 h-8 text-crd-blue animate-spin mx-auto mb-4" />
        <p className="text-crd-lightGray">Loading processing history...</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-8">
        <FileImage className="w-16 h-16 text-crd-mediumGray mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-crd-white mb-2">No Processing History</h3>
        <p className="text-crd-lightGray mb-4">
          You haven't processed any PSD files yet. Start by uploading a PSD file to convert it to CRD templates.
        </p>
        <Button 
          onClick={() => window.location.href = '/crdmkr'}
          className="bg-crd-blue hover:bg-crd-lightBlue text-white"
        >
          <FileImage className="w-4 h-4 mr-2" />
          Start Processing PSD Files
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-crd-white">Processing History</h2>
          <p className="text-crd-lightGray">View and manage your PSD processing jobs</p>
        </div>
        <Button
          onClick={loadJobs}
          variant="outline"
          className="border-crd-mediumGray text-crd-white hover:bg-crd-mediumGray"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {selectedJob ? (
        <div className="space-y-4">
          <Button
            onClick={() => setSelectedJob(null)}
            variant="ghost"
            className="text-crd-lightGray hover:text-crd-white"
          >
            ← Back to History
          </Button>
          {renderJobDetails(selectedJob)}
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(renderJobCard)}
        </div>
      )}
    </div>
  );
}; 