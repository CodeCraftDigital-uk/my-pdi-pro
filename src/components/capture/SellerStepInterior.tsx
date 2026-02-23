import CameraCapture from './CameraCapture';
import { INTERIOR_AREAS } from '@/types/capture';

interface SellerStepInteriorProps {
  capturedFiles: Record<string, { file: File; url: string } | null>;
  confirmedSteps: Set<string>;
  onCapture: (key: string, file: File) => void;
  onRetake: (key: string) => void;
  onConfirm: (key: string) => void;
  uploadingStep: string | null;
}

const SellerStepInterior = ({
  capturedFiles,
  confirmedSteps,
  onCapture,
  onRetake,
  onConfirm,
  uploadingStep,
}: SellerStepInteriorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Interior Photos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Capture clear photos of the vehicle interior
        </p>
      </div>

      <div className="space-y-4">
        {INTERIOR_AREAS.map(area => {
          const captured = capturedFiles[area.key];
          return (
            <CameraCapture
              key={area.key}
              label={area.label}
              capturedUrl={captured?.url}
              onCapture={(file) => onCapture(area.key, file)}
              onRetake={() => onRetake(area.key)}
              onConfirm={() => onConfirm(area.key)}
              isUploading={uploadingStep === area.key}
              isConfirmed={confirmedSteps.has(area.key)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SellerStepInterior;
