import { DSSVehicleDetails } from '@/types/distanceSale';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car } from 'lucide-react';

interface Props {
  data: DSSVehicleDetails;
  onUpdate: (field: keyof DSSVehicleDetails, value: string) => void;
}

const field = (
  id: string,
  label: string,
  value: string,
  onChange: (v: string) => void,
  type = 'text',
  placeholder = ''
) => (
  <div className="flex flex-col gap-1.5">
    <Label htmlFor={id} className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
      {label}
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

const DSSStepVehicle = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0f9]">
        <Car size={20} className="text-[#1e3a5f]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Vehicle Details</h2>
        <p className="text-sm text-muted-foreground">Details of the vehicle being sold at distance.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {field('registration', 'Registration', data.registration, v => onUpdate('registration', v.toUpperCase()), 'text', 'e.g. AB21 XYZ')}
      {field('vin', 'VIN', data.vin, v => onUpdate('vin', v.toUpperCase()), 'text', '17-character VIN')}
      {field('make', 'Make', data.make, v => onUpdate('make', v), 'text', 'e.g. Ford')}
      {field('model', 'Model', data.model, v => onUpdate('model', v), 'text', 'e.g. Focus')}
      {field('mileageAtSale', 'Mileage at Sale', data.mileageAtSale, v => onUpdate('mileageAtSale', v), 'number', 'e.g. 45000')}
      {field('salePrice', 'Sale Price (£)', data.salePrice, v => onUpdate('salePrice', v), 'number', 'e.g. 12995')}
      {field('dateOfSale', 'Date of Sale', data.dateOfSale, v => onUpdate('dateOfSale', v), 'date')}
      {field('agreedDeliveryDate', 'Agreed Delivery Date', data.agreedDeliveryDate, v => onUpdate('agreedDeliveryDate', v), 'date')}
    </div>
  </div>
);

export default DSSStepVehicle;
