import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { FileCheck, ShieldAlert } from 'lucide-react';

interface SellerStepDeclarationProps {
  declarationName: string;
  onNameChange: (name: string) => void;
  confirmed: boolean;
  onConfirmChange: (val: boolean) => void;
}

const SellerStepDeclaration = ({
  declarationName,
  onNameChange,
  confirmed,
  onConfirmChange,
}: SellerStepDeclarationProps) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center mx-auto">
          <FileCheck size={32} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Seller Declaration</h2>
        <p className="text-sm text-slate-500">
          Please confirm the accuracy of the information provided
        </p>
      </div>

      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Date</span>
          <span className="font-medium text-slate-800">{dateStr}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Time</span>
          <span className="font-medium text-slate-800">{timeStr}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Your full name (typed signature)
        </label>
        <Input
          value={declarationName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter your full name"
          className="text-base py-3 bg-white"
          maxLength={100}
        />
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <ShieldAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> This remote capture does not replace a physical inspection. 
            No valuation or guarantee of purchase is implied.
          </p>
        </div>
      </div>

      <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-500 transition-colors cursor-pointer">
        <Checkbox
          checked={confirmed}
          onCheckedChange={(checked) => onConfirmChange(!!checked)}
          className="mt-0.5"
        />
        <span className="text-sm text-slate-700 leading-relaxed">
          I confirm the information and images provided are accurate to the best of my knowledge.
        </span>
      </label>
    </div>
  );
};

export default SellerStepDeclaration;
