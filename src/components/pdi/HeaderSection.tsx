import { format } from 'date-fns';
import siteIcon from '@/assets/autoprov_icon.png';

interface Props {
  reportId: string;
  reportDate: Date;
}

export const HeaderSection = ({ reportId, reportDate }: Props) => {
  return (
    <div className="border-b border-border pb-8 mb-8">
      {/* Gradient accent banner */}
      <div className="no-print -mx-4 sm:-mx-6 lg:-mx-8 mb-6 px-4 sm:px-6 lg:px-8 py-5 bg-gradient-to-r from-primary to-accent rounded-t-lg">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/15 rounded-lg p-2 backdrop-blur-sm">
            <img src={siteIcon} alt="PDI Pro" className="h-9 w-9 object-contain" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary-foreground tracking-tight">
              Used Vehicle PDI
            </h1>
            <p className="text-sm text-primary-foreground/80 font-medium">
              Professional Compliance &amp; Condition Report
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-primary-foreground/20 text-primary-foreground text-xs font-semibold backdrop-blur-sm border border-primary-foreground/30">
              Consumer Rights Act 2015
            </span>
          </div>
        </div>
      </div>

      {/* Print-only header (plain) */}
      <div className="print-only mb-2">
        <div className="flex items-center gap-2 mb-1">
          <img src={siteIcon} alt="PDI Pro" className="h-7 w-7 object-contain" />
          <h1 className="text-xl font-bold text-foreground">Used Vehicle PDI – Compliance &amp; Condition Report</h1>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-xl leading-relaxed no-print">
        Complete this inspection before vehicle handover. This form supports Consumer Rights Act 2015 compliance and dealership audit protection.
      </p>

      {/* Report metadata chips */}
      <div className="flex flex-wrap gap-2 mt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-sm">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Report ID</span>
          <span className="font-mono font-bold text-foreground">{reportId}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-sm">
          <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Date</span>
          <span className="font-semibold text-foreground">{format(reportDate, 'dd/MM/yyyy')}</span>
        </div>
      </div>
    </div>
  );
};
