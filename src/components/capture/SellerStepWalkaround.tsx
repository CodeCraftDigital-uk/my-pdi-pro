import CameraCapture from './CameraCapture';
import { Video, Info } from 'lucide-react';

interface SellerStepWalkaroundProps {
  capturedFile: { file: File; url: string } | null;
  isConfirmed: boolean;
  onCapture: (file: File) => void;
  onRetake: () => void;
  onConfirm: () => void;
  isUploading: boolean;
}

const SellerStepWalkaround = ({
  capturedFile,
  isConfirmed,
  onCapture,
  onRetake,
  onConfirm,
  isUploading,
}: SellerStepWalkaroundProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Walkaround Video</h2>
        <p className="text-sm text-slate-500 mt-1">
          Record a 30–60 second walkaround of the vehicle
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-800 leading-relaxed space-y-1">
            <p className="font-semibold">Recording guidance:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Walk slowly around the full vehicle</li>
              <li>Keep the camera steady at waist height</li>
              <li>Include all four corners and both sides</li>
              <li>Aim for 30–60 seconds total</li>
            </ul>
          </div>
        </div>
      </div>

      <CameraCapture
        label="Walkaround Video"
        description="Record a slow walk around the vehicle"
        accept="video/*"
        capturedUrl={capturedFile?.url}
        onCapture={onCapture}
        onRetake={onRetake}
        onConfirm={onConfirm}
        isUploading={isUploading}
        isConfirmed={isConfirmed}
      />
    </div>
  );
};

export default SellerStepWalkaround;
