import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

const SERVICE_HISTORY_TYPES = ['Full Service History', 'Part Service History', 'No Service History', 'First Service Not Due'];

export const CustomerHandover = ({ data, onUpdate }: Props) => {
  return (
    <section className="pdi-section pdi-section-card pdi-accent-purple">
      <div className="pdi-section-header">
        <span className="pdi-section-number pdi-num-purple">8</span>
        <ClipboardCheck className="h-5 w-5 text-purple-600" />
        <h2 className="pdi-section-title">Customer Handover &amp; Acceptance</h2>
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

      {/* Keys, V5C, Service History */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 print-grid-5col">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Number of Keys
          </Label>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="e.g. 2"
            value={data.keysReceived}
            onChange={(e) => onUpdate('keysReceived', e.target.value.replace(/[^0-9]/g, ''))}
            className="bg-card"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            V5C Present
          </Label>
          <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
            <Checkbox
              checked={data.v5cPresent}
              onCheckedChange={(v) => onUpdate('v5cPresent', !!v)}
            />
            <span className="text-sm">V5C / Logbook provided</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Service History
          </Label>
          <label className="flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-secondary/50 transition-colors cursor-pointer">
            <Checkbox
              checked={data.serviceHistoryPresent}
              onCheckedChange={(v) => onUpdate('serviceHistoryPresent', !!v)}
            />
            <span className="text-sm">Service records provided</span>
          </label>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Service History Type
          </Label>
          <Select value={data.serviceHistoryType} onValueChange={(v) => onUpdate('serviceHistoryType', v)}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_HISTORY_TYPES.map(t => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            MOT Expiry Date
          </Label>
          <Input
            type="date"
            value={data.motExpiryDate}
            onChange={(e) => onUpdate('motExpiryDate', e.target.value)}
            className="bg-card"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print-grid-2col">
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