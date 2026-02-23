import { useState, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import CameraCapture from './CameraCapture';
import { Camera, AlertTriangle } from 'lucide-react';

interface SellerStepDamageProps {
  noDamageConfirmed: boolean;
  onNoDamageChange: (val: boolean) => void;
  damageFiles: Array<{ file: File; url: string }>;
  confirmedDamage: boolean[];
  onCaptureDamage: (file: File) => void;
  onRetakeDamage: (index: number) => void;
  onConfirmDamage: (index: number) => void;
  uploadingDamage: number | null;
}

const SellerStepDamage = ({
  noDamageConfirmed,
  onNoDamageChange,
  damageFiles,
  confirmedDamage,
  onCaptureDamage,
  onRetakeDamage,
  onConfirmDamage,
  uploadingDamage,
}: SellerStepDamageProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-slate-900">Damage Disclosure</h2>
        <p className="text-sm text-slate-500 mt-1">
          Upload close-up photos of any visible damage, or confirm there is no damage
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            Please photograph any scratches, dents, chips, or other visible damage. 
            If no damage is present, tick the confirmation below.
          </p>
        </div>
      </div>

      {!noDamageConfirmed && (
        <>
          {damageFiles.map((df, i) => (
            <div key={i} className="rounded-xl border-2 border-slate-200 bg-white overflow-hidden">
              <div className="p-4">
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                  <img src={df.url} alt={`Damage ${i + 1}`} className="w-full max-h-48 object-contain" />
                </div>
                {!confirmedDamage[i] && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onRetakeDamage(i)}
                      className="flex-1 py-2 text-sm font-medium border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => onConfirmDamage(i)}
                      disabled={uploadingDamage === i}
                      className="flex-1 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {uploadingDamage === i ? 'Uploading...' : 'Confirm'}
                    </button>
                  </div>
                )}
                {confirmedDamage[i] && (
                  <div className="text-emerald-700 text-sm font-semibold text-center py-2 bg-emerald-50 rounded-lg mt-3">
                    ✓ Uploaded
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            onClick={() => inputRef.current?.click()}
            className="w-full py-8 flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 transition-colors"
          >
            <Camera size={24} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Add damage photo</span>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onCaptureDamage(file);
              e.target.value = '';
            }}
            className="hidden"
          />
        </>
      )}

      <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-[#1e3a5f] transition-colors cursor-pointer">
        <Checkbox
          checked={noDamageConfirmed}
          onCheckedChange={(checked) => onNoDamageChange(!!checked)}
          className="mt-0.5"
          disabled={damageFiles.some((_, i) => confirmedDamage[i])}
        />
        <span className="text-sm text-slate-700 leading-relaxed">
          I confirm there is no visible damage on this vehicle
        </span>
      </label>
    </div>
  );
};

export default SellerStepDamage;
