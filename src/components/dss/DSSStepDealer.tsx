import { DealerDetails } from '@/types/distanceSale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2 } from 'lucide-react';

interface Props {
  data: DealerDetails;
  onUpdate: (field: keyof DealerDetails, value: string) => void;
}

const field = (
  id: string,
  label: string,
  value: string,
  onChange: (v: string) => void,
  optional?: boolean,
  type = 'text',
  placeholder = ''
) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id} className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
      {label} {optional && <span className="normal-case font-normal text-muted-foreground">(optional)</span>}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="bg-background/60"
    />
  </div>
);

const DSSStepDealer = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0f9]">
        <Building2 size={20} className="text-[#1e3a5f]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Dealer Details</h2>
        <p className="text-sm text-muted-foreground">Your dealership information for this pack.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {field('businessName', 'Business Name', data.businessName, v => onUpdate('businessName', v), false, 'text', 'e.g. Smith Motor Group Ltd')}
      {field('tradingAddress', 'Trading Address', data.tradingAddress, v => onUpdate('tradingAddress', v), false, 'text', 'Full trading address')}
      {field('contactNumber', 'Contact Number', data.contactNumber, v => onUpdate('contactNumber', v), false, 'tel', '01234 567890')}
      {field('email', 'Email Address', data.email, v => onUpdate('email', v), false, 'email', 'sales@dealership.co.uk')}
      {field('vatNumber', 'VAT Number', data.vatNumber, v => onUpdate('vatNumber', v), true, 'text', 'GB 123 4567 89')}
      {field('fcaNumber', 'FCA Number', data.fcaNumber, v => onUpdate('fcaNumber', v), true, 'text', '123456')}
    </div>
  </div>
);

export default DSSStepDealer;
