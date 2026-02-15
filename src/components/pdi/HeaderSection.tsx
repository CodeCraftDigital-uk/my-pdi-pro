import { format } from 'date-fns';
import { Upload, FileText } from 'lucide-react';

interface Props {
  reportId: string;
  reportDate: Date;
  logo: string | null;
  onLogoChange: (logo: string | null) => void;
}

export const HeaderSection = ({ reportId, reportDate, logo, onLogoChange }: Props) => {
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => onLogoChange(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border-b border-border pb-8 mb-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-7 w-7 text-primary" />
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
        <div className="shrink-0">
          {logo ? (
            <div className="relative group">
              <img src={logo} alt="Dealership logo" className="h-16 max-w-[160px] object-contain" />
              <button
                onClick={() => onLogoChange(null)}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity no-print"
              >
                ×
              </button>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-1.5 p-4 border-2 border-dashed border-border rounded-lg hover:border-accent transition-colors no-print">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Upload Logo</span>
              <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </label>
          )}
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
