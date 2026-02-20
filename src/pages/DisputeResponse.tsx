import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  defaultDisputeForm,
  DISPUTE_AUTOSAVE_KEY,
  DisputeForm,
  SaleOverview,
  ComplaintDetails,
  TimeUsageFactors,
  EvidenceDocumentation,
  GeneratedResponse,
  ExportMeta,
} from '@/types/dispute';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Car,
  AlertTriangle,
  Clock,
  FolderOpen,
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle,
  Scale,
} from 'lucide-react';
import DRBStepSaleOverview from '@/components/dispute/DRBStepSaleOverview';
import DRBStepComplaint from '@/components/dispute/DRBStepComplaint';
import DRBStepTimeUsage from '@/components/dispute/DRBStepTimeUsage';
import DRBStepEvidence from '@/components/dispute/DRBStepEvidence';
import DRBStepAIGenerate from '@/components/dispute/DRBStepAIGenerate';
import DRBStepNextSteps from '@/components/dispute/DRBStepNextSteps';
import DRBStepExport from '@/components/dispute/DRBStepExport';
import DRBPrintLayout from '@/components/dispute/DRBPrintLayout';
import autoprovIcon from '@/assets/autoprov_icon.png';

const STEPS = [
  { id: 1, label: 'Sale Overview', icon: <Car size={16} /> },
  { id: 2, label: 'Complaint Details', icon: <AlertTriangle size={16} /> },
  { id: 3, label: 'Time & Usage', icon: <Clock size={16} /> },
  { id: 4, label: 'Evidence', icon: <FolderOpen size={16} /> },
  { id: 5, label: 'AI Response', icon: <Sparkles size={16} /> },
  { id: 6, label: 'Next Steps', icon: <ArrowRight size={16} /> },
  { id: 7, label: 'Export', icon: <Download size={16} /> },
];

function validateStep(step: number, form: DisputeForm): string[] {
  const errs: string[] = [];
  const { saleOverview: sale, complaintDetails: complaint, timeUsage } = form;

  if (step === 1) {
    if (!sale.vehicleRegistration) errs.push('Vehicle Registration is required');
    if (!sale.saleDate) errs.push('Date of Sale is required');
    if (!sale.salePrice) errs.push('Sale Price is required');
    if (!sale.mileageAtSale) errs.push('Mileage at Sale is required');
    if (sale.distanceSale === null) errs.push('Please indicate if this was a Distance Sale');
    if (sale.warrantyProvided === null) errs.push('Please indicate if a Warranty was provided');
    if (sale.financeInvolved === null) errs.push('Please indicate if Finance is involved');
  }
  if (step === 2) {
    if (!complaint.complaintType) errs.push('Please select a Complaint Type');
    if (!complaint.customerComplaintText.trim()) errs.push('Customer\'s complaint wording is required');
  }
  if (step === 3) {
    if (!timeUsage.currentMileage) errs.push('Current Mileage is required');
    if (timeUsage.vehicleDrivable === null) errs.push('Please indicate if the vehicle is drivable');
    if (timeUsage.repairAttempted === null) errs.push('Please indicate if a repair has been attempted');
  }
  // Steps 4–7: no hard requirements
  return errs;
}

