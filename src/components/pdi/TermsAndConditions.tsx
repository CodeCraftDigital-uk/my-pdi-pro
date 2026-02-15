import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface Props {
  accepted: boolean;
  onAcceptChange: (val: boolean) => void;
  customerName: string;
}

export const TermsAndConditions = ({ accepted, onAcceptChange, customerName }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="mt-8 border border-border rounded-lg overflow-hidden">
      <div className="bg-muted/30 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-base">Terms &amp; Conditions of Sale</h2>
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 no-print"
        >
          {expanded ? 'Collapse' : 'Expand'}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      <div className={`px-5 py-4 text-sm leading-relaxed space-y-4 tc-print-compact ${expanded ? '' : 'hidden'} print-show`}>
        <p className="text-xs text-muted-foreground italic">(Motor Vehicle Sales – On-Site, Distance, Finance &amp; PCP)</p>

        <div className="space-y-3">
          <h3 className="font-semibold">1. Definitions</h3>
          <p>"We / Us / Our" means the selling dealership. "You / Customer" means the consumer purchaser. "Vehicle" means the motor vehicle sold under this agreement. "Distance Sale" means a contract concluded without face-to-face contact. "CRA 2015" means the Consumer Rights Act 2015. "Finance Agreement" includes Hire Purchase (HP) and Personal Contract Purchase (PCP).</p>

          <h3 className="font-semibold">2. Vehicle Pricing &amp; VAT</h3>
          <p>2.1 All advertised vehicle prices include all costs required to purchase the vehicle unless expressly stated otherwise.<br/>
          2.2 Where applicable, vehicles are sold under the VAT Margin Scheme for Second-Hand Goods. VAT is not separately itemised.<br/>
          2.3 We do not charge mandatory administration, documentation, or dealer service fees.</p>

          <h3 className="font-semibold">3. Optional Extras (Separate &amp; Voluntary)</h3>
          <p>3.1 Optional products are not required to purchase a vehicle.<br/>
          3.2 Optional extras are clearly disclosed, separately priced, and governed by their own terms.<br/>
          3.3 Where supplied by a third party, your contract is with the provider, not the dealership.</p>

          <h3 className="font-semibold">4. Vehicle Condition &amp; Description</h3>
          <p>4.1 Vehicles are sold as used vehicles and may display age- and mileage-related wear.<br/>
          4.2 Any known material defects will be disclosed prior to sale.<br/>
          4.3 Nothing in these terms limits your statutory rights.</p>

          <h3 className="font-semibold">5. Statutory Rights Overview</h3>
          <p>5.1 Under the CRA 2015, vehicles must be of satisfactory quality, fit for purpose, and as described.<br/>
          5.2 These rights apply independently of any warranty or insurance product.</p>

          <h3 className="font-semibold">6. First 30 Days – Short-Term Right to Reject</h3>
          <p>6.1 If a fault is present within 30 days from delivery, you may exercise your short-term right to reject in accordance with the CRA 2015.<br/>
          6.2 The vehicle must be made available for inspection to confirm the fault.</p>

          <h3 className="font-semibold">7. After 30 Days and Up to 6 Months</h3>
          <p>7.1 After 30 days, the primary statutory remedy is repair or replacement.<br/>
          7.2 During this period, the law presumes a fault was present at delivery unless the seller proves otherwise.<br/>
          7.3 We reserve the right to inspect, diagnose, and attempt a repair before any further remedy is considered.</p>

          <h3 className="font-semibold">8. After 6 Months – Burden of Proof</h3>
          <p>8.1 After six months from delivery, the legal presumption no longer applies.<br/>
          8.2 The burden of proof rests entirely with the customer.<br/>
          8.3 Claims made after six months without credible supporting evidence will not be accepted.</p>

          <h3 className="font-semibold">9. Evidence &amp; Diagnostics</h3>
          <p>9.1 Post-six-month claims require independent written evidence.<br/>
          9.2 Evidence must be from a VAT-registered garage or suitably qualified automotive engineer.<br/>
          9.3 Any diagnostics, inspections, reports, recovery, or storage arranged by the customer are at the customer's cost.<br/>
          9.4 These costs are non-refundable, even if a fault is later confirmed.<br/>
          9.5 We reserve the right to carry out our own inspection or appoint an independent assessor.</p>

          <h3 className="font-semibold">10. Wear-and-Tear Components</h3>
          <p>10.1 Certain components are subject to wear through normal use, including: tyres, brake pads and discs, timing belts, clutches, batteries, suspension components, exhaust components, and service items.<br/>
          10.2 Deterioration due to normal use does not constitute a fault under the CRA 2015.<br/>
          10.3 A claim will only be considered where the customer can demonstrate with credible evidence that the component was faulty at time of sale.<br/>
          10.4 After six months, the burden of proof rests entirely with the customer.</p>

          <h3 className="font-semibold">11. Distance Sales – Right to Cancel</h3>
          <p>11.1 Distance sales are governed by the Consumer Contracts Regulations 2013.<br/>
          11.2 You have a 14-day right to cancel starting from the day after delivery.<br/>
          11.3 This right is separate from CRA 2015 rights.</p>

          <h3 className="font-semibold">12. Distance Sales – Mileage &amp; Usage Charges</h3>
          <p>12.1 Vehicles may only be driven as reasonably necessary for inspection and testing.<br/>
          12.2 A standard allowance of 30 miles is permitted.<br/>
          12.3 Mileage above 30 miles is charged at £0.45 per mile where the cancellation is under cooling-off rights and the vehicle is not rejected due to a fault.<br/>
          12.4 No usage charges apply where rejection is fault-based.</p>

          <h3 className="font-semibold">13. Vehicle Returns &amp; Responsibility</h3>
          <p>13.1 You must take reasonable care of the vehicle while in your possession.<br/>
          13.2 Unless required by law, the customer is responsible for returning the vehicle.<br/>
          13.3 Where a confirmed fault renders the vehicle unroadworthy, we will arrange collection.<br/>
          13.4 Return or recovery costs are not reimbursed where a claim is rejected or unsupported.</p>

          <h3 className="font-semibold">14. Use After Fault Discovery</h3>
          <p>14.1 If a fault is suspected, you must cease driving the vehicle immediately.<br/>
          14.2 Continued use may invalidate a claim.</p>

          <h3 className="font-semibold">15. Optional Extras &amp; Bespoke Work</h3>
          <p>15.1 Optional extras are governed by their own terms.<br/>
          15.2 Customer-requested bespoke work is non-refundable once completed unless defective.</p>

          <h3 className="font-semibold">16. Refunds</h3>
          <p>16.1 Approved refunds are processed within 14 days of agreement and return or collection.<br/>
          16.2 Refunds are made using the original payment method unless agreed otherwise.</p>

          <h3 className="font-semibold">17. Finance Agreements – Separate Contracts</h3>
          <p>17.1 Finance agreements (HP / PCP) are separate legal contracts between you and the finance provider.<br/>
          17.2 The dealership acts only as a credit broker, not the lender.<br/>
          17.3 Finance approval, interest rates, and balloon payments are determined solely by the finance provider.</p>

          <h3 className="font-semibold">18. Finance Suitability &amp; Customer Responsibility</h3>
          <p>18.1 You are responsible for ensuring the finance agreement suits your circumstances.<br/>
          18.2 We do not provide financial advice.<br/>
          18.3 You confirm you understand all payment, mileage, condition, and end-of-term obligations.</p>

          <h3 className="font-semibold">19. PCP Mileage, Condition &amp; End-of-Term Charges</h3>
          <p>19.1 PCP agreements include mileage and condition standards set by the finance provider.<br/>
          19.2 Excess mileage or damage may result in charges payable to the finance provider.<br/>
          19.3 We are not responsible for end-of-term assessments or charges.</p>

          <h3 className="font-semibold">20. Voluntary Termination (VT)</h3>
          <p>20.1 VT rights arise under the Consumer Credit Act 1974 and apply only between you and the lender.<br/>
          20.2 We are not required to accept vehicle return, waive charges, or mediate VT disputes.</p>

          <h3 className="font-semibold">21. Faults &amp; Finance Interaction</h3>
          <p>21.1 A vehicle fault does not automatically invalidate a finance agreement.<br/>
          21.2 Where a vehicle is rejected under the CRA 2015, settlement is handled by the lender.<br/>
          21.3 We are not responsible for finance delays, interest accrual, or credit-file impacts.</p>

          <h3 className="font-semibold">22. Post-6-Month Finance-Linked Claims</h3>
          <p>22.1 Finance-related claims after six months require proof the fault existed at purchase.<br/>
          22.2 Diagnostic and engineer costs remain the customer's responsibility.<br/>
          22.3 Speculative or unsupported claims will be rejected.</p>

          <h3 className="font-semibold">23. Chargebacks &amp; Payment Disputes</h3>
          <p>23.1 Chargebacks do not override statutory processes.<br/>
          23.2 We reserve the right to contest chargebacks.<br/>
          23.3 Improper chargebacks may delay resolution.</p>

          <h3 className="font-semibold">24. Protection Against Unfounded Claims</h3>
          <p>24.1 We reserve the right to refuse remedies where claims are unsupported or speculative.<br/>
          24.2 Legitimate statutory rights remain unaffected.</p>

          <h3 className="font-semibold">25. Title &amp; Risk</h3>
          <p>25.1 Ownership passes on receipt of cleared funds.<br/>
          25.2 Risk passes on delivery or collection.</p>

          <h3 className="font-semibold">26. Complaints &amp; Dispute Resolution</h3>
          <p>26.1 We aim to resolve complaints promptly and fairly.<br/>
          26.2 Disputes may be referred to ADR or the courts of England and Wales.</p>

          <h3 className="font-semibold">27. Governing Law</h3>
          <p>These terms are governed by the laws of England and Wales.</p>

          <h3 className="font-semibold">28. Statutory Rights Statement</h3>
          <p>Nothing in these Terms &amp; Conditions limits or excludes your statutory rights under UK consumer law.</p>
        </div>
      </div>

      {/* Acceptance section - always visible */}
      <div className="px-5 py-4 border-t border-border bg-muted/10">
        <div className="flex items-start gap-3">
          <Checkbox
            id="tc-accepted"
            checked={accepted}
            onCheckedChange={(val) => onAcceptChange(val === true)}
            className="mt-0.5 no-print"
          />
          <Label htmlFor="tc-accepted" className="text-sm leading-snug cursor-pointer">
            I, <span className="font-semibold">{customerName || '_______________'}</span>, confirm that I have read, understood, and agreed to the Terms &amp; Conditions of Sale (Motor Vehicle Sales – On-Site, Distance, Finance &amp; PCP), including the Wear-and-Tear provisions.
          </Label>
        </div>
        {/* Print version shows checkbox state */}
        <div className="hidden print-show mt-2 text-sm">
          <span>{accepted ? '☑' : '☐'} Customer accepted Terms &amp; Conditions</span>
        </div>
      </div>

      {/* Signature section */}
      <div className="px-5 py-4 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Customer Signature</Label>
            <div className="border-b border-foreground h-10" />
            <Label className="text-xs text-muted-foreground">Name: {customerName || '_______________'}</Label>
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</Label>
            <div className="border-b border-foreground h-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
