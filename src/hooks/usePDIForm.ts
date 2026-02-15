import { useState, useCallback } from 'react';
import { VehicleDetailsData, Damage, TyreMeasurement, BrakeMeasurement, HandoverData } from '@/types/pdi';

const generateReportId = () => {
  const d = new Date();
  const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PDI-${dateStr}-${rand}`;
};

export const usePDIForm = () => {
  const [reportId] = useState(generateReportId);
  const [reportDate] = useState(new Date());
  const [logo, setLogo] = useState<string | null>(null);

  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetailsData>({
    make: '', model: '', variant: '', registration: '', vin: '',
    mileagePDI: '', mileageHandover: '', fuelType: '', transmission: '',
    engineSize: '', datePDI: undefined, dateHandover: undefined,
    technicianName: '', salesExecutive: '',
  });

  const [damages, setDamages] = useState<Damage[]>([]);
  const [damageNotes, setDamageNotes] = useState('');

  const [tyreMeasurements, setTyreMeasurements] = useState<TyreMeasurement[]>([
    { position: 'Front Left (FL)', treadDepth: '' },
    { position: 'Front Right (FR)', treadDepth: '' },
    { position: 'Rear Left (RL)', treadDepth: '' },
    { position: 'Rear Right (RR)', treadDepth: '' },
    { position: 'Spare (if fitted)', treadDepth: '' },
  ]);

  const [brakeMeasurements, setBrakeMeasurements] = useState<BrakeMeasurement[]>([
    { component: 'Front Discs', measured: '', minimum: '' },
    { component: 'Rear Discs', measured: '', minimum: '' },
    { component: 'Front Pads', measured: '', minimum: '' },
    { component: 'Rear Pads', measured: '', minimum: '' },
  ]);

  const [mechanicalChecks, setMechanicalChecks] = useState<Record<string, boolean>>({});
  const [mechanicalNotes, setMechanicalNotes] = useState('');
  const [craChecks, setCraChecks] = useState<Record<string, boolean>>({});
  const [craConfirmed, setCraConfirmed] = useState(false);
  const [tcAccepted, setTcAccepted] = useState(false);

  const [handover, setHandover] = useState<HandoverData>({
    vehicleInspected: false, cosmeticAccepted: false, mileageConfirmed: false,
    keysReceived: '', v5cPresent: false, serviceHistoryPresent: false,
    serviceHistoryType: '', documentationReceived: false,
    customerName: '', salesRepName: '',
    customerSignature: '', salesRepSignature: '',
  });

  const addDamage = useCallback((damage: Omit<Damage, 'id'>) => {
    setDamages(prev => [...prev, { ...damage, id: crypto.randomUUID() }]);
  }, []);

  const removeDamage = useCallback((id: string) => {
    setDamages(prev => prev.filter(d => d.id !== id));
  }, []);

  const updateVehicle = useCallback((field: keyof VehicleDetailsData, value: string | Date | undefined) => {
    setVehicleDetails(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateTyre = useCallback((index: number, treadDepth: string) => {
    setTyreMeasurements(prev => prev.map((t, i) => i === index ? { ...t, treadDepth } : t));
  }, []);

  const updateBrake = useCallback((index: number, field: 'measured' | 'minimum', value: string) => {
    setBrakeMeasurements(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b));
  }, []);

  const toggleMechanical = useCallback((check: string) => {
    setMechanicalChecks(prev => ({ ...prev, [check]: !prev[check] }));
  }, []);

  const toggleCRA = useCallback((check: string) => {
    setCraChecks(prev => ({ ...prev, [check]: !prev[check] }));
  }, []);

  const updateHandover = useCallback((field: keyof HandoverData, value: string | boolean) => {
    setHandover(prev => ({ ...prev, [field]: value }));
  }, []);

  const validate = useCallback((): string[] => {
    const errors: string[] = [];
    if (!vehicleDetails.make) errors.push('Vehicle make is required');
    if (!vehicleDetails.model) errors.push('Vehicle model is required');
    if (!vehicleDetails.registration) errors.push('Registration is required');
    if (vehicleDetails.vin && vehicleDetails.vin.length !== 17) errors.push('VIN must be exactly 17 characters');
    if (vehicleDetails.mileageHandover && vehicleDetails.mileagePDI &&
        Number(vehicleDetails.mileageHandover) < Number(vehicleDetails.mileagePDI)) {
      errors.push('Handover mileage cannot be less than PDI mileage');
    }
    if (!craConfirmed) errors.push('CRA 2015 declaration must be confirmed');
    if (!tcAccepted) errors.push('Terms & Conditions must be accepted');
    const hasAnyTyre = tyreMeasurements.some(t => t.treadDepth !== '');
    if (!hasAnyTyre) errors.push('At least one tyre measurement is required');
    return errors;
  }, [vehicleDetails, craConfirmed, tcAccepted, tyreMeasurements]);

  return {
    reportId, reportDate, logo, setLogo,
    vehicleDetails, updateVehicle,
    damages, addDamage, removeDamage, damageNotes, setDamageNotes,
    tyreMeasurements, updateTyre,
    brakeMeasurements, updateBrake,
    mechanicalChecks, toggleMechanical, mechanicalNotes, setMechanicalNotes,
    craChecks, toggleCRA, craConfirmed, setCraConfirmed,
    tcAccepted, setTcAccepted,
    handover, updateHandover,
    validate,
  };
};
