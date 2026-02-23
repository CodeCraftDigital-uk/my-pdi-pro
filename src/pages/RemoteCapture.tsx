import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaptureRequests, useUpdateCaptureStatus } from '@/hooks/useCaptureRequest';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, ChevronLeft, Camera, ShieldAlert } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import CreateCaptureModal from '@/components/capture/CreateCaptureModal';
import CaptureRequestCard from '@/components/capture/CaptureRequestCard';
import CaptureReviewPanel from '@/components/capture/CaptureReviewPanel';
import autoprovIcon from '@/assets/autoprov_icon.png';
import type { CaptureRequest, CaptureStatus } from '@/types/capture';

const RemoteCapture = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CaptureRequest | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const { data: activeRequests = [], isLoading: loadingActive } = useCaptureRequests('pending');
  const { data: inProgressRequests = [] } = useCaptureRequests('in_progress');
  const { data: completedRequests = [], isLoading: loadingCompleted } = useCaptureRequests('completed');
  const { data: archivedRequests = [], isLoading: loadingArchived } = useCaptureRequests('archived');

  const allActive = [...activeRequests, ...inProgressRequests];

  if (selectedRequest) {
    return (
      <CaptureReviewPanel
        request={selectedRequest}
        onBack={() => setSelectedRequest(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Portal
          </button>
          <div className="flex-1" />
          <Button
            onClick={() => setShowCreateModal(true)}
            size="sm"
            className="gap-2"
            style={{ background: '#1e3a5f' }}
          >
            <Plus size={14} /> New Capture
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div
          className="rounded-2xl mb-8 px-6 py-6 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1a3558 0%, #1e3f6b 55%, #0f2240 100%)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)' }}
          >
            <Camera className="h-6 w-6" style={{ color: '#c9a227' }} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Remote Capture</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#c9a227' }}>
              Structured Vehicle Inspection & Media Capture
            </p>
          </div>
          <img src={autoprovIcon} alt="AutoProv" className="w-10 h-10 object-contain opacity-70 ml-auto hidden sm:block" />
        </div>

        {/* Security Disclaimer */}
        <Alert variant="destructive" className="mb-8 border-2 border-destructive bg-destructive/10">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-base font-bold">Security Notice — Unprotected Test Environment</AlertTitle>
          <AlertDescription className="mt-2 text-sm leading-relaxed">
            <p className="font-semibold mb-1">
              This platform is currently operating as a test environment without user authentication or access controls.
            </p>
            <p className="mb-2">
              All capture requests, uploaded media, and personal information (including names, email addresses, phone numbers, 
              vehicle registrations, and VIN numbers) stored within this system are accessible to any individual who accesses 
              this page. No login or identity verification is required to view, modify, or delete this data.
            </p>
            <p className="mb-2">
              <strong>To protect personal data and comply with data protection obligations, 
              you must download or print any completed reports immediately and then permanently delete the 
              capture request from this dashboard.</strong> Do not leave personal or sensitive information stored 
              in this system longer than is necessary for your immediate use.
            </p>
            <p className="text-xs opacity-80">
              By continuing to use this platform, you acknowledge that you do so at your own risk and accept full 
              responsibility for safeguarding any personal data you submit or process through this test environment. 
              The platform provider accepts no liability for any unauthorised access to, or disclosure of, data stored herein.
            </p>
          </AlertDescription>
        </Alert>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="active">Active ({allActive.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedRequests.length})</TabsTrigger>
            <TabsTrigger value="archived">Archived ({archivedRequests.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {allActive.length === 0 && !loadingActive ? (
              <div className="text-center py-16 space-y-3">
                <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">No active capture requests</p>
                <Button onClick={() => setShowCreateModal(true)} size="sm" variant="outline" className="gap-2">
                  <Plus size={14} /> Create your first capture request
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {allActive.map(req => (
                  <CaptureRequestCard
                    key={req.id}
                    request={req}
                    onClick={() => setSelectedRequest(req)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedRequests.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">No completed captures yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedRequests.map(req => (
                  <CaptureRequestCard
                    key={req.id}
                    request={req}
                    onClick={() => setSelectedRequest(req)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="archived">
            {archivedRequests.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-sm text-muted-foreground">No archived captures</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {archivedRequests.map(req => (
                  <CaptureRequestCard
                    key={req.id}
                    request={req}
                    onClick={() => setSelectedRequest(req)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {showCreateModal && (
        <CreateCaptureModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(req) => {
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
};

export default RemoteCapture;
