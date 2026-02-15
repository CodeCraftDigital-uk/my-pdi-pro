import { useState } from 'react';
import { usePDIForm } from '@/hooks/usePDIForm';
import { HeaderSection } from '@/components/pdi/HeaderSection';
import { VehicleDetails } from '@/components/pdi/VehicleDetails';
import { VehicleDiagram } from '@/components/pdi/VehicleDiagram';
import { TyreSection } from '@/components/pdi/TyreSection';
import { BrakeSection } from '@/components/pdi/BrakeSection';
import { MechanicalChecklist } from '@/components/pdi/MechanicalChecklist';
import { CRACompliance } from '@/components/pdi/CRACompliance';
import { CustomerHandover } from '@/components/pdi/CustomerHandover';
import { Button } from '@/components/ui/button';
import { Printer, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const Index = () => {
  const form = usePDIForm();
  const [errors, setErrors] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleGenerate = () => {
    const validationErrors = form.validate();
    setErrors(validationErrors);
    if (validationErrors.length > 0) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmAndPrint = () => {
    setShowConfirm(false);
    setShowSuccess(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handlePrintOnly = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pdi-container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 rounded-lg border border-destructive/30 bg-destructive/5 no-print">
            <div className="flex items-center gap-2 text-destructive font-semibold text-sm mb-2">
              <AlertCircle className="h-4 w-4" />
              Please correct the following:
            </div>
            <ul className="list-disc list-inside text-sm text-destructive/80 space-y-1">
              {errors.map((e, i) => <li key={i}>{e}</li>)}
            </ul>
          </div>
        )}

        <HeaderSection
          reportId={form.reportId}
          reportDate={form.reportDate}
        />

        <VehicleDetails
          data={form.vehicleDetails}
          onUpdate={form.updateVehicle}
        />

        <VehicleDiagram
          damages={form.damages}
          damageNotes={form.damageNotes}
          onAddDamage={form.addDamage}
          onRemoveDamage={form.removeDamage}
          onNotesChange={form.setDamageNotes}
        />

        <TyreSection
          measurements={form.tyreMeasurements}
          onUpdate={form.updateTyre}
        />

        <BrakeSection
          measurements={form.brakeMeasurements}
          onUpdate={form.updateBrake}
        />

        <MechanicalChecklist
          checks={form.mechanicalChecks}
          onToggle={form.toggleMechanical}
          notes={form.mechanicalNotes}
          onNotesChange={form.setMechanicalNotes}
        />

        <CRACompliance
          checks={form.craChecks}
          onToggle={form.toggleCRA}
          confirmed={form.craConfirmed}
          onConfirmChange={form.setCraConfirmed}
        />

        <CustomerHandover
          data={form.handover}
          onUpdate={form.updateHandover}
        />

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-border no-print">
          <Button onClick={handleGenerate} size="lg" className="gap-2">
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
              window.print();
            }}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download as PDF
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 no-print">
          Tip: Use your browser's "Save as PDF" option in the print dialog to download a PDF copy.
        </p>

        {/* Print footer */}
        <div className="print-footer">
          This document forms part of the dealership's compliance audit trail and does not remove or restrict statutory rights under the Consumer Rights Act 2015.
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
            <Button onClick={handleConfirmAndPrint}>Confirm & Print</Button>
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
