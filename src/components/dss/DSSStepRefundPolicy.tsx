import { RefundPolicyAck } from '@/types/distanceSale';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck } from 'lucide-react';

interface Props {
  data: RefundPolicyAck;
  onUpdate: (field: keyof RefundPolicyAck, value: boolean) => void;
}

const POLICY_ITEMS = [
  {
    key: 'refundTimelinesUnderstood' as keyof RefundPolicyAck,
    heading: 'Refund Timelines',
    body: 'Where a valid refund is agreed, the dealer will process the refund within 14 calendar days of the vehicle being returned. Refunds will be issued via the original payment method where possible.',
  },
  {
    key: 'repairFirstApproachAgreed' as keyof RefundPolicyAck,
    heading: 'Repair-First Approach',
    body: 'After the 30-day short-term rejection period, the dealer has the right to attempt one repair before a refund or price reduction is considered. The repair will be completed within a reasonable timeframe and at no cost to the customer.',
  },
  {
    key: 'diagnosticsAgreed' as keyof RefundPolicyAck,
    heading: 'Diagnostics Agreement',
    body: 'In the event of a reported fault, the customer agrees to allow the dealer to inspect and diagnose the vehicle prior to any remedy being agreed. The customer must not authorise third-party repairs without the dealer\'s prior written consent.',
  },
  {
    key: 'thirdPartyInspectionAgreed' as keyof RefundPolicyAck,
    heading: 'Third-Party Inspection',
    body: 'Either party may request an independent inspection by an approved automotive engineer. Costs of independent inspections will be allocated fairly based on the findings. Reports from unaccredited sources may not be accepted as evidence.',
  },
  {
    key: 'transportCostPolicyUnderstood' as keyof RefundPolicyAck,
    heading: 'Transport Cost Policy',
    body: 'In distance sale returns under the 14-day cooling-off period, the customer is responsible for the reasonable cost of returning the vehicle unless otherwise agreed in writing. For refunds due to a genuine fault, the dealer will arrange and cover the cost of return transport.',
  },
];

const DSSStepRefundPolicy = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0f9]">
        <ShieldCheck size={20} className="text-[#1e3a5f]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Refund Policy Acknowledgement</h2>
        <p className="text-sm text-muted-foreground">Customer must acknowledge each policy area before the pack is finalised.</p>
      </div>
    </div>

    <div className="space-y-3">
      {POLICY_ITEMS.map(({ key, heading, body }) => (
        <label
          key={key}
          className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card cursor-pointer hover:bg-muted/30 transition-colors"
        >
          <Checkbox
            checked={data[key] as boolean}
            onCheckedChange={(v) => onUpdate(key, !!v)}
            className="mt-0.5 shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">{heading}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
          </div>
        </label>
      ))}
    </div>

    {/* Final confirmation */}
    <div className="rounded-xl border-2 border-[#1e3a5f]/30 bg-[#e8f0f9]/40 p-5">
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={data.confirmed}
          onCheckedChange={(v) => onUpdate('confirmed', !!v)}
          className="mt-0.5 shrink-0"
        />
        <span className="text-sm font-semibold text-foreground leading-snug">
          I confirm that I have read and understood all of the above refund and return policies relating to this distance sale.
        </span>
      </label>
    </div>
  </div>
);

export default DSSStepRefundPolicy;
