import { DisputeForm, daysSinceSale, mileageSinceSale } from '@/types/dispute';
import autoprovIcon from '@/assets/autoprov_icon.png';

interface Props {
  form: DisputeForm;
}

const COMPLAINT_LABELS: Record<string, string> = {
  'mechanical-fault': 'Mechanical Fault',
  'electrical-fault': 'Electrical Fault',
  'cosmetic-complaint': 'Cosmetic Complaint',
  'not-as-described': '"Not as Described" Claim',
  'rejection-under-30': 'Rejection Request (Under 30 Days)',
  'rejection-over-30': 'Rejection Request (Over 30 Days)',
  'refund-demand': 'Refund Demand',
  'finance-escalation': 'Finance Company Escalation',
  'general-dissatisfaction': 'General Dissatisfaction',
};

const Row = ({ label, value }: { label: string; value: string | boolean | null }) => (
  <div className="drb-row">
    <span className="drb-label">{label}</span>
    <span className="drb-value">{value === true ? 'Yes' : value === false ? 'No' : value || '—'}</span>
  </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="drb-section-title">{children}</div>
);

const DRBPrintLayout = ({ form }: Props) => {
  const days = daysSinceSale(form.saleOverview.saleDate);
  const miles = mileageSinceSale(form.saleOverview.mileageAtSale, form.timeUsage.currentMileage);
  const now = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  const { saleOverview: sale, complaintDetails: complaint, timeUsage, evidence, generated, exportMeta } = form;

  return (
    <div className="drb-print-root">

      {/* Header */}
      <div className="drb-header">
        <div className="drb-header-left">
          <p className="drb-dealer-name">{exportMeta.dealerName || 'Dealer Name'}</p>
          {exportMeta.dealerEmail && <p className="drb-dealer-email">{exportMeta.dealerEmail}</p>}
        </div>
        <div className="drb-header-right">
          <div style={{ display: 'flex', alignItems: 'center', gap: '3pt' }}>
            <img src={autoprovIcon} alt="AutoProv" className="drb-logo" />
            <p className="drb-brand">AutoProv</p>
          </div>
          <p className="autoprov-attribution">Generated using the AutoProv Platform</p>
        </div>
      </div>

      <div className="drb-title-bar">
        <h1 className="drb-title">⚖️ Dispute Response Pack</h1>
        <p className="drb-subtitle">CRA 2015 &amp; Consumer Contracts Regulations Compliant</p>
      </div>

      {/* Meta row */}
      <div className="drb-meta-row">
        <span>Case ID: <strong>{form.caseId}</strong></span>
        <span>Vehicle: <strong>{sale.vehicleRegistration || '—'}</strong></span>
        <span>Generated: <strong>{now}</strong></span>
        {generated.riskLevel && (
          <span>
            Risk:{' '}
            <strong style={{ color: generated.riskLevel === 'high' ? '#dc2626' : generated.riskLevel === 'moderate' ? '#d97706' : '#16a34a' }}>
              {generated.riskLevel.charAt(0).toUpperCase() + generated.riskLevel.slice(1)}
            </strong>
          </span>
        )}
      </div>

      {/* Section 1 – Sale Details */}
      <SectionTitle>Section 1 — Sale Overview</SectionTitle>
      <div className="drb-grid-2">
        <Row label="Vehicle Registration" value={sale.vehicleRegistration} />
        <Row label="Date of Sale" value={sale.saleDate} />
        <Row label="Sale Price" value={sale.salePrice ? `£${sale.salePrice}` : '—'} />
        <Row label="Mileage at Sale" value={sale.mileageAtSale} />
        <Row label="Distance Sale" value={sale.distanceSale} />
        <Row label="Warranty Provided" value={sale.warrantyProvided} />
        <Row label="Finance Involved" value={sale.financeInvolved} />
      </div>

      {/* Section 2 – Complaint */}
      <SectionTitle>Section 2 — Complaint Details</SectionTitle>
      <Row label="Complaint Type" value={COMPLAINT_LABELS[complaint.complaintType] || complaint.complaintType} />
      {complaint.customerComplaintText && (
        <div className="drb-complaint-box">
          <p className="drb-complaint-label">Customer's Complaint (Verbatim):</p>
          <p className="drb-complaint-text">"{complaint.customerComplaintText}"</p>
        </div>
      )}

      {/* Section 3 – Time & Usage */}
      <SectionTitle>Section 3 — Time &amp; Usage Factors</SectionTitle>
      <div className="drb-grid-2">
        <Row label="Days Since Sale" value={String(days)} />
        <Row label="Miles Since Sale" value={String(miles.toLocaleString())} />
        <Row label="Current Mileage" value={timeUsage.currentMileage} />
        <Row label="Vehicle Drivable" value={timeUsage.vehicleDrivable} />
        <Row label="Repair Attempted" value={timeUsage.repairAttempted} />
        <Row
          label="Legal Timeline"
          value={
            generated.legalTimeline === 'under-30' ? 'Under 30 Days (Short-term right to reject)' :
            generated.legalTimeline === '30-to-6-months' ? '30 Days – 6 Months (Repair/replace phase)' :
            generated.legalTimeline === 'over-6-months' ? 'Over 6 Months (Proof shifts to customer)' : '—'
          }
        />
      </div>

      {/* Section 4 – Evidence */}
      <SectionTitle>Section 4 — Evidence &amp; Documentation</SectionTitle>
      <div className="drb-grid-2">
        {[
          ['Signed PDI Available', evidence.signedPdiAvailable],
          ['Distance Sale Pack Completed', evidence.distanceSalePackCompleted],
          ['Provenance Report Provided', evidence.provenanceReportProvided],
          ['Service History Disclosed', evidence.serviceHistoryDisclosed],
          ['Fault Inspection Report Available', evidence.faultInspectionReportAvailable],
          ['Independent Inspection Requested', evidence.independentInspectionRequested],
          ['Customer Refused Inspection', evidence.customerRefusedInspection],
        ].map(([label, value]) => (
          <Row key={label as string} label={label as string} value={value as boolean} />
        ))}
      </div>
      {evidence.additionalNotes && (
        <div className="drb-notes-box">
          <p className="drb-notes-label">Additional Notes:</p>
          <p className="drb-notes-text">{evidence.additionalNotes}</p>
        </div>
      )}

      {/* Section 5 – Generated Email Response */}
      {generated.emailResponse && (
        <>
          <SectionTitle>Section 5 — Dealer Response (Email)</SectionTitle>
          <div className="drb-response-box">
            <p className="drb-response-text">{generated.emailResponse}</p>
          </div>
        </>
      )}

      {/* Section 6 – SMS Version */}
      {generated.smsVersion && (
        <>
          <SectionTitle>Section 6 — SMS Version</SectionTitle>
          <div className="drb-sms-box">
            <p className="drb-response-text">{generated.smsVersion}</p>
          </div>
        </>
      )}

      {/* Section 7 – Next Steps */}
      {generated.suggestedNextSteps.length > 0 && (
        <>
          <SectionTitle>Section 7 — Suggested Next Steps</SectionTitle>
          <ol className="drb-steps-list">
            {generated.suggestedNextSteps.map((step, i) => (
              <li key={i} className="drb-step-item">{step}</li>
            ))}
          </ol>
        </>
      )}

      {/* Internal summary */}
      {generated.internalSummary && (
        <>
          <SectionTitle>Internal Case Summary (Audit Use Only)</SectionTitle>
          <div className="drb-internal-box">
            <p className="drb-response-text">{generated.internalSummary}</p>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="drb-footer">
        <span>This report was generated using the AutoProv Platform (autexa.ai). The content of this report is the responsibility of the issuing business.</span>
        <span>Dispute Response Pack · Case ID: {form.caseId} · {now}</span>
      </div>
    </div>
  );
};

export default DRBPrintLayout;
