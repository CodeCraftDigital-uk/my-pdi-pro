import { format } from 'date-fns';
import { Upload } from 'lucide-react';
import siteIcon from '@/assets/autoprov_icon.png';

interface Props {
  reportId: string;
  reportDate: Date;
}

export const HeaderSection = ({ reportId, reportDate }: Props) => {
  return (
    <div className="border-b border-border pb-8 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <img src={siteIcon} alt="PDI Pro" className="h-8 w-8 object-contain" />
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Used Vehicle PDI
            </h1>
          </div>
          <p className="text-base text-primary/80 font-medium mb-1">
            Compliance & Condition Report
          </p>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Complete this inspection before vehicle handover. This form supports Consumer Rights Act 2015 compliance and dealership audit protection.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-1 mt-5 text-sm">
        <div>
          <span className="text-muted-foreground">Report ID:</span>{' '}
          <span className="font-mono font-semibold text-foreground">{reportId}</span>
        </div>
        <div>
          <span className="text-muted-foreground">Date:</span>{' '}
          <span className="font-semibold text-foreground">{format(reportDate, 'dd/MM/yyyy')}</span>
        </div>
      </div>
    </div>
  );
};
