import { useRef, useState } from 'react';
import { Camera, RotateCcw, Check, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraCaptureProps {
  label: string;
  description?: string;
  accept?: string;
  capturedUrl?: string;
  onCapture: (file: File) => void;
  onRetake: () => void;
  onConfirm: () => void;
  isUploading?: boolean;
  isConfirmed?: boolean;
}

const CameraCapture = ({
  label,
  description,
  accept = 'image/*',
  capturedUrl,
  onCapture,
  onRetake,
  onConfirm,
  isUploading,
  isConfirmed,
}: CameraCaptureProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onCapture(file);
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-800">{label}</h3>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>

      <div className="p-4">
        {capturedUrl ? (
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
              {accept.includes('video') ? (
                <video src={capturedUrl} controls className="w-full max-h-64 object-contain" />
              ) : (
                <img src={capturedUrl} alt={label} className="w-full max-h-64 object-contain" />
              )}
            </div>
            <div className="flex gap-2">
              {!isConfirmed && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetake}
                    className="flex-1 gap-2"
                    disabled={isUploading}
                  >
                    <RotateCcw size={14} /> Retake
                  </Button>
                  <Button
                    size="sm"
                    onClick={onConfirm}
                    className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <><Upload size={14} className="animate-spin" /> Uploading...</>
                    ) : (
                      <><Check size={14} /> Confirm</>
                    )}
                  </Button>
                </>
              )}
              {isConfirmed && (
                <div className="flex items-center gap-2 text-emerald-700 text-sm font-semibold w-full justify-center py-2 bg-emerald-50 rounded-lg">
                  <Check size={16} /> Uploaded successfully
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="w-full py-12 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-[#1e3a5f] flex items-center justify-center">
              <Camera size={28} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Tap to capture {label.toLowerCase()}</span>
            <span className="text-xs text-slate-400">Use your device camera or select from gallery</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default CameraCapture;
