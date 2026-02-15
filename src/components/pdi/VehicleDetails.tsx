import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Car } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { VehicleDetailsData, FUEL_TYPES, TRANSMISSIONS } from '@/types/pdi';

interface Props {
  data: VehicleDetailsData;
  onUpdate: (field: keyof VehicleDetailsData, value: string | Date | undefined) => void;
}

export const VehicleDetails = ({ data, onUpdate }: Props) => {
  const field = (label: string, key: keyof VehicleDetailsData, opts?: { type?: string; placeholder?: string; required?: boolean; maxLength?: number }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label} {opts?.required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={opts?.type || 'text'}
        placeholder={opts?.placeholder || label}
        value={data[key] as string}
        onChange={(e) => {
          let val = e.target.value;
          if (opts?.type === 'number') val = val.replace(/[^0-9]/g, '');
          if (key === 'vin') val = val.toUpperCase().slice(0, 17);
          if (opts?.maxLength) val = val.slice(0, opts.maxLength);
          onUpdate(key, val);
        }}
        className="bg-card"
      />
      {key === 'vin' && data.vin && data.vin.length !== 17 && data.vin.length > 0 && (
        <p className="text-xs text-destructive">{data.vin.length}/17 characters</p>
      )}
    </div>
  );

  const dateField = (label: string, key: 'datePDI' | 'dateHandover') => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-card", !data[key] && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {data[key] ? format(data[key]!, 'dd/MM/yyyy') : 'Select date'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={data[key]} onSelect={(d) => onUpdate(key, d)} initialFocus className="p-3 pointer-events-auto" />
        </PopoverContent>
      </Popover>
    </div>
  );

  const selectField = (label: string, key: keyof VehicleDetailsData, options: string[]) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</Label>
      <Select value={data[key] as string} onValueChange={(v) => onUpdate(key, v)}>
        <SelectTrigger className="bg-card">
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <section className="pdi-section">
      <div className="pdi-section-header">
        <span className="pdi-section-number">2</span>
        <Car className="h-5 w-5 text-primary" />
        <h2 className="pdi-section-title">Vehicle Details</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {field('Make', 'make', { required: true })}
        {field('Model', 'model', { required: true })}
        {field('Variant', 'variant')}
        {field('Registration', 'registration', { required: true })}
        {field('VIN', 'vin', { placeholder: '17-character VIN' })}
        {field('Mileage at PDI', 'mileagePDI', { type: 'number' })}
        {field('Mileage at Handover', 'mileageHandover', { type: 'number' })}
        {selectField('Fuel Type', 'fuelType', FUEL_TYPES)}
        {selectField('Transmission', 'transmission', TRANSMISSIONS)}
        {field('Engine Size', 'engineSize', { placeholder: 'e.g. 2.0L' })}
        {dateField('Date of PDI', 'datePDI')}
        {dateField('Date of Handover', 'dateHandover')}
        {field('Technician Name', 'technicianName')}
        {field('Sales Executive', 'salesExecutive')}
      </div>
      {data.mileageHandover && data.mileagePDI && Number(data.mileageHandover) < Number(data.mileagePDI) && (
        <p className="text-sm text-destructive mt-3 font-medium">
          ⚠ Handover mileage cannot be less than PDI mileage
        </p>
      )}
    </section>
  );
};
