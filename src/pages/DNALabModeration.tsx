import React, { useState } from 'react';
import { AdminRoute } from '@/features/admin/components/AdminRoute';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  Flag,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Eye,
  MessageSquare,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockReports = [
  {
    id: '1',
    type: 'card',
    contentId: 'card_123',
    contentTitle: 'Inappropriate Character Card',
    reportReason: 'Explicit content',
    reportedBy: 'user_456',
    reportedAt: '2024-01-15T10:30:00Z',
    status: 'pending',
    aiConfidence: 0.87,
    category: 'nsfw'
  },
  {
    id: '2',
    type: 'comment',
    contentId: 'comment_789',
    contentTitle: 'Harassment in comments',
    reportReason: 'Toxic behavior',
    reportedBy: 'user_234',
    reportedAt: '2024-01-15T09:15:00Z',
    status: 'pending',
    aiConfidence: 0.92,
    category: 'harassment'
  }
];

const mockAutoFlags = [
  {
    id: 'af_1',
    contentType: 'card',
    contentId: 'card_567',
    flagReason: 'Potential copyright violation',
    aiConfidence: 0.95,
    flaggedAt: '2024-01-15T11:45:00Z',
    status: 'pending'
  },
  {
    id: 'af_2',
    contentType: 'image',
    contentId: 'img_890',
    flagReason: 'NSFW content detected',
    aiConfidence: 0.89,
    flaggedAt: '2024-01-15T11:30:00Z',
    status: 'pending'
  }
];

const StatusBadge = ({ status }) => {
  const variants = {
    pending: { variant: 'secondary', color: 'text-yellow-400' },
    approved: { variant: 'default', color: 'text-green-400' },
    rejected: { variant: 'destructive', color: 'text-red-400' },
    escalated: { variant: 'outline', color: 'text-orange-400' }
  };
  
  const config = variants[status] || variants.pending;
  
  return (
    <Badge variant={config.variant} className={config.color}>
      {status}
    </Badge>
  );
};

const ConfidenceBar = ({ confidence }) => {
  const percentage = Math.round(confidence * 100);
  const color = confidence > 0.8 ? 'bg-red-500' : confidence > 0.6 ? 'bg-yellow-500' : 'bg-green-500';
  
  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-2 bg-crd-darkest rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-crd-mutedText">{percentage}%</span>
    </div>
  );
};

export default function DNALabModeration() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reports');

  const handleApprove = (id) => {
    console.log('Approving:', id);
  };

  const handleReject = (id) => {
    console.log('Rejecting:', id);
  };

  const handleEscalate = (id) => {
    console.log('Escalating:', id);
  };

  return (
    <AdminRoute requiredPermission="content_moderation">
      <div className="min-h-screen bg-gradient-to-br from-crd-darkest via-purple-900/10 to-blue-900/10">
        {/* Header */}
        <div className="border-b border-crd-blue/20 bg-crd-darkest/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/dna/lab/dashboard')}
                  className="text-crd-lightGray hover:text-crd-lightText"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    🛡️ Content Moderation
                  </h1>
                  <p className="text-crd-mutedText">Review and moderate user-generated content</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  Moderation Settings
                </Button>
                <Button variant="outline" size="sm" className="border-crd-blue/30">
                  AI Config
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Pending Reports</p>
                  <p className="text-2xl font-bold text-crd-lightText">23</p>
                  <p className="text-xs text-yellow-400 mt-1">Requires attention</p>
                </div>
                <Flag className="h-8 w-8 text-yellow-400/60" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Auto-Flagged</p>
                  <p className="text-2xl font-bold text-crd-lightText">12</p>
                  <p className="text-xs text-red-400 mt-1">AI detected issues</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400/60" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Resolved Today</p>
                  <p className="text-2xl font-bold text-crd-lightText">47</p>
                  <p className="text-xs text-green-400 mt-1">+15% from yesterday</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400/60" />
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-crd-mutedText">Response Time</p>
                  <p className="text-2xl font-bold text-crd-lightText">1.2h</p>
                  <p className="text-xs text-crd-lightGray mt-1">Average</p>
                </div>
                <Shield className="h-8 w-8 text-crd-blue/60" />
              </div>
            </Card>
          </div>

          {/* Moderation Queue */}
          <Card className="bg-gradient-to-br from-crd-dark to-crd-darker border-crd-blue/20">
            <div className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-crd-darkest">
                  <TabsTrigger value="reports" className="data-[state=active]:bg-crd-blue">
                    User Reports ({mockReports.length})
                  </TabsTrigger>
                  <TabsTrigger value="auto-flags" className="data-[state=active]:bg-crd-blue">
                    AI Flags ({mockAutoFlags.length})
                  </TabsTrigger>
                  <TabsTrigger value="escalated" className="data-[state=active]:bg-crd-blue">
                    Escalated (3)
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="reports" className="mt-6">
                  <div className="space-y-4">
                    {mockReports.map((report) => (
                      <Card key={report.id} className="p-4 bg-crd-darkest/50 border-crd-blue/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="flex items-center space-x-2">
                                {report.type === 'card' ? (
                                  <ImageIcon className="h-4 w-4 text-crd-blue" />
                                ) : (
                                  <MessageSquare className="h-4 w-4 text-crd-blue" />
                                )}
                                <span className="text-sm font-medium text-crd-lightText">
                                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                </span>
                              </div>
                              <StatusBadge status={report.status} />
                              <Badge variant="outline" className="text-xs">
                                {report.category}
                              </Badge>
                            </div>
                            
                            <h3 className="font-semibold text-crd-lightText mb-1">
                              {report.contentTitle}
                            </h3>
                            <p className="text-sm text-crd-mutedText mb-2">
                              Reason: {report.reportReason}
                            </p>
                            <p className="text-xs text-crd-mutedText">
                              Reported by {report.reportedBy} • {new Date(report.reportedAt).toLocaleDateString()}
                            </p>
                            
                            <div className="mt-3">
                              <p className="text-xs text-crd-mutedText mb-1">AI Confidence:</p>
                              <ConfidenceBar confidence={report.aiConfidence} />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApprove(report.id)}
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleReject(report.id)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEscalate(report.id)}
                              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                            >
                              Escalate
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="auto-flags" className="mt-6">
                  <div className="space-y-4">
                    {mockAutoFlags.map((flag) => (
                      <Card key={flag.id} className="p-4 bg-crd-darkest/50 border-crd-blue/10">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <AlertTriangle className="h-4 w-4 text-orange-400" />
                              <span className="text-sm font-medium text-crd-lightText">
                                Auto-detected: {flag.contentType}
                              </span>
                              <StatusBadge status={flag.status} />
                            </div>
                            
                            <h3 className="font-semibold text-crd-lightText mb-1">
                              {flag.flagReason}
                            </h3>
                            <p className="text-xs text-crd-mutedText mb-3">
                              Content ID: {flag.contentId} • Flagged {new Date(flag.flaggedAt).toLocaleDateString()}
                            </p>
                            
                            <div className="mt-3">
                              <p className="text-xs text-crd-mutedText mb-1">AI Confidence:</p>
                              <ConfidenceBar confidence={flag.aiConfidence} />
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-4">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-green-500/30 text-green-400 hover:bg-green-500/10"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              False Positive
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Confirm Flag
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="escalated" className="mt-6">
                  <div className="text-center py-12">
                    <Shield className="h-16 w-16 text-crd-mutedText mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-crd-lightText mb-2">No Escalated Cases</h3>
                    <p className="text-crd-mutedText">Complex moderation cases will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </Card>
        </div>
      </div>
    </AdminRoute>
  );
}