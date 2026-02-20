import { GeneratedResponse } from '@/types/dispute';
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';

interface Props {
  generated: GeneratedResponse;
}

const RISK_CONFIG = {
  low: {
    label: '🟢 Low Risk',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
    desc: 'Based on the information provided, your legal exposure is low. Maintain professional communication and document all interactions.',
  },
  moderate: {
    label: '🟠 Moderate Risk',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
    desc: 'There are moderate risk factors present. Follow the suggested steps carefully and consider seeking further advice if the situation escalates.',
  },
  high: {
    label: '🔴 High Legal Exposure',
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: <XCircle className="h-5 w-5 text-red-600" />,
    desc: 'This case carries significant legal risk. Respond promptly, follow the suggested steps strictly, and consider professional legal advice.',
  },
};

const DRBStepNextSteps = ({ generated }: Props) => {
  if (!generated.emailResponse) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Suggested Next Steps</h2>
          <p className="text-sm text-muted-foreground mt-1">Complete Step 5 to generate your AI response — next steps will appear here automatically.</p>
        </div>
        <div className="rounded-xl border border-border bg-secondary/20 p-8 text-center">
          <ArrowRight className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No response generated yet</p>
        </div>
      </div>
    );
  }

  const riskConf = generated.riskLevel ? RISK_CONFIG[generated.riskLevel] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-foreground">Suggested Next Steps</h2>
        <p className="text-sm text-muted-foreground mt-1">Structured recommendations based on your case data and legal timeline.</p>
      </div>

      {/* Risk indicator */}
      {riskConf && (
        <div className={`rounded-xl border px-5 py-4 flex items-start gap-3 ${riskConf.bg}`}>
          {riskConf.icon}
          <div>
            <p className={`text-sm font-bold ${riskConf.text}`}>{riskConf.label}</p>
            <p className={`text-xs mt-1 leading-relaxed ${riskConf.text} opacity-80`}>{riskConf.desc}</p>
          </div>
        </div>
      )}

      {/* Next steps list */}
      {generated.suggestedNextSteps.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Recommended Actions:</p>
          <div className="space-y-2">
            {generated.suggestedNextSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                  style={{ background: '#1e3a5f' }}
                >
                  {i + 1}
                </div>
                <p className="text-sm text-foreground leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal timeline reminder */}
      {generated.legalTimeline && (
        <div className="rounded-xl border border-border bg-secondary/20 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Legal Framework Applied</p>
          <p className="text-sm text-foreground">
            {generated.legalTimeline === 'under-30' && 'Consumer Rights Act 2015 — Short-term right to reject period (≤30 days). Customer may be entitled to full refund subject to inspection confirming a fault was present at point of sale.'}
            {generated.legalTimeline === '30-to-6-months' && 'Consumer Rights Act 2015 — Dealer repair/replace phase (30 days–6 months). You have one opportunity to repair or replace before a refund can be demanded. Fault presumed present at time of sale during this period.'}
            {generated.legalTimeline === 'over-6-months' && 'Consumer Rights Act 2015 — Beyond the 6-month period. The burden of proof now rests with the consumer to demonstrate the fault existed at the time of sale.'}
          </p>
        </div>
      )}

      <div className="rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This tool provides compliance guidance only. For complex disputes or court proceedings, always seek independent legal advice from a qualified solicitor.
        </p>
      </div>
    </div>
  );
};

export default DRBStepNextSteps;
