import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  defaultForm,
  AUTOSAVE_KEY,
  DistanceSaleForm,
  DealerDetails,
  DSSVehicleDetails,
  PreSaleCondition,
  DistanceSaleTerms,
  CoolingOffConfirmation,
  DeliverySignOff,
  RefundPolicyAck,
} from '@/types/distanceSale';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  Car,
  ClipboardList,
  Scale,
  Timer,
  Truck,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import DSSStepDealer from '@/components/dss/DSSStepDealer';
import DSSStepVehicle from '@/components/dss/DSSStepVehicle';
import DSSStepPreSale from '@/components/dss/DSSStepPreSale';
import DSSStepTerms from '@/components/dss/DSSStepTerms';
import DSSStepCoolingOff from '@/components/dss/DSSStepCoolingOff';
import DSSStepDelivery from '@/components/dss/DSSStepDelivery';
import DSSStepRefundPolicy from '@/components/dss/DSSStepRefundPolicy';
import DSSPrintLayout from '@/components/dss/DSSPrintLayout';
import autoprovIcon from '@/assets/autoprov_icon.png';

const STEPS = [
  { id: 1, label: 'Dealer Details', icon: <Building2 size={16} /> },
  { id: 2, label: 'Vehicle Details', icon: <Car size={16} /> },
  { id: 3, label: 'Pre-Sale Condition', icon: <ClipboardList size={16} /> },
  { id: 4, label: 'Distance Sale Terms', icon: <Scale size={16} /> },
  { id: 5, label: 'Cooling-Off', icon: <Timer size={16} /> },
  { id: 6, label: 'Delivery Sign-Off', icon: <Truck size={16} /> },
  { id: 7, label: 'Refund Policy', icon: <ShieldCheck size={16} /> },
];

function validateStep(step: number, form: DistanceSaleForm): string[] {
  const errs: string[] = [];
  if (step === 1) {
    if (!form.dealer.businessName) errs.push('Business Name is required');
    if (!form.dealer.tradingAddress) errs.push('Trading Address is required');
    if (!form.dealer.contactNumber) errs.push('Contact Number is required');
    if (!form.dealer.email) errs.push('Email is required');
  }
  if (step === 2) {
    if (!form.vehicle.registration) errs.push('Registration is required');
    if (!form.vehicle.make) errs.push('Make is required');
    if (!form.vehicle.model) errs.push('Model is required');
    if (!form.vehicle.mileageAtSale) errs.push('Mileage at Sale is required');
    if (!form.vehicle.salePrice) errs.push('Sale Price is required');
    if (!form.vehicle.dateOfSale) errs.push('Date of Sale is required');
  }
  if (step === 3) {
    const all = [
      form.preSale.vehicleInspected,
      form.preSale.knownDefectsDisclosed,
      form.preSale.cosmeticImperfectionsDisclosed,
      form.preSale.warningLightsDeclared,
      form.preSale.serviceHistoryExplained,
    ];
    if (!all.every(Boolean)) errs.push('All mandatory pre-sale declarations must be confirmed');
    if (!form.preSale.dealerSignature) errs.push('Dealer / Inspector name is required');
  }
  if (step === 4) {
    if (!form.terms.termsPresented) errs.push('CRA terms must be confirmed as presented to the customer');
  }
  if (step === 5) {
    if (!form.coolingOff.coolingOffStartDate) errs.push('Cooling-off start date is required');
    if (!form.coolingOff.customerAcknowledgesCoolingOff) errs.push('Customer cooling-off acknowledgement is required');
  }
  if (step === 6) {
    if (!form.delivery.deliveryDate) errs.push('Delivery date is required');
    if (!form.delivery.deliveredBy) errs.push('Delivered by must be selected');
    if (!form.delivery.customerConfirmsCondition) errs.push('Customer condition confirmation is required');
  }
  if (step === 7) {
    if (!form.refundPolicy.confirmed) errs.push('Customer must confirm the refund policy acknowledgement');
  }
  return errs;
}

const DistanceSalePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DistanceSaleForm>(() => {
    try {
      const saved = localStorage.getItem(AUTOSAVE_KEY);
      return saved ? JSON.parse(saved) : defaultForm();
    } catch {
      return defaultForm();
    }
  });
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  // Autosave
  useEffect(() => {
    try { localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(form)); } catch { /* ignore */ }
  }, [form]);

  const updateDealer = (field: keyof DealerDetails, value: string) =>
    setForm(f => ({ ...f, dealer: { ...f.dealer, [field]: value } }));

  const updateVehicle = (field: keyof DSSVehicleDetails, value: string) =>
    setForm(f => ({ ...f, vehicle: { ...f.vehicle, [field]: value } }));

  const updatePreSale = (field: keyof PreSaleCondition, value: boolean | string) =>
    setForm(f => ({ ...f, preSale: { ...f.preSale, [field]: value } }));

  const updateTerms = (field: keyof DistanceSaleTerms, value: boolean) =>
    setForm(f => ({ ...f, terms: { ...f.terms, [field]: value } }));

  const updateCoolingOff = (field: keyof CoolingOffConfirmation, value: boolean | string) =>
    setForm(f => ({ ...f, coolingOff: { ...f.coolingOff, [field]: value } }));

  const updateDelivery = (field: keyof DeliverySignOff, value: boolean | string) =>
    setForm(f => ({ ...f, delivery: { ...f.delivery, [field]: value } }));

  const updateRefundPolicy = (field: keyof RefundPolicyAck, value: boolean) =>
    setForm(f => ({ ...f, refundPolicy: { ...f.refundPolicy, [field]: value } }));

  const handleNext = () => {
    const errs = validateStep(step, form);
    setStepErrors(errs);
    if (errs.length === 0) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  };

  const handleBack = () => {
    setStepErrors([]);
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const reg = form.vehicle.registration.replace(/\s/g, '') || 'UNKNOWN';
    const date = form.vehicle.dateOfSale || new Date().toISOString().slice(0, 10);
    document.title = `Distance_Sale_Pack_${reg}_${date}`;
    window.print();
    document.title = originalTitle;
  };

  const resetForm = () => {
    localStorage.removeItem(AUTOSAVE_KEY);
    setForm(defaultForm());
    setStep(1);
    setStepErrors([]);
  };

  const progress = Math.round(((step - 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-background">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 no-print bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Portal
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                Step {step} of {STEPS.length} — {STEPS[step - 1].label}
              </span>
              <span className="text-xs font-bold text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </div>

      {/* ── Print layout (hidden on screen) ── */}
      <div className="print-only">
        <DSSPrintLayout form={form} />
      </div>

      {/* ── Screen layout ── */}
      <div className="no-print max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-36">

        {/* Page header */}
        <div
          className="rounded-2xl mb-8 px-6 py-6 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1a3558 0%, #1e3f6b 55%, #0f2240 100%)' }}
        >
          <img src={autoprovIcon} alt="AutoProv" className="w-12 h-12 object-contain opacity-90" />
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Digital Distance Sale Pack</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#c9a227' }}>
              Pack ID: {form.packId} · CRA 2015 &amp; Consumer Contracts Regulations 2013 Compliant
            </p>
          </div>
        </div>

        {/* Step nav pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {STEPS.map(s => (
            <button
              key={s.id}
              onClick={() => { setStepErrors([]); setStep(s.id); }}
              className={[
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150',
                step === s.id
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f] shadow-md'
                  : s.id < step
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-muted text-muted-foreground border-border',
              ].join(' ')}
            >
              {s.id < step ? <CheckCircle2 size={11} /> : s.icon}
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{s.id}</span>
            </button>
          ))}
        </div>

        {/* Step error banner */}
        {stepErrors.length > 0 && (
          <div className="mb-6 rounded-xl border-2 border-destructive/30 bg-destructive/5 overflow-hidden">
            <div className="px-4 py-3 bg-destructive/10 flex items-center gap-2 border-b border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <span className="font-semibold text-sm text-destructive">
                {stepErrors.length} item{stepErrors.length > 1 ? 's' : ''} to complete before continuing
              </span>
            </div>
            <ul className="px-4 py-3 space-y-1.5">
              {stepErrors.map((e, i) => (
                <li key={i} className="text-sm text-destructive/90 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Step content card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          {step === 1 && <DSSStepDealer data={form.dealer} onUpdate={updateDealer} />}
          {step === 2 && <DSSStepVehicle data={form.vehicle} onUpdate={updateVehicle} />}
          {step === 3 && <DSSStepPreSale data={form.preSale} onUpdate={updatePreSale} />}
          {step === 4 && <DSSStepTerms data={form.terms} onUpdate={updateTerms} />}
          {step === 5 && <DSSStepCoolingOff data={form.coolingOff} onUpdate={updateCoolingOff} />}
          {step === 6 && <DSSStepDelivery data={form.delivery} onUpdate={updateDelivery} />}
          {step === 7 && (
            <>
              <DSSStepRefundPolicy data={form.refundPolicy} onUpdate={updateRefundPolicy} />
              {/* Generate summary on last step */}
              {validateStep(7, form).length === 0 && (
                <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-600 mt-0.5 shrink-0" size={20} />
                  <div>
                    <p className="font-semibold text-emerald-800 text-sm">Pack ready to generate</p>
                    <p className="text-xs text-emerald-700 mt-0.5">All sections complete. Use the buttons below to print or download your Distance Sale Pack as a PDF.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Sticky bottom action bar ── */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}
          {step < STEPS.length && (
            <Button onClick={handleNext} className="gap-2" style={{ background: '#1e3a5f' }}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          {step === STEPS.length && (
            <>
              <Button onClick={handlePrint} className="gap-2" style={{ background: '#1e3a5f' }}>
                <Printer className="h-4 w-4" /> Print Pack
              </Button>
              <Button onClick={handlePrint} variant="outline" className="gap-2">
                <Download className="h-4 w-4" /> Download PDF
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground ml-auto"
            onClick={resetForm}
          >
            Start New Pack
          </Button>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Draft auto-saved
          </span>
        </div>
      </div>
    </div>
  );
};

export default DistanceSalePage;
