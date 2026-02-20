import { DisputeForm, ExportMeta, daysSinceSale } from '@/types/dispute';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Printer, Copy, CheckCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import autoprovIcon from '@/assets/autoprov_icon.png';

interface Props {
  form: DisputeForm;
  onUpdateExport: (field: keyof ExportMeta, value: string) => void;
  onPrint: () => void;
}

const DRBStepExport = ({ form, onUpdateExport, onPrint }: Props) => {
  const [copied, setCopied] = useState(false);
  const hasResponse = !!form.generated.emailResponse;
  const days = daysSinceSale(form.saleOverview.saleDate);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText(form.generated.emailResponse);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Download className="h-5 w-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-foreground">Export & Save</h2>
        </div>
        <p className="text-sm text-muted-foreground">Add dealer details for the report, then export your Dispute Response Pack.</p>
      </div>

      {/* Case summary card */}
      <div className="rounded-xl border border-border bg-secondary/20 p-4">
        <div className="flex items-center gap-3 mb-3">
          <img src={autoprovIcon} alt="AutoProv" className="w-6 h-6 object-contain opacity-80" />
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Case Reference</p>
            <p className="text-sm font-mono font-bold text-foreground">{form.caseId}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Vehicle:</span>{' '}
            <span className="font-medium">{form.saleOverview.vehicleRegistration || '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Days Since Sale:</span>{' '}
            <span className="font-medium">{days}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Complaint:</span>{' '}
            <span className="font-medium capitalize">{form.complaintDetails.complaintType.replace(/-/g, ' ') || '—'}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Risk:</span>{' '}
            <span className={`font-semibold ${
              form.generated.riskLevel === 'low' ? 'text-emerald-600' :
              form.generated.riskLevel === 'moderate' ? 'text-amber-600' :
              form.generated.riskLevel === 'high' ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {form.generated.riskLevel ? form.generated.riskLevel.charAt(0).toUpperCase() + form.generated.riskLevel.slice(1) : 'Not assessed'}
            </span>
          </div>
        </div>
      </div>

      {/* Dealer details */}
      <div className="space-y-4">
        <p className="text-sm font-semibold text-foreground">Dealer Details for Report</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="dealerName" className="text-sm font-medium">Dealer / Business Name</Label>
            <Input
              id="dealerName"
              value={form.exportMeta.dealerName}
              onChange={(e) => onUpdateExport('dealerName', e.target.value)}
              placeholder="e.g. Smith's Motor Group"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dealerEmail" className="text-sm font-medium">Dealer Email</Label>
            <Input
              id="dealerEmail"
              type="email"
              value={form.exportMeta.dealerEmail}
              onChange={(e) => onUpdateExport('dealerEmail', e.target.value)}
              placeholder="e.g. info@smithsmotors.co.uk"
            />
          </div>
        </div>
      </div>

      {/* Export actions */}
      {!hasResponse ? (
        <div className="rounded-xl border-2 border-dashed border-border p-6 text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Complete Step 5 to generate a response before exporting.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">Response Ready to Export</p>
              <p className="text-xs text-emerald-700 mt-0.5">Your dispute response pack is complete. Use the options below to export.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={onPrint}
              className="gap-2 py-5"
              style={{ background: '#1e3a5f' }}
            >
              <Printer className="h-4 w-4" /> Print / PDF
            </Button>
            <Button onClick={handleCopyEmail} variant="outline" className="gap-2 py-5">
              {copied ? <CheckCheck className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy Email'}
            </Button>
            <Button onClick={onPrint} variant="outline" className="gap-2 py-5">
              <Download className="h-4 w-4" /> Save PDF
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            PDF filename: Dispute_Response_{form.saleOverview.vehicleRegistration || 'VEHICLE'}_{new Date().toISOString().slice(0, 10)}.pdf
          </p>
        </div>
      )}
    </div>
  );
};

export default DRBStepExport;
