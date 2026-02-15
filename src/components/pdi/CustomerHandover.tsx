import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignaturePad } from './SignaturePad';
import { HandoverData } from '@/types/pdi';
import { ClipboardCheck } from 'lucide-react';

interface Props {
  data: HandoverData;
  onUpdate: (field: keyof HandoverData, value: string | boolean) => void;
}

const CONFIRMATIONS: { key: keyof HandoverData; label: string }[] = [
  { key: 'vehicleInspected', label: 'Vehicle has been inspected in the presence of the customer' },
  { key: 'cosmeticAccepted', label: 'Cosmetic condition accepted as shown in this report' },
  { key: 'mileageConfirmed', label: 'Mileage at handover confirmed and correct' },
  { key: 'documentationReceived', label: 'All documentation received and checked' },
];

export const CustomerHandover = ({ data, onUpdate }: Props) => {
  return (
    <section className="pdi-section">
      <div className="pdi-section-header">
        <span className="pdi-section-number">8</span>
        <ClipboardCheck className="h-5 w-5 text-primary" />
        <h2 className="pdi-section-title">Customer Handover & Acceptance</h2>
      </div>

      <div className="space-y-3 mb-6">
        {CONFIRMATIONS.map(({ key, label }) => (
          <label
            key={key}
            className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer"
          >
            <Checkbox
              checked={data[key] as boolean}
              onCheckedChange={(v) => onUpdate(key, !!v)}
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>

      <div className="mb-6 max-w-xs space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Number of Keys Received
        </Label>
        <Input
          type="text"
          inputMode="numeric"
          placeholder="e.g. 2"
          value={data.keysReceived}
          onChange={(e) => onUpdate('keysReceived', e.target.value.replace(/[^0-9]/g, ''))}
          className="w-24 bg-card"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer Name</Label>
            <Input
              placeholder="Full name"
              value={data.customerName}
              onChange={(e) => onUpdate('customerName', e.target.value)}
              className="bg-card"
            />
          </div>
          <SignaturePad
            label="Customer Signature"
            signature={data.customerSignature}
            onSignatureChange={(v) => onUpdate('customerSignature', v)}
          />
        </div>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sales Representative Name</Label>
            <Input
              placeholder="Full name"
              value={data.salesRepName}
              onChange={(e) => onUpdate('salesRepName', e.target.value)}
              className="bg-card"
            />
          </div>
          <SignaturePad
            label="Sales Representative Signature"
            signature={data.salesRepSignature}
            onSignatureChange={(v) => onUpdate('salesRepSignature', v)}
          />
        </div>
      </div>
    </section>
  );
};
