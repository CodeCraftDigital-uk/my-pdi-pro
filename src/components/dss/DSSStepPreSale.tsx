import { PreSaleCondition } from '@/types/distanceSale';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ClipboardList, Clock } from 'lucide-react';

interface Props {
  data: PreSaleCondition;
  onUpdate: (field: keyof PreSaleCondition, value: boolean | string) => void;
}

const DECLARATIONS: { key: keyof PreSaleCondition; label: string }[] = [
  { key: 'vehicleInspected', label: 'Vehicle has been physically inspected prior to sale' },
  { key: 'knownDefectsDisclosed', label: 'All known mechanical defects have been disclosed to the customer' },
  { key: 'cosmeticImperfectionsDisclosed', label: 'Cosmetic imperfections (scratches, scuffs, dents) have been disclosed' },
  { key: 'warningLightsDeclared', label: 'Warning light status has been declared to the customer' },
  { key: 'serviceHistoryExplained', label: 'Service history status has been explained to the customer' },
  { key: 'financeClearConfirmed', label: 'Finance settlement status confirmed (clear of finance or disclosed)' },
];

const DSSStepPreSale = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0f9]">
        <ClipboardList size={20} className="text-[#1e3a5f]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Pre-Sale Condition Declaration</h2>
        <p className="text-sm text-muted-foreground">Confirm all disclosures made to the customer prior to the distance sale.</p>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {DECLARATIONS.map(({ key, label }) => (
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

    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
        Additional Disclosures <span className="normal-case font-normal text-muted-foreground">(optional)</span>
      </Label>
      <Textarea
        value={data.additionalDisclosures}
        onChange={(e) => onUpdate('additionalDisclosures', e.target.value)}
        placeholder="Detail any additional disclosures made to the customer, e.g. specific faults, agreed remediation, etc."
        rows={4}
        className="bg-background/60"
      />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide flex items-center gap-1.5">
          <Clock size={12} /> Inspection Timestamp
        </Label>
        <Input
          type="datetime-local"
          value={data.inspectionTimestamp}
          onChange={(e) => onUpdate('inspectionTimestamp', e.target.value)}
          className="bg-background/60"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
          Dealer / Inspector Name
        </Label>
        <Input
          type="text"
          value={data.dealerSignature}
          placeholder="Full name of authorising person"
          onChange={(e) => onUpdate('dealerSignature', e.target.value)}
          className="bg-background/60"
        />
      </div>
    </div>
  </div>
);

export default DSSStepPreSale;
