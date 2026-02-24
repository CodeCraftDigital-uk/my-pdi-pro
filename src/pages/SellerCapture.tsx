import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCaptureRequestByToken } from '@/hooks/useCaptureRequest';
import { uploadCaptureMedia, submitCapture } from '@/hooks/useCaptureRequest';
import { toast } from '@/hooks/use-toast';
import CaptureProgressBar from '@/components/capture/CaptureProgressBar';
import SellerStepIntro from '@/components/capture/SellerStepIntro';
import SellerStepExterior from '@/components/capture/SellerStepExterior';
import SellerStepDamage from '@/components/capture/SellerStepDamage';
import SellerStepInterior from '@/components/capture/SellerStepInterior';
import SellerStepDashboard from '@/components/capture/SellerStepDashboard';
import SellerStepVin from '@/components/capture/SellerStepVin';
import SellerStepTyres from '@/components/capture/SellerStepTyres';
import SellerStepWalkaround from '@/components/capture/SellerStepWalkaround';
import SellerStepServiceHistory from '@/components/capture/SellerStepServiceHistory';
import SellerStepDeclaration from '@/components/capture/SellerStepDeclaration';
import { Button } from '@/components/ui/button';
import { ChevronRight, AlertCircle, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import type { RequiredSteps, CaptureStepKey } from '@/types/capture';

const FILE_SIZE_LIMITS = { image: 10 * 1024 * 1024, video: 50 * 1024 * 1024 };

function validateFileSize(file: File, type: 'image' | 'video'): boolean {
  if (file.size > FILE_SIZE_LIMITS[type]) {
    toast({ title: 'File too large', description: `Max ${type === 'image' ? '10MB' : '50MB'}`, variant: 'destructive' });
    return false;
  }
  return true;
}

const SellerCapture = () => {
  const { token } = useParams<{ token: string }>();
  const { data: request, isLoading, error } = useCaptureRequestByToken(token);

  const [step, setStep] = useState(0); // 0 = intro
  const [authorised, setAuthorised] = useState(false);

  // Captured files state for multi-image steps
  const [capturedFiles, setCapturedFiles] = useState<Record<string, { file: File; url: string } | null>>({});
  const [confirmedSteps, setConfirmedSteps] = useState<Set<string>>(new Set());
  const [uploadingStep, setUploadingStep] = useState<string | null>(null);

  // Damage state
  const [noDamageConfirmed, setNoDamageConfirmed] = useState(false);
  const [damageFiles, setDamageFiles] = useState<Array<{ file: File; url: string }>>([]);
  const [confirmedDamage, setConfirmedDamage] = useState<boolean[]>([]);
  const [uploadingDamage, setUploadingDamage] = useState<number | null>(null);

  // Service history state
  const [serviceFiles, setServiceFiles] = useState<Array<{ file: File; url: string }>>([]);
  const [confirmedService, setConfirmedService] = useState<Set<number>>(new Set());
  const [uploadingService, setUploadingService] = useState<number | null>(null);

  // Declaration state
  const [declarationName, setDeclarationName] = useState('');
  const [declarationConfirmed, setDeclarationConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Build active steps from required_steps
  const activeSteps: CaptureStepKey[] = request
    ? (['exterior', 'damage', 'interior', 'dashboard', 'vin', 'tyres', 'service_history', 'walkaround'] as CaptureStepKey[])
        .filter(key => (request.required_steps as RequiredSteps)[key])
    : [];

  const allSteps = ['intro', ...activeSteps, 'declaration'];
  const currentStepKey = allSteps[step];
  const totalSteps = allSteps.length;
  const stepLabel = currentStepKey === 'intro' ? 'Introduction' : currentStepKey === 'declaration' ? 'Declaration' : currentStepKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Check expiry
  const isExpired = request ? new Date(request.expires_at) < new Date() : false;
  const isCompleted = request?.status === 'completed';

  const handleCapture = useCallback((key: string, file: File) => {
    if (!validateFileSize(file, file.type.startsWith('video/') ? 'video' : 'image')) return;
    const url = URL.createObjectURL(file);
    setCapturedFiles(prev => ({ ...prev, [key]: { file, url } }));
  }, []);

  const handleRetake = useCallback((key: string) => {
    setCapturedFiles(prev => ({ ...prev, [key]: null }));
    setConfirmedSteps(prev => { const n = new Set(prev); n.delete(key); return n; });
  }, []);

  const handleConfirm = useCallback(async (key: string) => {
    const captured = capturedFiles[key];
    if (!captured || !request) return;
    setUploadingStep(key);
    try {
      await uploadCaptureMedia(request.id, key, captured.file);
      setConfirmedSteps(prev => new Set(prev).add(key));
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingStep(null);
    }
  }, [capturedFiles, request]);

  const handleCaptureDamage = useCallback((file: File) => {
    if (!validateFileSize(file, 'image')) return;
    const url = URL.createObjectURL(file);
    setDamageFiles(prev => [...prev, { file, url }]);
    setConfirmedDamage(prev => [...prev, false]);
  }, []);

  const handleConfirmDamage = useCallback(async (index: number) => {
    if (!request) return;
    setUploadingDamage(index);
    try {
      await uploadCaptureMedia(request.id, `damage_${index}`, damageFiles[index].file);
      setConfirmedDamage(prev => { const n = [...prev]; n[index] = true; return n; });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingDamage(null);
    }
  }, [damageFiles, request]);

  const handleCaptureService = useCallback((file: File) => {
    if (!validateFileSize(file, 'image')) return;
    const url = URL.createObjectURL(file);
    setServiceFiles(prev => [...prev, { file, url }]);
  }, []);

  const handleConfirmService = useCallback(async (index: number) => {
    if (!request) return;
    setUploadingService(index);
    try {
      await uploadCaptureMedia(request.id, `service_history_${index}`, serviceFiles[index].file);
      setConfirmedService(prev => new Set(prev).add(index));
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploadingService(null);
    }
  }, [serviceFiles, request]);

  const handleSubmit = async () => {
    if (!request || !declarationName.trim() || !declarationConfirmed) return;
    setIsSubmitting(true);
    try {
      await submitCapture(request.id, {
        declarationName: declarationName.trim(),
        noDamageConfirmed,
      });
      setSubmitted(true);
      toast({ title: 'Capture submitted successfully' });
    } catch (err: any) {
      toast({ title: 'Submission failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canAdvance = (): boolean => {
    if (currentStepKey === 'intro') return authorised;
    if (currentStepKey === 'declaration') return declarationName.trim().length > 0 && declarationConfirmed;
    if (currentStepKey === 'damage') return noDamageConfirmed || confirmedDamage.some(Boolean);
    if (currentStepKey === 'service_history') return confirmedService.size > 0;
    if (currentStepKey === 'vin') return confirmedSteps.has('vin_plate');
    if (currentStepKey === 'walkaround') return confirmedSteps.has('walkaround_video');

    // Multi-image steps: require at least one sub-capture confirmed for each step
    const prefixMap: Record<string, string> = {
      exterior: 'exterior_',
      interior: 'interior_',
      dashboard: 'dashboard_',
      tyres: 'tyre_',
    };
    const prefix = prefixMap[currentStepKey];
    if (prefix) {
      return Array.from(confirmedSteps).some(k => k.startsWith(prefix));
    }
    return false;
  };

  // Loading / error states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Link Not Found</h1>
          <p className="text-sm text-slate-500">This capture link is invalid or has been removed.</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <Clock className="h-16 w-16 text-amber-400 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Link Expired</h1>
          <p className="text-sm text-slate-500">This capture link has expired. Please contact the dealer for a new link.</p>
        </div>
      </div>
    );
  }

  if (isCompleted || submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-900">Capture Complete</h1>
          <p className="text-sm text-slate-500">Thank you. Your vehicle capture has been submitted successfully. The dealer will review your submission.</p>
        </div>
      </div>
    );
  }

  const vehicleRef = request.vehicle_registration || request.vehicle_vin || null;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <CaptureProgressBar currentStep={step + 1} totalSteps={totalSteps} stepLabel={stepLabel} />

      <div className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {currentStepKey === 'intro' && (
          <SellerStepIntro
            dealerName={request.dealer_name}
            vehicleRef={vehicleRef}
            authorised={authorised}
            onAuthorise={setAuthorised}
          />
        )}

        {currentStepKey === 'exterior' && (
          <SellerStepExterior
            capturedFiles={capturedFiles}
            confirmedSteps={confirmedSteps}
            onCapture={handleCapture}
            onRetake={handleRetake}
            onConfirm={handleConfirm}
            uploadingStep={uploadingStep}
          />
        )}

        {currentStepKey === 'damage' && (
          <SellerStepDamage
            noDamageConfirmed={noDamageConfirmed}
            onNoDamageChange={setNoDamageConfirmed}
            damageFiles={damageFiles}
            confirmedDamage={confirmedDamage}
            onCaptureDamage={handleCaptureDamage}
            onRetakeDamage={(i) => {
              setDamageFiles(prev => prev.filter((_, idx) => idx !== i));
              setConfirmedDamage(prev => prev.filter((_, idx) => idx !== i));
            }}
            onConfirmDamage={handleConfirmDamage}
            uploadingDamage={uploadingDamage}
          />
        )}

        {currentStepKey === 'interior' && (
          <SellerStepInterior
            capturedFiles={capturedFiles}
            confirmedSteps={confirmedSteps}
            onCapture={handleCapture}
            onRetake={handleRetake}
            onConfirm={handleConfirm}
            uploadingStep={uploadingStep}
          />
        )}

        {currentStepKey === 'dashboard' && (
          <SellerStepDashboard
            capturedFiles={capturedFiles}
            confirmedSteps={confirmedSteps}
            onCapture={handleCapture}
            onRetake={handleRetake}
            onConfirm={handleConfirm}
            uploadingStep={uploadingStep}
          />
        )}

        {currentStepKey === 'vin' && (
          <SellerStepVin
            capturedFile={capturedFiles['vin_plate'] || null}
            isConfirmed={confirmedSteps.has('vin_plate')}
            onCapture={(file) => handleCapture('vin_plate', file)}
            onRetake={() => handleRetake('vin_plate')}
            onConfirm={() => handleConfirm('vin_plate')}
            isUploading={uploadingStep === 'vin_plate'}
          />
        )}

        {currentStepKey === 'tyres' && (
          <SellerStepTyres
            capturedFiles={capturedFiles}
            confirmedSteps={confirmedSteps}
            onCapture={handleCapture}
            onRetake={handleRetake}
            onConfirm={handleConfirm}
            uploadingStep={uploadingStep}
          />
        )}

        {currentStepKey === 'service_history' && (
          <SellerStepServiceHistory
            capturedFiles={serviceFiles}
            confirmedIndices={confirmedService}
            onCapture={handleCaptureService}
            onRetake={(i) => {
              setServiceFiles(prev => prev.filter((_, idx) => idx !== i));
              setConfirmedService(prev => { const n = new Set(prev); n.delete(i); return n; });
            }}
            onConfirm={handleConfirmService}
            uploadingIndex={uploadingService}
          />
        )}

        {currentStepKey === 'walkaround' && (
          <SellerStepWalkaround
            capturedFile={capturedFiles['walkaround_video'] || null}
            isConfirmed={confirmedSteps.has('walkaround_video')}
            onCapture={(file) => handleCapture('walkaround_video', file)}
            onRetake={() => handleRetake('walkaround_video')}
            onConfirm={() => handleConfirm('walkaround_video')}
            isUploading={uploadingStep === 'walkaround_video'}
          />
        )}

        {currentStepKey === 'declaration' && (
          <SellerStepDeclaration
            declarationName={declarationName}
            onNameChange={setDeclarationName}
            confirmed={declarationConfirmed}
            onConfirmChange={setDeclarationConfirmed}
          />
        )}
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-3 shadow-lg">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 0 && (
            <Button
              variant="outline"
              onClick={() => setStep(s => s - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {currentStepKey === 'declaration' ? (
            <Button
              onClick={handleSubmit}
              disabled={!declarationName.trim() || !declarationConfirmed || isSubmitting}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Capture'}
            </Button>
          ) : (
            <Button
              onClick={() => setStep(s => s + 1)}
              disabled={!canAdvance()}
              className="flex-1 gap-2"
              style={{ background: '#1e3a5f' }}
            >
              Continue <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerCapture;
