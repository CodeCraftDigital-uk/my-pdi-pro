import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MECHANICAL_CHECKS } from '@/types/pdi';
import { Wrench } from 'lucide-react';

interface Props {
  checks: Record<string, boolean>;
  onToggle: (check: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const MechanicalChecklist = ({ checks, onToggle, notes, onNotesChange }: Props) => {
  return (
    <section className="pdi-section">
      <div className="pdi-section-header">
        <span className="pdi-section-number">6</span>
        <Wrench className="h-5 w-5 text-primary" />
        <h2 className="pdi-section-title">Mechanical Checklist</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 print-grid-2col">
        {MECHANICAL_CHECKS.map(check => (
          <label
            key={check}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <Checkbox
              checked={checks[check] || false}
              onCheckedChange={() => onToggle(check)}
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
