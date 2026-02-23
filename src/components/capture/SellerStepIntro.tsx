import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck } from 'lucide-react';

interface SellerStepIntroProps {
  dealerName: string | null;
  vehicleRef: string | null;
  authorised: boolean;
  onAuthorise: (val: boolean) => void;
}

const SellerStepIntro = ({ dealerName, vehicleRef, authorised, onAuthorise }: SellerStepIntroProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#1e3a5f] flex items-center justify-center mx-auto">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Remote Vehicle Capture</h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          You have been invited to provide vehicle images and information for remote appraisal.
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2">
        {dealerName && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Requested by</span>
            <span className="font-semibold text-slate-800">{dealerName}</span>
          </div>
        )}
        {vehicleRef && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Vehicle</span>
            <span className="font-semibold text-slate-800">{vehicleRef}</span>
          </div>
        )}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Disclaimer:</strong> This remote capture does not replace a physical inspection. 
          The information you provide will be used for appraisal purposes only and does not imply a 
          guarantee of purchase.
        </p>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-[#1e3a5f] transition-colors cursor-pointer">
        <Checkbox
          checked={authorised}
          onCheckedChange={(checked) => onAuthorise(!!checked)}
          className="mt-0.5"
        />
        <span className="text-sm text-slate-700 leading-relaxed">
          I confirm I am authorised to provide information and images of this vehicle for the purpose 
          of a remote appraisal.
        </span>
      </label>
    </div>
  );
};

export default SellerStepIntro;