const DisputeResponsePage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<DisputeForm>(() => {
    try {
      const saved = localStorage.getItem(DISPUTE_AUTOSAVE_KEY);
      return saved ? JSON.parse(saved) : defaultDisputeForm();
    } catch {
      return defaultDisputeForm();
    }
  });
  const [stepErrors, setStepErrors] = useState<string[]>([]);

  // Autosave
  useEffect(() => {
    try { localStorage.setItem(DISPUTE_AUTOSAVE_KEY, JSON.stringify(form)); } catch { /* noop */ }
  }, [form]);

  const update = <K extends keyof DisputeForm>(key: K, val: DisputeForm[K]) =>
    setForm(f => ({ ...f, [key]: val }));

  const updateSaleOverview = (field: keyof SaleOverview, value: string | boolean | null) =>
    setForm(f => ({ ...f, saleOverview: { ...f.saleOverview, [field]: value } }));

  const updateComplaint = (field: keyof ComplaintDetails, value: string) =>
    setForm(f => ({ ...f, complaintDetails: { ...f.complaintDetails, [field]: value } }));

  const updateTimeUsage = (field: keyof TimeUsageFactors, value: string | boolean | null) =>
    setForm(f => ({ ...f, timeUsage: { ...f.timeUsage, [field]: value } }));

  const updateEvidence = (field: keyof EvidenceDocumentation, value: boolean | string) =>
    setForm(f => ({ ...f, evidence: { ...f.evidence, [field]: value } }));

  const updateGenerated = (generated: GeneratedResponse) =>
    setForm(f => ({ ...f, generated }));

  const updateExport = (field: keyof ExportMeta, value: string) =>
    setForm(f => ({ ...f, exportMeta: { ...f.exportMeta, [field]: value } }));

  const handleNext = () => {
    const errs = validateStep(step, form);
    setStepErrors(errs);
    if (errs.length === 0) {
      setStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setStepErrors([]);
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    const originalTitle = document.title;
    const reg = form.saleOverview.vehicleRegistration.replace(/\s/g, '') || 'VEHICLE';
    const date = new Date().toISOString().slice(0, 10);
    document.title = `Dispute_Response_${reg}_${date}`;
    window.print();
    document.title = originalTitle;
  };

  const resetForm = () => {
    localStorage.removeItem(DISPUTE_AUTOSAVE_KEY);
    setForm(defaultDisputeForm());
    setStep(1);
    setStepErrors([]);
  };

  const progress = Math.round(((step - 1) / STEPS.length) * 100);

  return (
    <div className="min-h-screen bg-background">

      {/* Sticky top bar */}
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

      {/* Print layout */}
      <div className="print-only">
        <DRBPrintLayout form={form} />
      </div>

      {/* Screen layout */}
      <div className="no-print max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-36">

        {/* Page header */}
        <div
          className="rounded-2xl mb-8 px-6 py-6 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, #1a3558 0%, #1e3f6b 55%, #0f2240 100%)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(201,162,39,0.2)', border: '1px solid rgba(201,162,39,0.4)' }}
          >
            <Scale className="h-6 w-6" style={{ color: '#c9a227' }} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">Dispute Response Builder</h1>
            <p className="text-xs font-medium mt-0.5" style={{ color: '#c9a227' }}>
              Case ID: {form.caseId} · CRA 2015 Compliant Complaint Defence Generator
            </p>
          </div>
          <img src={autoprovIcon} alt="AutoProv" className="w-10 h-10 object-contain opacity-70 ml-auto hidden sm:block" />
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

        {/* Error banner */}
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

        {/* Step card */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          {step === 1 && <DRBStepSaleOverview data={form.saleOverview} onUpdate={updateSaleOverview} />}
          {step === 2 && <DRBStepComplaint data={form.complaintDetails} onUpdate={updateComplaint} />}
          {step === 3 && <DRBStepTimeUsage data={form.timeUsage} saleOverview={form.saleOverview} onUpdate={updateTimeUsage} />}
          {step === 4 && <DRBStepEvidence data={form.evidence} onUpdate={updateEvidence} />}
          {step === 5 && <DRBStepAIGenerate form={form} onUpdate={updateGenerated} />}
          {step === 6 && <DRBStepNextSteps generated={form.generated} />}
          {step === 7 && <DRBStepExport form={form} onUpdateExport={updateExport} onPrint={handlePrint} />}
        </div>
      </div>

      {/* Sticky bottom action bar */}
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
            <Button onClick={handlePrint} className="gap-2" style={{ background: '#1e3a5f' }}>
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground ml-auto"
            onClick={resetForm}
          >
            New Case
          </Button>
          <span className="text-xs text-muted-foreground hidden sm:block">
            Draft auto-saved
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisputeResponsePage;
