import { SaleOverview } from '@/types/dispute';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, CalendarDays, PoundSterling, Gauge } from 'lucide-react';

interface Props {
  data: SaleOverview;
  onUpdate: (field: keyof SaleOverview, value: string | boolean | null) => void;
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

const DRBStepSaleOverview = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Car className="h-5 w-5 text-[#1e3a5f]" />
        <h2 className="text-lg font-bold text-foreground">Sale Overview</h2>
      </div>
      <p className="text-sm text-muted-foreground">Provide key details about the original vehicle sale.</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1.5">
        <Label htmlFor="reg" className="flex items-center gap-1.5 text-sm font-medium">
          <Car className="h-3.5 w-3.5" /> Vehicle Registration <span className="text-destructive">*</span>
        </Label>
        <Input
          id="reg"
          value={data.vehicleRegistration}
          onChange={(e) => onUpdate('vehicleRegistration', e.target.value.toUpperCase())}
          placeholder="e.g. AB12 CDE"
          className="font-mono uppercase"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="saleDate" className="flex items-center gap-1.5 text-sm font-medium">
          <CalendarDays className="h-3.5 w-3.5" /> Date of Sale <span className="text-destructive">*</span>
        </Label>
        <Input
          id="saleDate"
          type="date"
          value={data.saleDate}
          onChange={(e) => onUpdate('saleDate', e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="salePrice" className="flex items-center gap-1.5 text-sm font-medium">
          <PoundSterling className="h-3.5 w-3.5" /> Sale Price (£) <span className="text-destructive">*</span>
        </Label>
        <Input
          id="salePrice"
          value={data.salePrice}
          onChange={(e) => onUpdate('salePrice', e.target.value)}
          placeholder="e.g. 8500"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="mileageAtSale" className="flex items-center gap-1.5 text-sm font-medium">
          <Gauge className="h-3.5 w-3.5" /> Mileage at Sale <span className="text-destructive">*</span>
        </Label>
        <Input
          id="mileageAtSale"
          value={data.mileageAtSale}
          onChange={(e) => onUpdate('mileageAtSale', e.target.value)}
          placeholder="e.g. 45000"
        />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      <YesNoToggle
        label="Distance Sale?"
        value={data.distanceSale}
        onChange={(v) => onUpdate('distanceSale', v)}
      />
      <YesNoToggle
        label="Warranty Provided?"
        value={data.warrantyProvided}
        onChange={(v) => onUpdate('warrantyProvided', v)}
      />
      <YesNoToggle
        label="Finance Involved?"
        value={data.financeInvolved}
        onChange={(v) => onUpdate('financeInvolved', v)}
      />
    </div>
  </div>
);

export default DRBStepSaleOverview;
