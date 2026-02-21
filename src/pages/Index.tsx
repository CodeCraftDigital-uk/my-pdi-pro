import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePDIForm } from '@/hooks/usePDIForm';
import { HeaderSection } from '@/components/pdi/HeaderSection';
import { VehicleDetails } from '@/components/pdi/VehicleDetails';
import { VehicleDiagram } from '@/components/pdi/VehicleDiagram';
import { TyreSection } from '@/components/pdi/TyreSection';
import { BrakeSection } from '@/components/pdi/BrakeSection';
import { MechanicalChecklist } from '@/components/pdi/MechanicalChecklist';
import { CRACompliance } from '@/components/pdi/CRACompliance';
import { CustomerHandover } from '@/components/pdi/CustomerHandover';
import { TermsAndConditions } from '@/components/pdi/TermsAndConditions';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Printer, Download, AlertCircle, CheckCircle2, ChevronUp, ChevronLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MECHANICAL_CHECKS } from '@/types/pdi';

const SECTION_IDS = {
  vehicle: 'section-vehicle',
  cosmetic: 'section-cosmetic',
  tyres: 'section-tyres',
  brakes: 'section-brakes',
  mechanical: 'section-mechanical',
  cra: 'section-cra',
  handover: 'section-handover',
  terms: 'section-terms',
};

