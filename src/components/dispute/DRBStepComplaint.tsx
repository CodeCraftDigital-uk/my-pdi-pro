import { ComplaintDetails, ComplaintType } from '@/types/dispute';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface Props {
  data: ComplaintDetails;
  onUpdate: (field: keyof ComplaintDetails, value: string) => void;
}

const COMPLAINT_OPTIONS: { value: ComplaintType; label: string }[] = [
  { value: 'mechanical-fault', label: 'Mechanical Fault' },
  { value: 'electrical-fault', label: 'Electrical Fault' },
  { value: 'cosmetic-complaint', label: 'Cosmetic Complaint' },
  { value: 'not-as-described', label: '"Not as Described" Claim' },
  { value: 'rejection-under-30', label: 'Rejection Request (under 30 days)' },
  { value: 'rejection-over-30', label: 'Rejection Request (over 30 days)' },
  { value: 'refund-demand', label: 'Refund Demand' },
  { value: 'finance-escalation', label: 'Finance Company Escalation' },
  { value: 'general-dissatisfaction', label: 'General Dissatisfaction' },
];

const DRBStepComplaint = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-5 w-5 text-[#1e3a5f]" />
        <h2 className="text-lg font-bold text-foreground">Complaint Details</h2>
      </div>
      <p className="text-sm text-muted-foreground">Select the complaint type and paste the customer's exact wording.</p>
    </div>

    <div className="space-y-2">
      <Label className="text-sm font-medium">Complaint Type <span className="text-destructive">*</span></Label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {COMPLAINT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onUpdate('complaintType', opt.value)}
            className={[
              'text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-150',
              data.complaintType === opt.value
                ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-sm'
                : 'bg-background border-border text-foreground hover:border-[#2d6aad]/50 hover:bg-secondary/50',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-1.5">
      <Label htmlFor="customerText" className="text-sm font-medium">
        Customer's Exact Complaint Wording <span className="text-destructive">*</span>
      </Label>
      <p className="text-xs text-muted-foreground">Paste or type the customer's complaint as received (email, message, letter).</p>
      <Textarea
        id="customerText"
        value={data.customerComplaintText}
        onChange={(e) => onUpdate('customerComplaintText', e.target.value)}
        placeholder="Paste the customer's complaint here…"
        className="min-h-[140px] text-sm"
      />
    </div>
  </div>
);

export default DRBStepComplaint;
