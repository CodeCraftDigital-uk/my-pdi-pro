import { useState } from 'react';
import CameraCapture from './CameraCapture';
import { EXTERIOR_ANGLES } from '@/types/capture';

interface SellerStepExteriorProps {
  capturedFiles: Record<string, { file: File; url: string } | null>;
  confirmedSteps: Set<string>;
  onCapture: (key: string, file: File) => void;
  onRetake: (key: string) => void;
  onConfirm: (key: string) => void;
  uploadingStep: string | null;
}

const SellerStepExterior = ({
  capturedFiles,
  confirmedSteps,
  onCapture,
  onRetake,
  onConfirm,
  uploadingStep,
}: SellerStepExteriorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Exterior Photos</h2>
        <p className="text-sm text-slate-500 mt-1">
          Capture clear photos of all four sides of the vehicle
        </p>
      </div>

      <div className="space-y-4">
        {EXTERIOR_ANGLES.map(angle => {
          const captured = capturedFiles[angle.key];
          return (
            <CameraCapture
              key={angle.key}
              label={angle.label}
              description={`Take a clear photo of the ${angle.label.toLowerCase()} of the vehicle`}
              capturedUrl={captured?.url}
              onCapture={(file) => onCapture(angle.key, file)}
              onRetake={() => onRetake(angle.key)}
              onConfirm={() => onConfirm(angle.key)}
              isUploading={uploadingStep === angle.key}
              isConfirmed={confirmedSteps.has(angle.key)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SellerStepExterior;
