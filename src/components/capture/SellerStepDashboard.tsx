import CameraCapture from './CameraCapture';
import { DASHBOARD_CAPTURES } from '@/types/capture';
import { AlertTriangle } from 'lucide-react';

interface SellerStepDashboardProps {
  capturedFiles: Record<string, { file: File; url: string } | null>;
  confirmedSteps: Set<string>;
  onCapture: (key: string, file: File) => void;
  onRetake: (key: string) => void;
  onConfirm: (key: string) => void;
  uploadingStep: string | null;
}

const SellerStepDashboard = ({
  capturedFiles,
  confirmedSteps,
  onCapture,
  onRetake,
  onConfirm,
  uploadingStep,
}: SellerStepDashboardProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Dashboard Capture</h2>
        <p className="text-sm text-slate-500 mt-1">
          Capture the dashboard with ignition on
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800 leading-relaxed">
            Please turn the ignition on before taking these photos. The odometer reading and any 
            warning lights must be clearly visible.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {DASHBOARD_CAPTURES.map(cap => {
          const captured = capturedFiles[cap.key];
          return (
            <CameraCapture
              key={cap.key}
              label={cap.label}
              description={cap.key === 'dashboard_odometer' ? 'Ensure the mileage is clearly readable' : 'Show any active warning lights'}
              capturedUrl={captured?.url}
              onCapture={(file) => onCapture(cap.key, file)}
              onRetake={() => onRetake(cap.key)}
              onConfirm={() => onConfirm(cap.key)}
              isUploading={uploadingStep === cap.key}
              isConfirmed={confirmedSteps.has(cap.key)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SellerStepDashboard;
