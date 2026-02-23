import CameraCapture from './CameraCapture';
import { Info } from 'lucide-react';

interface SellerStepVinProps {
  capturedFile: { file: File; url: string } | null;
  isConfirmed: boolean;
  onCapture: (file: File) => void;
  onRetake: () => void;
  onConfirm: () => void;
  isUploading: boolean;
}

const SellerStepVin = ({
  capturedFile,
  isConfirmed,
  onCapture,
  onRetake,
  onConfirm,
  isUploading,
}: SellerStepVinProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">VIN Plate</h2>
        <p className="text-sm text-slate-500 mt-1">
          Capture the Vehicle Identification Number plate
        </p>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Info size={16} className="text-slate-500 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-600 leading-relaxed space-y-1">
            <p className="font-semibold text-slate-700">Common VIN locations:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Bottom of the windscreen (driver's side)</li>
              <li>Driver's door frame / door jamb</li>
              <li>Under the bonnet on the chassis</li>
              <li>Vehicle registration document (V5C)</li>
            </ul>
          </div>
        </div>
      </div>

      <CameraCapture
        label="VIN Plate Photo"
        description="Ensure the full VIN number is clearly readable"
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

export default SellerStepVin;
