import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MECHANICAL_CHECKS } from '@/types/pdi';
import { Wrench, CheckCheck, X } from 'lucide-react';

interface Props {
  checks: Record<string, boolean>;
  onToggle: (check: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const MechanicalChecklist = ({ checks, onToggle, notes, onNotesChange }: Props) => {
  const allChecked = MECHANICAL_CHECKS.every(c => checks[c]);
  const noneChecked = MECHANICAL_CHECKS.every(c => !checks[c]);

  const handleCheckAll = () => {
    if (allChecked) {
      // Uncheck all
      MECHANICAL_CHECKS.forEach(c => { if (checks[c]) onToggle(c); });
    } else {
      // Check all unchecked
      MECHANICAL_CHECKS.forEach(c => { if (!checks[c]) onToggle(c); });
    }
  };

  const checkedCount = MECHANICAL_CHECKS.filter(c => checks[c]).length;

  return (
    <section className="pdi-section pdi-section-card pdi-accent-indigo">
      <div className="pdi-section-header">
        <span className="pdi-section-number pdi-num-indigo">6</span>
        <Wrench className="h-5 w-5 text-indigo-600" />
        <h2 className="pdi-section-title">Mechanical Checklist</h2>
        <div className="ml-auto flex items-center gap-3 no-print">
          <span className="text-xs text-muted-foreground font-medium">
            {checkedCount}/{MECHANICAL_CHECKS.length} passed
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCheckAll}
            className="gap-1.5 text-xs h-8"
          >
            {allChecked ? (
              <><X className="h-3.5 w-3.5" />Uncheck All</>
            ) : (
              <><CheckCheck className="h-3.5 w-3.5" />Check All</>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 print-grid-2col">
        {MECHANICAL_CHECKS.map(check => (
          <label
            key={check}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/60 transition-colors cursor-pointer min-h-[44px]"
          >
            <Checkbox
              checked={checks[check] || false}
              onCheckedChange={() => onToggle(check)}
              className="shrink-0"
            />
            <span className="text-sm">{check}</span>
          </label>
        ))}
      </div>

      <div className="mt-4 space-y-1.5">
        <label className="text-sm font-medium">Additional Notes</label>
        <Textarea
          placeholder="Any additional mechanical observations..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="bg-card"
          rows={3}
        />
      </div>
    </section>
  );
};
