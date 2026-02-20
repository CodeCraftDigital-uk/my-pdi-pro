import { EvidenceDocumentation } from '@/types/dispute';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FolderOpen } from 'lucide-react';

interface Props {
  data: EvidenceDocumentation;
  onUpdate: (field: keyof EvidenceDocumentation, value: boolean | string) => void;
}

const EVIDENCE_ITEMS: { key: keyof EvidenceDocumentation; label: string; desc: string; positive: boolean }[] = [
  { key: 'signedPdiAvailable', label: 'Signed PDI Available', desc: 'Pre-delivery inspection report signed by dealer', positive: true },
  { key: 'distanceSalePackCompleted', label: 'Distance Sale Pack Completed', desc: 'Full distance sale documentation generated', positive: true },
  { key: 'provenanceReportProvided', label: 'Provenance Report Provided', desc: 'HPI / vehicle history check shared with customer', positive: true },
  { key: 'serviceHistoryDisclosed', label: 'Service History Disclosed', desc: 'Service history explained and provided to customer', positive: true },
  { key: 'faultInspectionReportAvailable', label: 'Fault Inspection Report Available', desc: 'Independent or in-house inspection of the reported fault', positive: true },
  { key: 'independentInspectionRequested', label: 'Independent Inspection Requested', desc: 'Dealer has offered or requested independent assessment', positive: true },
  { key: 'customerRefusedInspection', label: 'Customer Refused Inspection', desc: 'Customer has declined the dealer\'s inspection offer', positive: false },
];

const DRBStepEvidence = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <FolderOpen className="h-5 w-5 text-[#1e3a5f]" />
        <h2 className="text-lg font-bold text-foreground">Evidence & Documentation</h2>
      </div>
      <p className="text-sm text-muted-foreground">Tick all documentation that is available for this case. This directly shapes the AI response and risk level.</p>
    </div>

    <div className="space-y-2">
      {EVIDENCE_ITEMS.map((item) => {
        const checked = data[item.key] as boolean;
        return (
          <div
            key={item.key}
            onClick={() => onUpdate(item.key, !checked)}
            className={[
              'flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-150 select-none',
              checked
                ? item.positive
                  ? 'border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/20'
                  : 'border-amber-300 bg-amber-50/70 dark:bg-amber-950/20'
                : 'border-border bg-background hover:bg-secondary/30',
            ].join(' ')}
          >
            <Checkbox
              id={item.key}
              checked={checked}
              onCheckedChange={(v) => onUpdate(item.key, Boolean(v))}
              className="mt-0.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <Label
                htmlFor={item.key}
                className={`text-sm font-semibold cursor-pointer ${
                  checked
                    ? item.positive
                      ? 'text-emerald-800 dark:text-emerald-300'
                      : 'text-amber-800 dark:text-amber-300'
                    : 'text-foreground'
                }`}
              >
                {item.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            {!item.positive && checked && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                Note
              </span>
            )}
            {item.positive && checked && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 shrink-0">
                ✓
              </span>
            )}
          </div>
        );
      })}
    </div>

    <div className="space-y-1.5">
      <Label htmlFor="additionalNotes" className="text-sm font-medium">Additional Case Notes (Optional)</Label>
      <Textarea
        id="additionalNotes"
        value={data.additionalNotes}
        onChange={(e) => onUpdate('additionalNotes', e.target.value)}
        placeholder="Any additional context relevant to this case…"
        className="min-h-[100px] text-sm"
      />
    </div>
  </div>
);

export default DRBStepEvidence;
