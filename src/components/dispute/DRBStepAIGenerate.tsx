import { useState } from 'react';
import { DisputeForm, daysSinceSale, mileageSinceSale, legalTimeline } from '@/types/dispute';
import { GeneratedResponse } from '@/types/dispute';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, Copy, CheckCheck, Mail, MessageSquare, FileText, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props {
  form: DisputeForm;
  onUpdate: (generated: GeneratedResponse) => void;
}

const RISK_CONFIG = {
  low: { label: '🟢 Low Risk', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  moderate: { label: '🟠 Moderate Risk', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  high: { label: '🔴 High Legal Exposure', color: 'bg-red-100 text-red-800 border-red-300' },
};

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors"
    >
      {copied ? <CheckCheck className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
};

const DRBStepAIGenerate = ({ form, onUpdate }: Props) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasGenerated = !!form.generated.emailResponse;

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    const days = daysSinceSale(form.saleOverview.saleDate);
    const miles = mileageSinceSale(form.saleOverview.mileageAtSale, form.timeUsage.currentMileage);
    const timeline = legalTimeline(days);

    try {
      const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
      const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const response = await fetch(`${SUPABASE_URL}/functions/v1/dispute-response`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({
          vehicleRegistration: form.saleOverview.vehicleRegistration,
          saleDate: form.saleOverview.saleDate,
          salePrice: form.saleOverview.salePrice,
          distanceSale: form.saleOverview.distanceSale,
          warrantyProvided: form.saleOverview.warrantyProvided,
          financeInvolved: form.saleOverview.financeInvolved,
          mileageAtSale: form.saleOverview.mileageAtSale,
          complaintType: form.complaintDetails.complaintType,
          customerComplaintText: form.complaintDetails.customerComplaintText,
          daysSinceSale: days,
          currentMileage: form.timeUsage.currentMileage,
          mileageSinceSale: miles,
          vehicleDrivable: form.timeUsage.vehicleDrivable,
          repairAttempted: form.timeUsage.repairAttempted,
          legalTimeline: timeline,
          evidence: form.evidence,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${response.status})`);
      }

      const data = await response.json();

      onUpdate({
        emailResponse: data.emailResponse || '',
        smsVersion: data.smsVersion || '',
        internalSummary: data.internalSummary || '',
        riskLevel: data.riskLevel || null,
        legalTimeline: timeline,
        suggestedNextSteps: data.suggestedNextSteps || [],
      });

      toast({ title: 'Response generated', description: 'Your dispute response is ready to review.' });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Generation failed';
      setError(msg);
      toast({ title: 'Generation failed', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const { generated } = form;
  const riskConf = generated.riskLevel ? RISK_CONFIG[generated.riskLevel] : null;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-[#1e3a5f]" />
          <h2 className="text-lg font-bold text-foreground">AI Response Generation</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          The AI will analyse your case data and generate a legally-aligned response. All outputs are neutral, professional, and CRA 2015 compliant.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <Button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full gap-2 py-5 text-base font-semibold"
        style={{ background: '#1e3a5f' }}
      >
        {loading ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Generating Response…</>
        ) : (
          <><Sparkles className="h-5 w-5" /> {hasGenerated ? 'Regenerate Response' : 'Generate Dispute Response'}</>
        )}
      </Button>

      {hasGenerated && (
        <div className="space-y-5">
          {/* Risk level */}
          {riskConf && (
            <div className={`rounded-xl border px-4 py-3 flex items-center justify-between ${riskConf.color}`}>
              <span className="text-sm font-bold">{riskConf.label}</span>
              <span className="text-xs opacity-75">Case Risk Assessment</span>
            </div>
          )}

          {/* Email response */}
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#1e3a5f]" />
                <span className="text-sm font-bold text-foreground">Email Response</span>
              </div>
              <CopyButton text={generated.emailResponse} />
            </div>
            <div className="p-4">
              <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{generated.emailResponse}</p>
            </div>
          </div>

          {/* SMS version */}
          {generated.smsVersion && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#1e3a5f]" />
                  <span className="text-sm font-bold text-foreground">SMS Version</span>
                  <span className="text-xs text-muted-foreground">({generated.smsVersion.length} chars)</span>
                </div>
                <CopyButton text={generated.smsVersion} />
              </div>
              <div className="p-4">
                <p className="text-sm text-foreground leading-relaxed">{generated.smsVersion}</p>
              </div>
            </div>
          )}

          {/* Internal summary */}
          {generated.internalSummary && (
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-secondary/40 border-b border-border">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[#1e3a5f]" />
                  <span className="text-sm font-bold text-foreground">Internal Case Summary</span>
                  <span className="text-xs text-muted-foreground">Audit use only — do not share with customer</span>
                </div>
                <CopyButton text={generated.internalSummary} />
              </div>
              <div className="p-4">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{generated.internalSummary}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DRBStepAIGenerate;
