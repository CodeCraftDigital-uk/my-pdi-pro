import { Input } from '@/components/ui/input';
import { BrakeMeasurement } from '@/types/pdi';
import { Disc, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  measurements: BrakeMeasurement[];
  onUpdate: (index: number, field: 'measured' | 'minimum', value: string) => void;
}

export const BrakeSection = ({ measurements, onUpdate }: Props) => {
  const getStatus = (measured: string, minimum: string) => {
    if (!measured || !minimum) return null;
    const m = parseFloat(measured);
    const min = parseFloat(minimum);
    if (isNaN(m) || isNaN(min)) return null;
    return m >= min ? 'pass' : 'fail';
  };

  return (
    <section className="pdi-section pdi-section-card pdi-accent-orange">
      <div className="pdi-section-header">
        <span className="pdi-section-number pdi-num-orange">5</span>
        <Disc className="h-5 w-5 text-orange-600" />
        <h2 className="pdi-section-title">Brake Measurements</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Component</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Measured (mm)</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Manufacturer Min (mm)</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, i) => {
              const status = getStatus(m.measured, m.minimum);
              return (
                <tr key={m.component} className="border-b border-border/50 even:bg-muted/20 last:border-b-0">
                  <td className="py-2.5 px-3 font-medium">{m.component}</td>
                  <td className="py-2.5 px-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={m.measured}
                      onChange={(e) => onUpdate(i, 'measured', e.target.value.replace(/[^0-9.]/g, ''))}
                      className="w-24 bg-card"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={m.minimum}
                      onChange={(e) => onUpdate(i, 'minimum', e.target.value.replace(/[^0-9.]/g, ''))}
                      className="w-24 bg-card"
                    />
                  </td>
                  <td className="py-2.5 px-3">
                    {status === 'pass' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                        <CheckCircle2 className="h-3 w-3" /> Pass
                      </span>
                    )}
                    {status === 'fail' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                        <AlertTriangle className="h-3 w-3" /> Below Minimum
                      </span>
                    )}
                    {!status && <span className="text-muted-foreground text-xs">—</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
