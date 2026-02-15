export interface VehicleDetailsData {
  make: string;
  model: string;
  variant: string;
  registration: string;
  vin: string;
  mileagePDI: string;
  mileageHandover: string;
  fuelType: string;
  transmission: string;
  engineSize: string;
  datePDI: Date | undefined;
  dateHandover: Date | undefined;
  technicianName: string;
  salesExecutive: string;
}

export type DamageType = 'scratch' | 'dent' | 'chip' | 'scuff' | 'crack';

export interface Damage {
  id: string;
  panel: string;
  view: string;
  type: DamageType;
}

export interface TyreMeasurement {
  position: string;
  treadDepth: string;
}

export interface BrakeMeasurement {
  component: string;
  measured: string;
  minimum: string;
}

export interface HandoverData {
  vehicleInspected: boolean;
  cosmeticAccepted: boolean;
  mileageConfirmed: boolean;
  keysReceived: string;
  v5cPresent: boolean;
  serviceHistoryPresent: boolean;
  serviceHistoryType: string;
  motExpiryDate: string;
  documentationReceived: boolean;
  customerName: string;
  salesRepName: string;
  customerSignature: string;
  salesRepSignature: string;
}

export const DAMAGE_COLORS: Record<DamageType, string> = {
  scratch: '#f59e0b',
  dent: '#ef4444',
  chip: '#3b82f6',
  scuff: '#8b5cf6',
  crack: '#ec4899',
};

export const DAMAGE_LABELS: Record<DamageType, string> = {
  scratch: 'S',
  dent: 'D',
  chip: 'C',
  scuff: 'U',
  crack: 'K',
};

export const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid', 'LPG'];
export const TRANSMISSIONS = ['Manual', 'Automatic', 'Semi-Automatic', 'CVT'];

export const MECHANICAL_CHECKS = [
  'Engine starts smoothly',
  'No excessive smoke',
  'No fluid leaks',
  'Clutch operation correct',
  'Gearbox smooth',
  'Steering aligned',
  'Suspension quiet',
  'Brakes operating correctly',
  'No dashboard warning lights',
  'Road test completed',
];

export const CRA_CHECKS = [
  'Vehicle of satisfactory quality (age/mileage considered)',
  'Fit for purpose',
  'As described in advert',
  'Known faults disclosed',
  '30-day right to reject explained',
  'Warranty terms explained',
  'Finance rights explained (if applicable)',
  'Distance sale cancellation rights explained (if applicable)',
];