const Index = () => {
  const navigate = useNavigate();
  const form = usePDIForm();
  const [errors, setErrors] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for "back to top" button
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Calculate completion progress
  const calcProgress = () => {
    let filled = 0;
    let total = 0;

    // Vehicle details required fields (4)
    const vReq = [form.vehicleDetails.make, form.vehicleDetails.model, form.vehicleDetails.registration];
    total += vReq.length;
    filled += vReq.filter(Boolean).length;

    // At least one tyre measurement (1)
    total += 1;
    if (form.tyreMeasurements.some(t => t.treadDepth !== '')) filled += 1;

    // Mechanical checks — count how many are checked out of total (as a single slot)
    const mechChecked = MECHANICAL_CHECKS.filter(c => form.mechanicalChecks[c]).length;
    total += 1;
    if (mechChecked > 0) filled += 1;

    // CRA confirmed (1)
    total += 1;
    if (form.craConfirmed) filled += 1;

    // Customer name (1)
    total += 1;
    if (form.handover.customerName) filled += 1;

    // T&C accepted (1)
    total += 1;
    if (form.tcAccepted) filled += 1;

    return Math.round((filled / total) * 100);
  };

  const progress = calcProgress();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleGenerate = () => {
    const validationErrors = form.validate();
    setErrors(validationErrors);
    if (validationErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setShowConfirm(true);
  };

  const printWithReportName = () => {
    const originalTitle = document.title;
    document.title = form.reportId;
    window.print();
    document.title = originalTitle;
  };

  const handleConfirmAndPrint = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => {
      printWithReportName();
    }, 300);
  };

  const handlePrintOnly = () => {
    printWithReportName();
  };

  // Map error text to section IDs for clickable jump links
  const errorSectionMap: Record<string, string> = {
    'Vehicle make': SECTION_IDS.vehicle,
    'Vehicle model': SECTION_IDS.vehicle,
    'Registration': SECTION_IDS.vehicle,
    'VIN': SECTION_IDS.vehicle,
    'mileage': SECTION_IDS.vehicle,
    'tyre': SECTION_IDS.tyres,
    'CRA': SECTION_IDS.cra,
    'Terms': SECTION_IDS.terms,
  };

  const getSectionForError = (err: string) => {
    for (const [key, sectionId] of Object.entries(errorSectionMap)) {
      if (err.toLowerCase().includes(key.toLowerCase())) return sectionId;
    }
    return null;
  };

  const requiredRemaining = (() => {
    const errs = form.validate();
    return errs.length;
  })();

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky progress bar */}
      <div className="sticky top-0 z-40 no-print bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-4">
          {/* Back to Portal */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors shrink-0 mr-2"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Portal
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Form completion</span>
              <span className="text-xs font-bold text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          {scrolled && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ChevronUp className="h-3.5 w-3.5" />
              Top
            </button>
          )}
        </div>
      </div>

      <div className="pdi-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
        {/* Error banner */}
        {errors.length > 0 && (
          <div className="mb-6 rounded-xl border-2 border-destructive/30 bg-destructive/5 overflow-hidden no-print">
            <div className="px-4 py-3 bg-destructive/10 flex items-center gap-2 border-b border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
              <span className="font-semibold text-sm text-destructive">
                {errors.length} issue{errors.length > 1 ? 's' : ''} to fix before generating
              </span>
            </div>
            <ul className="px-4 py-3 space-y-1.5">
              {errors.map((e, i) => {
                const sectionId = getSectionForError(e);
                return (
                  <li key={i} className="text-sm text-destructive/90 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive/60 shrink-0" />
                    {sectionId ? (
                      <button
                        onClick={() => scrollToSection(sectionId)}
                        className="hover:underline text-left"
                      >
                        {e} →
                      </button>
                    ) : (
                      e
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <HeaderSection
          reportId={form.reportId}
          reportDate={form.reportDate}
          dealershipName={form.vehicleDetails.dealershipName}
        />

        {/* Print group: Vehicle Details + Cosmetic Condition on same page */}
        <div className="print-page-group">
          <div id={SECTION_IDS.vehicle}>
            <VehicleDetails
              data={form.vehicleDetails}
              onUpdate={form.updateVehicle}
            />
          </div>

          <div id={SECTION_IDS.cosmetic}>
            <VehicleDiagram
              damages={form.damages}
              damageNotes={form.damageNotes}
              onAddDamage={form.addDamage}
              onRemoveDamage={form.removeDamage}
              onNotesChange={form.setDamageNotes}
            />
          </div>
        </div>

        {/* Print group: Tyres + Brakes + Mechanical + CRA */}
        <div className="print-page-group">
          <div id={SECTION_IDS.tyres}>
            <TyreSection
              measurements={form.tyreMeasurements}
              onUpdate={form.updateTyre}
            />
          </div>

          <div id={SECTION_IDS.brakes}>
            <BrakeSection
              measurements={form.brakeMeasurements}
              onUpdate={form.updateBrake}
            />
          </div>

          <div id={SECTION_IDS.mechanical}>
            <MechanicalChecklist
              checks={form.mechanicalChecks}
              onToggle={form.toggleMechanical}
              notes={form.mechanicalNotes}
              onNotesChange={form.setMechanicalNotes}
            />
          </div>

          <div id={SECTION_IDS.cra}>
            <CRACompliance
              checks={form.craChecks}
              onToggle={form.toggleCRA}
              confirmed={form.craConfirmed}
              onConfirmChange={form.setCraConfirmed}
            />
          </div>
        </div>

        {/* Print group: Handover + Signatures on same page */}
        <div className="print-page-group">
          <div id={SECTION_IDS.handover}>
            <CustomerHandover
              data={form.handover}
              onUpdate={form.updateHandover}
            />
          </div>
        </div>

        {/* Print group: Terms & Conditions on its own page */}
        <div className="print-page-group">
          <div id={SECTION_IDS.terms}>
            <TermsAndConditions
              accepted={form.tcAccepted}
              onAcceptChange={form.setTcAccepted}
              customerName={form.handover.customerName}
            />
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 no-print">
          Tip: Use your browser's "Save as PDF" option in the print dialog to download a PDF copy.
        </p>

        {/* Print footer */}
        <div className="print-footer">
          This report was generated using the AutoProv Platform (autexa.ai). The content of this report is the responsibility of the issuing business.
          <br />
          Used Vehicle PDI Report · {form.reportId} · {form.reportDate.toLocaleDateString('en-GB')}
        </div>
      </div>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 no-print bg-background/95 backdrop-blur border-t border-border shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center gap-3">
          <Button onClick={handleGenerate} size="lg" className="gap-2 shadow-sm">
            <CheckCircle2 className="h-4 w-4" />
            Generate Report
          </Button>
          <Button onClick={handlePrintOnly} variant="outline" size="lg" className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
          <Button
            onClick={() => {
              const validationErrors = form.validate();
              if (validationErrors.length > 0) {
                setErrors(validationErrors);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              printWithReportName();
            }}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <div className="ml-auto text-right hidden sm:block">
            {requiredRemaining > 0 ? (
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">{requiredRemaining}</span> required field{requiredRemaining > 1 ? 's' : ''} remaining
              </p>
            ) : (
              <p className="text-xs text-success font-semibold flex items-center gap-1 justify-end">
                <CheckCircle2 className="h-3.5 w-3.5" /> Ready to generate
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Report</DialogTitle>
            <DialogDescription>
              You are confirming the above information is accurate at time of handover. This action will generate the printable report.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>Cancel</Button>
            <Button onClick={handleConfirmAndPrint}>Confirm &amp; Print</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success indicator */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 className="h-12 w-12 text-success" />
            <DialogTitle>Report Generated</DialogTitle>
            <DialogDescription>
              Your PDI report has been validated and is ready for printing.
            </DialogDescription>
          </div>
          <DialogFooter className="justify-center">
            <Button onClick={() => setShowSuccess(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
