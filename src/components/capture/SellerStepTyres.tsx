import CameraCapture from './CameraCapture';
import { TYRE_POSITIONS } from '@/types/capture';

interface SellerStepTyresProps {
  capturedFiles: Record<string, { file: File; url: string } | null>;
  confirmedSteps: Set<string>;
  onCapture: (key: string, file: File) => void;
  onRetake: (key: string) => void;
  onConfirm: (key: string) => void;
  uploadingStep: string | null;
}

const SellerStepTyres = ({
  capturedFiles,
  confirmedSteps,
  onCapture,
  onRetake,
  onConfirm,
  uploadingStep,
}: SellerStepTyresProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Tyre Tread Photos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Capture a close-up of each tyre tread
        </p>
      </div>

      <div className="space-y-4">
        {TYRE_POSITIONS.map(tyre => {
          const captured = capturedFiles[tyre.key];
          return (
            <CameraCapture
              key={tyre.key}
              label={tyre.label}
              description="Get close to the tyre tread so wear is visible"
              capturedUrl={captured?.url}
              onCapture={(file) => onCapture(tyre.key, file)}
              onRetake={() => onRetake(tyre.key)}
              onConfirm={() => onConfirm(tyre.key)}
              isUploading={uploadingStep === tyre.key}
              isConfirmed={confirmedSteps.has(tyre.key)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SellerStepTyres;
