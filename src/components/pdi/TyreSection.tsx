import { Input } from '@/components/ui/input';
import { TyreMeasurement } from '@/types/pdi';
import { CircleDot, AlertTriangle } from 'lucide-react';

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
    <section className="pdi-section">
      <div className="pdi-section-header">
        <span className="pdi-section-number">4</span>
        <CircleDot className="h-5 w-5 text-primary" />
        <h2 className="pdi-section-title">Tyre Measurements</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Position</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Tread Depth (mm)</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Legal Min</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, i) => {
              const status = getStatus(m.treadDepth);
              return (
                <tr key={m.position} className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium">
                    {m.position}
                    {m.position.includes('Spare') && (
                      <span className="text-xs text-muted-foreground ml-1 italic">— Optional</span>
                    )}
                  </td>
                  <td className="py-2 px-3">
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
                  <td className="py-2 px-3 text-muted-foreground">{LEGAL_MIN} mm</td>
                  <td className="py-2 px-3">
                    {status === 'pass' && <span className="status-pass">✓ Pass</span>}
                    {status === 'warn' && (
                      <span className="status-warn flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Low
                      </span>
                    )}
                    {status === 'fail' && (
                      <span className="status-fail flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> FAIL — Below Legal Minimum
                      </span>
                    )}
                    {!status && <span className="text-muted-foreground">—</span>}
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
