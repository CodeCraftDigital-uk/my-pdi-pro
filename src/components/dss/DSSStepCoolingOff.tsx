import { CoolingOffConfirmation } from '@/types/distanceSale';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer } from 'lucide-react';

interface Props {
  data: CoolingOffConfirmation;
  onUpdate: (field: keyof CoolingOffConfirmation, value: boolean | string) => void;
}

const CHECKS: { key: keyof CoolingOffConfirmation; label: string }[] = [
  { key: 'isDistanceSale', label: 'This transaction is confirmed as a distance sale (no face-to-face purchase)' },
  { key: 'customerInformedOf14Days', label: 'Customer has been informed of their 14-day cancellation right under the Consumer Contracts Regulations 2013' },
  { key: 'returnConditionExplained', label: 'Condition expectations on return of the vehicle have been explained to the customer' },
  { key: 'returnProcessExplained', label: 'The return process, including responsibility for return transport costs, has been explained to the customer' },
  { key: 'customerAcknowledgesCoolingOff', label: 'Customer confirms they understand their 14-day cooling-off rights' },
];

const DSSStepCoolingOff = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0f9]">
        <Timer size={20} className="text-[#1e3a5f]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">14-Day Cooling-Off Confirmation</h2>
        <p className="text-sm text-muted-foreground">Confirm the customer has been informed of all distance sale cancellation rights.</p>
      </div>
    </div>

    {/* Cooling-off start date */}
    <div className="flex flex-col gap-1.5 max-w-xs">
      <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
        Cooling-Off Period Start Date
      </Label>
      <Input
        type="date"
        value={data.coolingOffStartDate}
        onChange={(e) => onUpdate('coolingOffStartDate', e.target.value)}
        className="bg-background/60"
      />
      <p className="text-xs text-muted-foreground">Typically the date the customer received the vehicle.</p>
    </div>

    {/* Info panel */}
    <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4 text-sm text-amber-800 leading-relaxed">
      <span className="font-bold block mb-1">Consumer Contracts Regulations 2013</span>
      Under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, customers who purchase a vehicle remotely (distance sale) have the right to cancel their order within 14 calendar days of taking delivery, without giving a reason. The customer is responsible for return transport costs unless otherwise agreed. The vehicle must be returned in the same condition it was delivered.
    </div>

    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {CHECKS.map(({ key, label }) => (
        <label
          key={key}
          className="flex items-start gap-3 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <Checkbox
            checked={data[key] as boolean}
            onCheckedChange={(v) => onUpdate(key, !!v)}
            className="mt-0.5 shrink-0"
          />
          <span className="text-sm text-foreground leading-snug">{label}</span>
        </label>
      ))}
    </div>
  </div>
);

export default DSSStepCoolingOff;
