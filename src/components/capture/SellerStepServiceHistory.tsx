import CameraCapture from './CameraCapture';
import { BookOpen } from 'lucide-react';

interface SellerStepServiceHistoryProps {
  capturedFiles: Array<{ file: File; url: string }>;
  confirmedIndices: Set<number>;
  onCapture: (file: File) => void;
  onRetake: (index: number) => void;
  onConfirm: (index: number) => void;
  uploadingIndex: number | null;
}

const SellerStepServiceHistory = ({
  capturedFiles,
  confirmedIndices,
  onCapture,
  onRetake,
  onConfirm,
  uploadingIndex,
}: SellerStepServiceHistoryProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Service History</h2>
        <p className="text-sm text-slate-500 mt-1">
          Capture pages of the service book or digital service records
        </p>
      </div>

      {capturedFiles.map((cf, i) => (
        <div key={i} className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden p-4">
          <img src={cf.url} alt={`Service history page ${i + 1}`} className="w-full max-h-48 object-contain rounded-lg border border-slate-200" />
          {!confirmedIndices.has(i) && (
            <div className="flex gap-2 mt-3">
              <button onClick={() => onRetake(i)} className="flex-1 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-600">Remove</button>
              <button onClick={() => onConfirm(i)} disabled={uploadingIndex === i} className="flex-1 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg disabled:opacity-50">
                {uploadingIndex === i ? 'Uploading...' : 'Confirm'}
              </button>
            </div>
          )}
          {confirmedIndices.has(i) && (
            <div className="text-emerald-700 text-sm font-semibold text-center py-2 bg-emerald-50 rounded-lg mt-3">✓ Uploaded</div>
          )}
        </div>
      ))}

      <button
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.capture = 'environment';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) onCapture(file);
          };
          input.click();
        }}
        className="w-full py-8 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <BookOpen size={24} className="text-slate-400" />
        <span className="text-sm font-medium text-slate-600">Add service history page</span>
      </button>
    </div>
  );
};

export default SellerStepServiceHistory;
