import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { CRA_CHECKS } from '@/types/pdi';
import { Scale, ShieldCheck } from 'lucide-react';

interface Props {
  checks: Record<string, boolean>;
  onToggle: (check: string) => void;
  confirmed: boolean;
  onConfirmChange: (val: boolean) => void;
}

export const CRACompliance = ({ checks, onToggle, confirmed, onConfirmChange }: Props) => {
  return (
    <section className="pdi-section pdi-section-card pdi-accent-teal">
      <div className="pdi-section-header">
        <span className="pdi-section-number pdi-num-teal">7</span>
        <Scale className="h-5 w-5 text-teal-600" />
        <h2 className="pdi-section-title">Consumer Rights Act 2015 Compliance</h2>
      </div>

      <div className="space-y-3">
        {CRA_CHECKS.map(check => (
          <label
            key={check}
            className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <Checkbox
              checked={checks[check] || false}
              onCheckedChange={() => onToggle(check)}
              className="mt-0.5"
            />
            <span className="text-sm leading-relaxed">{check}</span>
          </label>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg border-2 border-primary/20 bg-primary/5">
        <label className="flex items-center gap-3 cursor-pointer">
          <Switch checked={confirmed} onCheckedChange={onConfirmChange} />
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">
              I confirm this vehicle meets Consumer Rights Act 2015 standards.
            </span>
          </div>
        </label>
        {!confirmed && (
          <p className="text-xs text-destructive mt-2 ml-12">
            This confirmation is required before the report can be completed.
          </p>
        )}
      </div>
    </section>
  );
};
