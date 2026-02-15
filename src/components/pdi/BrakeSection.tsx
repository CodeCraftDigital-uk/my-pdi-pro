import { Input } from '@/components/ui/input';
import { BrakeMeasurement } from '@/types/pdi';
import { Disc, AlertTriangle } from 'lucide-react';

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
    <section className="pdi-section">
      <div className="pdi-section-header">
        <span className="pdi-section-number">5</span>
        <Disc className="h-5 w-5 text-primary" />
        <h2 className="pdi-section-title">Brake Measurements</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Component</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Measured (mm)</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Manufacturer Min (mm)</th>
              <th className="text-left py-2 px-3 text-xs font-semibold text-muted-foreground uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, i) => {
              const status = getStatus(m.measured, m.minimum);
              return (
                <tr key={m.component} className="border-b border-border/50">
                  <td className="py-2 px-3 font-medium">{m.component}</td>
                  <td className="py-2 px-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={m.measured}
                      onChange={(e) => onUpdate(i, 'measured', e.target.value.replace(/[^0-9.]/g, ''))}
                      className="w-24 bg-card"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.0"
                      value={m.minimum}
                      onChange={(e) => onUpdate(i, 'minimum', e.target.value.replace(/[^0-9.]/g, ''))}
                      className="w-24 bg-card"
                    />
                  </td>
                  <td className="py-2 px-3">
                    {status === 'pass' && <span className="status-pass">✓ Pass</span>}
                    {status === 'fail' && (
                      <span className="status-fail flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" /> Below Minimum
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
