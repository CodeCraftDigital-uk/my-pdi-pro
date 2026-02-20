import { DistanceSaleForm } from '@/types/distanceSale';
import autoprovIcon from '@/assets/autoprov_icon.png';

interface Props {
  form: DistanceSaleForm;
}

const fmt = (d: string) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-GB'); } catch { return d; }
};

const fmtDT = (d: string) => {
  if (!d) return '—';
  try { return new Date(d).toLocaleString('en-GB'); } catch { return d; }
};

const tick = (v: boolean) => v ? '✓' : '✗';

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="print-row">
    <span className="print-row-label">{label}</span>
    <span className="print-row-value">{value || '—'}</span>
  </div>
);

const SectionHeading = ({ num, title }: { num: number; title: string }) => (
  <div className="print-section-heading">
    <span className="print-section-num">{num}</span>
    <span>{title}</span>
  </div>
);

const Check = ({ checked, label }: { checked: boolean; label: string }) => (
  <div className="print-check">
    <span className={`print-check-box ${checked ? 'print-check-yes' : 'print-check-no'}`}>{checked ? '✓' : '✗'}</span>
    <span className="print-check-label">{label}</span>
  </div>
);

const DSSPrintLayout = ({ form }: Props) => {
  const now = new Date().toLocaleString('en-GB');
  const { dealer, vehicle, preSale, terms, coolingOff, delivery, refundPolicy } = form;

  return (
    <div className="dss-print-root">
      {/* ── PAGE HEADER (repeats each page) ── */}
      <div className="dss-page-header">
        <div className="dss-header-left">
          <img src={autoprovIcon} alt="AutoProv" className="dss-logo" />
          <div>
            <div className="dss-brand">AutoProv</div>
            <div className="dss-brand-sub">Digital Distance Sale Pack</div>
          </div>
        </div>
        <div className="dss-header-right">
          <div className="dss-pack-id">Pack ID: {form.packId}</div>
          <div className="dss-pack-date">Generated: {now}</div>
        </div>
      </div>

      {/* Gold rule */}
      <div className="dss-gold-rule" />

      {/* ── SECTION 1: Dealer Details ── */}
      <div className="dss-section">
        <SectionHeading num={1} title="Dealer Details" />
        <div className="print-grid-2col">
          <Row label="Business Name" value={dealer.businessName} />
          <Row label="Trading Address" value={dealer.tradingAddress} />
          <Row label="Contact Number" value={dealer.contactNumber} />
          <Row label="Email" value={dealer.email} />
          <Row label="VAT Number" value={dealer.vatNumber || 'N/A'} />
          <Row label="FCA Number" value={dealer.fcaNumber || 'N/A'} />
        </div>
      </div>

      {/* ── SECTION 2: Vehicle Details ── */}
      <div className="dss-section">
        <SectionHeading num={2} title="Vehicle Details" />
        <div className="print-grid-2col">
          <Row label="Registration" value={vehicle.registration} />
          <Row label="VIN" value={vehicle.vin} />
          <Row label="Make" value={vehicle.make} />
          <Row label="Model" value={vehicle.model} />
          <Row label="Mileage at Sale" value={vehicle.mileageAtSale ? `${Number(vehicle.mileageAtSale).toLocaleString()} miles` : '—'} />
          <Row label="Sale Price" value={vehicle.salePrice ? `£${Number(vehicle.salePrice).toLocaleString()}` : '—'} />
          <Row label="Date of Sale" value={fmt(vehicle.dateOfSale)} />
          <Row label="Agreed Delivery Date" value={fmt(vehicle.agreedDeliveryDate)} />
        </div>
      </div>

      {/* ── SECTION 3: Pre-Sale Condition Declaration ── */}
      <div className="dss-section">
        <SectionHeading num={3} title="Pre-Sale Condition Declaration" />
        <Check checked={preSale.vehicleInspected} label="Vehicle physically inspected prior to sale" />
        <Check checked={preSale.knownDefectsDisclosed} label="All known mechanical defects disclosed to customer" />
        <Check checked={preSale.cosmeticImperfectionsDisclosed} label="Cosmetic imperfections disclosed to customer" />
        <Check checked={preSale.warningLightsDeclared} label="Warning light status declared to customer" />
        <Check checked={preSale.serviceHistoryExplained} label="Service history status explained to customer" />
        <Check checked={preSale.financeClearConfirmed} label="Finance settlement status confirmed (clear or disclosed)" />
        {preSale.additionalDisclosures && (
          <div className="dss-notes-box">
            <span className="dss-notes-label">Additional Disclosures:</span> {preSale.additionalDisclosures}
          </div>
        )}
        <div className="print-grid-2col" style={{ marginTop: '6pt' }}>
          <Row label="Inspection Timestamp" value={fmtDT(preSale.inspectionTimestamp)} />
          <Row label="Authorised By" value={preSale.dealerSignature} />
        </div>
      </div>

      {/* ── SECTION 4: CRA & Distance Sale Summary ── */}
      <div className="dss-section">
        <SectionHeading num={4} title="Consumer Rights Act 2015 — Summary Presented to Customer" />
        <div className="dss-legal-block">
          <p><strong>Satisfactory Quality:</strong> The vehicle must be of satisfactory quality having regard to its age, mileage, and price. The customer is entitled to expect it to be free from minor defects, safe, and durable.</p>
          <p><strong>30-Day Right to Reject:</strong> Within 30 days of purchase, if the vehicle is found to have a fault present at time of sale, the customer may be entitled to a full refund subject to fair usage.</p>
          <p><strong>Repair or Replace:</strong> After 30 days and within 6 months, the dealer has the right to attempt one repair before a price reduction or final rejection may apply.</p>
          <p><strong>Wear &amp; Tear:</strong> Normal wear and tear is not covered. Consumable items (tyres, brakes, wipers, clutch) are excluded unless defective at time of sale.</p>
          <p><strong>Fault Reporting:</strong> Faults must be reported promptly and in writing. No third-party repairs without prior written dealer consent.</p>
        </div>
        <Check checked={terms.termsPresented} label="Dealer confirms the above CRA 2015 summary has been presented and discussed with the customer" />
      </div>

      {/* ── SECTION 5: Cooling-Off ── */}
      <div className="dss-section">
        <SectionHeading num={5} title="14-Day Cooling-Off Confirmation" />
        <Row label="Cooling-Off Period Start Date" value={fmt(coolingOff.coolingOffStartDate)} />
        <div style={{ marginTop: '4pt' }}>
          <Check checked={coolingOff.isDistanceSale} label="Confirmed as a distance sale" />
          <Check checked={coolingOff.customerInformedOf14Days} label="Customer informed of 14-day cancellation right (Consumer Contracts Regulations 2013)" />
          <Check checked={coolingOff.returnConditionExplained} label="Return condition expectations explained" />
          <Check checked={coolingOff.returnProcessExplained} label="Return process and transport cost responsibility explained" />
          <Check checked={coolingOff.customerAcknowledgesCoolingOff} label="Customer confirms they understand their cooling-off rights" />
        </div>
      </div>

      {/* ── SECTION 6: Delivery Condition Sign-Off ── */}
      <div className="dss-section">
        <SectionHeading num={6} title="Delivery Condition Sign-Off" />
        <div className="print-grid-2col">
          <Row label="Delivery Date" value={fmt(delivery.deliveryDate)} />
          <Row label="Delivery Mileage" value={delivery.deliveryMileage ? `${Number(delivery.deliveryMileage).toLocaleString()} miles` : '—'} />
          <Row label="Delivered By" value={delivery.deliveredBy || '—'} />
          <Row label="Driver / Company Name" value={delivery.deliveredByName} />
        </div>
        <Check checked={delivery.customerConfirmsCondition} label="Customer confirms vehicle received in agreed condition as described prior to sale" />

        {/* Signature */}
        <div className="dss-sig-block">
          <div className="dss-sig-line">
            {delivery.customerSignature ? (
              <img src={delivery.customerSignature} alt="Customer Signature" className="dss-sig-img" />
            ) : (
              <div className="dss-sig-placeholder" />
            )}
          </div>
          <div className="dss-sig-meta">
            <span>Customer Signature</span>
            {delivery.signatureTimestamp && <span>Signed: {fmtDT(delivery.signatureTimestamp)}</span>}
          </div>
        </div>
      </div>

      {/* ── SECTION 7: Refund Policy Acknowledgement ── */}
      <div className="dss-section">
        <SectionHeading num={7} title="Refund Policy Acknowledgement" />
        <Check checked={refundPolicy.refundTimelinesUnderstood} label="Refund timelines understood (14 days from return of vehicle)" />
        <Check checked={refundPolicy.repairFirstApproachAgreed} label="Repair-first approach agreed after 30-day rejection period" />
        <Check checked={refundPolicy.diagnosticsAgreed} label="Agrees to allow dealer inspection and diagnostics before remedy" />
        <Check checked={refundPolicy.thirdPartyInspectionAgreed} label="Independent third-party inspection process understood" />
        <Check checked={refundPolicy.transportCostPolicyUnderstood} label="Return transport cost policy understood" />
        <div className="dss-final-confirm">
          <span className="dss-confirm-tick">{tick(refundPolicy.confirmed)}</span>
          <strong>Customer confirms they have read and understood all refund and return policies.</strong>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="dss-print-footer">
        <span>AutoProv Digital Distance Sale Pack · {form.packId} · Generated {now}</span>
        <span>This document forms part of the dealer's compliance audit trail. Consumer Rights Act 2015 &amp; Consumer Contracts Regulations 2013 compliant.</span>
      </div>
    </div>
  );
};

export default DSSPrintLayout;
