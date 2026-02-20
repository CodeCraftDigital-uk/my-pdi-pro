import { Input } from '@/components/ui/input';
import { TyreMeasurement } from '@/types/pdi';
import { CircleDot, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Props {
  measurements: TyreMeasurement[];
  onUpdate: (index: number, treadDepth: string) => void;
}

const LEGAL_MIN = 1.6;

export const TyreSection = ({ measurements, onUpdate }: Props) => {
  const getStatus = (depth: string) => {
    if (!depth) return null;
    const val = parseFloat(depth);
    if (isNaN(val)) return null;
    if (val < LEGAL_MIN) return 'fail';
    if (val < 3) return 'warn';
    return 'pass';
  };

  return (
    <section className="pdi-section pdi-section-card pdi-accent-green">
      <div className="pdi-section-header">
        <span className="pdi-section-number pdi-num-green">4</span>
        <CircleDot className="h-5 w-5 text-green-600" />
        <h2 className="pdi-section-title">Tyre Measurements</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Position</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Tread Depth (mm)</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Legal Min</th>
              <th className="text-left py-2.5 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, i) => {
              const status = getStatus(m.treadDepth);
              return (
                <tr key={m.position} className="border-b border-border/50 even:bg-muted/20 last:border-b-0">
                  <td className="py-2.5 px-3 font-medium">
                    {m.position}
                    {m.position.includes('Spare') && (
                      <span className="text-xs text-muted-foreground ml-1 italic">— Optional</span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={m.treadDepth}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9.]/g, '');
                        if (parseFloat(val) <= 20 || val === '' || val === '.') {
                          onUpdate(i, val);
                        }
                      }}
                      className="w-24 bg-card"
                    />
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{LEGAL_MIN} mm</td>
                  <td className="py-2.5 px-3">
                    {status === 'pass' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                        <CheckCircle2 className="h-3 w-3" /> Pass
                      </span>
                    )}
                    {status === 'warn' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-warning/10 text-warning border border-warning/30">
                        <AlertTriangle className="h-3 w-3" /> Low
                      </span>
                    )}
                    {status === 'fail' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
                        <AlertTriangle className="h-3 w-3" /> Below Legal Min
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
