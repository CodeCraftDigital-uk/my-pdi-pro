import { DistanceSaleTerms } from '@/types/distanceSale';
import { Checkbox } from '@/components/ui/checkbox';
import { Scale } from 'lucide-react';

interface Props {
  data: DistanceSaleTerms;
  onUpdate: (field: keyof DistanceSaleTerms, value: boolean) => void;
}

const SECTIONS = [
  {
    heading: 'Consumer Rights Act 2015 — Customer Rights',
    body: `Under the Consumer Rights Act 2015, the vehicle sold must be of satisfactory quality, fit for purpose, and as described. Satisfactory quality is assessed having regard to all relevant circumstances including the age, mileage, and price of the vehicle. The customer is entitled to expect that the vehicle is free from minor defects, is safe, and is durable.`,
  },
  {
    heading: '30-Day Short-Term Right to Reject',
    body: `Within the first 30 days of ownership, if the vehicle is found to be of unsatisfactory quality, not fit for purpose, or not as described, the customer may be entitled to a full refund. This right applies where the fault was present at the time of sale. Fair usage during this period is expected and excessive wear may affect the refund amount.`,
  },
  {
    heading: 'Dealer Right to Repair or Replace',
    body: `After the initial 30-day period and within the first six months of ownership, the dealer has the right to attempt one repair or replacement before a price reduction or final rejection may be requested. The repair will be carried out within a reasonable timeframe and at no cost to the customer.`,
  },
  {
    heading: 'Fair Usage and Wear & Tear',
    body: `Wear and tear consistent with the age and mileage of the vehicle is not covered under consumer rights legislation. This includes consumable items such as tyres, brake pads, wiper blades, and clutch components, unless found to be defective at the time of sale. The customer is expected to maintain the vehicle in accordance with the manufacturer's service schedule.`,
  },
  {
    heading: 'Fault Reporting Expectations',
    body: `Should the customer discover a fault, they are required to report it to the dealer promptly and in writing. The customer must not authorise third-party repairs without the dealer's prior written consent, as doing so may invalidate any claim under the Consumer Rights Act 2015. The dealer reserves the right to conduct an independent inspection prior to agreeing any remedy.`,
  },
];

const DSSStepTerms = ({ data, onUpdate }: Props) => (
  <div className="space-y-6">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0f9]">
        <Scale size={20} className="text-[#1e3a5f]" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">CRA 2015 & Distance Sale Explanation</h2>
        <p className="text-sm text-muted-foreground">Legally neutral summary to be presented to the customer before the sale completes.</p>
      </div>
    </div>

    <div className="rounded-xl border border-border bg-card divide-y divide-border">
      {SECTIONS.map((s) => (
        <div key={s.heading} className="px-5 py-4">
          <p className="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider mb-2">{s.heading}</p>
          <p className="text-sm text-foreground/80 leading-relaxed">{s.body}</p>
        </div>
      ))}
    </div>

    <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
      <Checkbox
        checked={data.termsPresented}
        onCheckedChange={(v) => onUpdate('termsPresented', !!v)}
        className="mt-0.5 shrink-0"
      />
      <span className="text-sm text-foreground font-medium leading-snug">
        I confirm that the above Consumer Rights Act 2015 summary has been presented to and discussed with the customer prior to the conclusion of this distance sale.
      </span>
    </label>
  </div>
);

export default DSSStepTerms;
