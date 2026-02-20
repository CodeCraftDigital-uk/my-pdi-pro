import { TimeUsageFactors, SaleOverview, daysSinceSale, mileageSinceSale, legalTimeline } from '@/types/dispute';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock, Gauge, AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface Props {
  data: TimeUsageFactors;
  saleOverview: SaleOverview;
  onUpdate: (field: keyof TimeUsageFactors, value: string | boolean | null) => void;
}

const YesNoToggle = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium text-foreground">{label}</Label>
    <div className="flex gap-2">
      {[true, false].map((v) => (
        <button
          key={String(v)}
          type="button"
          onClick={() => onChange(v)}
          className={[
            'flex-1 py-2 rounded-lg border text-sm font-semibold transition-all duration-150',
            value === v
              ? v
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                : 'bg-destructive border-destructive text-white shadow-sm'
              : 'bg-background border-border text-muted-foreground hover:border-foreground/30',
          ].join(' ')}
        >
          {v ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  </div>
);

const TIMELINE_CONFIG = {
  'under-30': {
    label: 'Under 30 Days',
    desc: 'Short-term right to reject period — customer may be entitled to a full refund without opportunity for repair.',
    color: 'border-destructive/40 bg-destructive/5 text-destructive',
    icon: <AlertCircle className="h-4 w-4 shrink-0" />,
  },
  '30-to-6-months': {
    label: '30 Days – 6 Months',
    desc: 'Dealer has the right to repair or replace before refund is considered. One opportunity to repair.',
    color: 'border-warning/40 bg-warning/5',
    icon: <Info className="h-4 w-4 shrink-0 text-amber-600" />,
  },
  'over-6-months': {
    label: 'Over 6 Months',
    desc: 'Burden of proof shifts to the customer to demonstrate the fault was present at point of sale.',
    color: 'border-success/30 bg-success/5',
    icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />,
  },
};

const DRBStepTimeUsage = ({ data, saleOverview, onUpdate }: Props) => {
  const days = daysSinceSale(saleOverview.saleDate);
  const miles = mileageSinceSale(saleOverview.mileageAtSale, data.currentMileage);
  const timeline = saleOverview.saleDate ? legalTimeline(days) : null;
  const tlConfig = timeline ? TIMELINE_CONFIG[timeline] : null;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-5 w-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-foreground">Time & Usage Factors</h2>
        </div>
        <p className="text-sm text-muted-foreground">These details determine the legal posture of your response.</p>
      </div>

      {/* Auto-calc summary */}
      {saleOverview.saleDate && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-center">
            <p className="text-2xl font-black text-foreground">{days}</p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Days Since Sale</p>
          </div>
          <div className="rounded-xl border border-border bg-secondary/30 p-4 text-center">
            <p className="text-2xl font-black text-foreground">{data.currentMileage ? miles.toLocaleString() : '—'}</p>
            <p className="text-xs font-medium text-muted-foreground mt-0.5">Miles Since Sale</p>
          </div>
        </div>
      )}

      {/* Legal timeline indicator */}
      {tlConfig && (
        <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${tlConfig.color}`}>
          {tlConfig.icon}
          <div>
            <p className="text-sm font-bold">{tlConfig.label}</p>
            <p className="text-xs mt-0.5 leading-relaxed opacity-90">{tlConfig.desc}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="currentMileage" className="flex items-center gap-1.5 text-sm font-medium">
            <Gauge className="h-3.5 w-3.5" /> Current Mileage <span className="text-destructive">*</span>
          </Label>
          <Input
            id="currentMileage"
            value={data.currentMileage}
            onChange={(e) => onUpdate('currentMileage', e.target.value)}
            placeholder="e.g. 47500"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="currentDate" className="flex items-center gap-1.5 text-sm font-medium">
            <Clock className="h-3.5 w-3.5" /> Today's Date
          </Label>
          <Input
            id="currentDate"
            type="date"
            value={data.currentDate}
            onChange={(e) => onUpdate('currentDate', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <YesNoToggle
          label="Vehicle Currently Drivable?"
          value={data.vehicleDrivable}
          onChange={(v) => onUpdate('vehicleDrivable', v)}
        />
        <YesNoToggle
          label="Has Repair Been Attempted?"
          value={data.repairAttempted}
          onChange={(v) => onUpdate('repairAttempted', v)}
        />
      </div>
    </div>
  );
};

export default DRBStepTimeUsage;
