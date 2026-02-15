import { useState } from 'react';
import { Damage, DamageType, DAMAGE_COLORS, DAMAGE_LABELS } from '@/types/pdi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Paintbrush, X } from 'lucide-react';

const DAMAGE_TYPES: DamageType[] = ['scratch', 'dent', 'chip', 'scuff', 'crack'];

interface Props {
  damages: Damage[];
  damageNotes: string;
  onAddDamage: (damage: Omit<Damage, 'id'>) => void;
  onRemoveDamage: (id: string) => void;
  onNotesChange: (notes: string) => void;
}

// Clickable zones overlaid on the SVG diagram
interface Zone {
  name: string;
  path: string;
}

// Top/plan view zones
const TOP_ZONES: Zone[] = [
  { name: 'Front Bumper', path: 'M 135,10 L 225,10 Q 240,10 240,25 L 240,40 L 120,40 L 120,25 Q 120,10 135,10 Z' },
  { name: 'Bonnet', path: 'M 120,40 L 240,40 L 245,55 Q 250,70 250,90 L 250,130 L 110,130 L 110,90 Q 110,70 115,55 Z' },
  { name: 'Windscreen', path: 'M 110,130 L 250,130 L 255,160 L 105,160 Z' },
  { name: 'Roof', path: 'M 105,160 L 255,160 L 258,280 L 102,280 Z' },
  { name: 'Rear Window', path: 'M 102,280 L 258,280 L 252,310 L 108,310 Z' },
  { name: 'Boot', path: 'M 108,310 L 252,310 L 248,370 Q 245,380 240,385 L 120,385 Q 115,380 112,370 Z' },
  { name: 'Rear Bumper', path: 'M 120,385 L 240,385 Q 240,400 235,405 L 125,405 Q 120,400 120,385 Z' },
  { name: 'LF Wing', path: 'M 95,45 L 120,40 L 115,55 L 110,90 L 110,130 L 90,130 L 90,90 Q 90,65 95,45 Z' },
  { name: 'RF Wing', path: 'M 265,45 L 240,40 L 245,55 L 250,90 L 250,130 L 270,130 L 270,90 Q 270,65 265,45 Z' },
  { name: 'LF Door', path: 'M 90,130 L 110,130 L 105,160 L 103,220 L 85,220 L 85,160 Z' },
  { name: 'RF Door', path: 'M 270,130 L 250,130 L 255,160 L 257,220 L 275,220 L 275,160 Z' },
  { name: 'LR Door', path: 'M 85,220 L 103,220 L 102,280 L 85,280 Z' },
  { name: 'RR Door', path: 'M 275,220 L 257,220 L 258,280 L 275,280 Z' },
  { name: 'LR Quarter', path: 'M 85,280 L 102,280 L 108,310 L 112,370 L 95,370 Q 90,350 88,320 Z' },
  { name: 'RR Quarter', path: 'M 275,280 L 258,280 L 252,310 L 248,370 L 265,370 Q 270,350 272,320 Z' },
];


const WHEEL_POSITIONS = ['FL', 'FR', 'RL', 'RR'];

export const VehicleDiagram = ({ damages, damageNotes, onAddDamage, onRemoveDamage, onNotesChange }: Props) => {
  const [selectedPanel, setSelectedPanel] = useState<{ panel: string; view: string } | null>(null);

  const getPanelDamages = (panel: string, view: string) =>
    damages.filter(d => d.panel === panel && d.view === view);

  const handleZoneClick = (panel: string, view: string) => {
    setSelectedPanel({ panel, view });
  };

  const handleDamageSelect = (type: DamageType) => {
    if (!selectedPanel) return;
    onAddDamage({ panel: selectedPanel.panel, view: selectedPanel.view, type });
    setSelectedPanel(null);
  };

  const renderZone = (zone: Zone, view: string) => {
    const panelDamages = getPanelDamages(zone.name, view);
    const isSelected = selectedPanel?.panel === zone.name && selectedPanel?.view === view;
    const hasDamage = panelDamages.length > 0;

    return (
      <g key={`${view}-${zone.name}`} className="cursor-pointer" onClick={() => handleZoneClick(zone.name, view)}>
        <path
          d={zone.path}
          fill={hasDamage ? 'rgba(239,68,68,0.15)' : isSelected ? 'rgba(59,130,246,0.15)' : 'transparent'}
          stroke={hasDamage ? '#ef4444' : isSelected ? '#3b82f6' : 'transparent'}
          strokeWidth={hasDamage || isSelected ? 1.5 : 0}
          className="hover:fill-[rgba(59,130,246,0.08)] transition-colors"
        />
        {/* Damage markers */}
        {panelDamages.map((d, i) => {
          // Get bounding box center approximation from path
          const bbox = getPathCenter(zone.path);
          return (
            <g key={d.id} transform={`translate(${bbox.x + i * 12 - (panelDamages.length - 1) * 6}, ${bbox.y})`}>
              <circle r="7" fill={DAMAGE_COLORS[d.type]} stroke="#fff" strokeWidth="1" />
              <text x="0" y="3.5" textAnchor="middle" fontSize="8" fontWeight="700" fill="#fff">
                {DAMAGE_LABELS[d.type]}
              </text>
            </g>
          );
        })}
      </g>
    );
  };

  return (
    <section className="pdi-section">
      <div className="pdi-section-header">
        <span className="pdi-section-number">3</span>
        <Paintbrush className="h-5 w-5 text-primary" />
        <h2 className="pdi-section-title">Cosmetic Condition</h2>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 bg-secondary rounded-lg">
        {DAMAGE_TYPES.map(t => (
          <div key={t} className="flex items-center gap-1.5 text-xs">
            <span className="w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-primary-foreground" style={{ backgroundColor: DAMAGE_COLORS[t] }}>
              {DAMAGE_LABELS[t]}
            </span>
            <span className="capitalize font-medium">{t}</span>
          </div>
        ))}
      </div>

      {/* Damage selector */}
      {selectedPanel && (
        <div className="mb-4 p-4 border border-accent rounded-lg bg-accent/5">
          <p className="text-sm font-medium mb-2">
            Mark damage on <span className="text-accent font-semibold">{selectedPanel.panel}</span>:
          </p>
          <div className="flex flex-wrap gap-2">
            {DAMAGE_TYPES.map(t => (
              <Button key={t} size="sm" variant="outline" onClick={() => handleDamageSelect(t)}
                className="capitalize text-xs gap-1.5"
                style={{ borderColor: DAMAGE_COLORS[t], color: DAMAGE_COLORS[t] }}>
                <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: DAMAGE_COLORS[t] }} />
                {t}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setSelectedPanel(null)} className="text-xs">Cancel</Button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-lg p-4 bg-card">
        <div className="flex justify-center">
          <div className="flex flex-col items-center print-diagram-horizontal">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Plan View</p>
            <svg viewBox="60 0 240 420" className="w-full max-w-[300px] vehicle-diagram-svg" style={{ height: 'auto' }}>
              <g fill="none" stroke="hsl(220,25%,20%)" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M 135,10 Q 180,5 225,10 Q 240,12 245,30 L 265,45 Q 275,55 275,90 L 275,160 L 275,280 Q 275,320 272,340 L 265,370 Q 260,385 240,395 L 235,405 Q 180,415 125,405 L 120,395 Q 100,385 95,370 L 88,340 Q 85,320 85,280 L 85,160 L 85,90 Q 85,55 95,45 L 115,30 Q 120,12 135,10 Z" />
                <path d="M 105,130 L 255,130" />
                <path d="M 102,280 L 258,280" />
                <path d="M 105,160 L 255,160" strokeDasharray="3,3" />
                <line x1="90" y1="130" x2="85" y2="280" strokeDasharray="3,3" />
                <line x1="270" y1="130" x2="275" y2="280" strokeDasharray="3,3" />
                <line x1="85" y1="220" x2="103" y2="220" strokeDasharray="3,3" />
                <line x1="275" y1="220" x2="257" y2="220" strokeDasharray="3,3" />
                <path d="M 108,310 L 252,310" strokeDasharray="3,3" />
                <ellipse cx="82" cy="145" rx="8" ry="5" fill="none" />
                <ellipse cx="278" cy="145" rx="8" ry="5" fill="none" />
                <rect x="76" y="60" width="18" height="45" rx="5" fill="none" />
                <rect x="266" y="60" width="18" height="45" rx="5" fill="none" />
                <rect x="76" y="310" width="18" height="45" rx="5" fill="none" />
                <rect x="266" y="310" width="18" height="45" rx="5" fill="none" />
              </g>
              {TOP_ZONES.map(z => renderZone(z, 'top'))}
            </svg>
          </div>
        </div>
      </div>

      {/* Wheel positions */}
      <div className="mt-6">
        <p className="text-sm font-medium mb-2">Wheel Condition</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WHEEL_POSITIONS.map(pos => {
            const wheelDamages = getPanelDamages(`Wheel ${pos}`, 'wheels');
            return (
              <div
                key={pos}
                className={`panel-cell ${wheelDamages.length > 0 ? 'has-damage' : ''} ${
                  selectedPanel?.panel === `Wheel ${pos}` ? 'selected' : ''
                }`}
                onClick={() => handleZoneClick(`Wheel ${pos}`, 'wheels')}
              >
                <span className="font-semibold text-xs">{pos}</span>
                {wheelDamages.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                    {wheelDamages.map(d => (
                      <span key={d.id} className="damage-badge" style={{ backgroundColor: DAMAGE_COLORS[d.type], color: '#fff' }}>
                        {DAMAGE_LABELS[d.type]}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Damage log */}
      {damages.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium mb-2">Recorded Damage ({damages.length})</p>
          <div className="flex flex-wrap gap-2">
            {damages.map(d => (
              <Badge key={d.id} variant="outline" className="gap-1.5 py-1 text-xs">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DAMAGE_COLORS[d.type] }} />
                {d.panel} — <span className="capitalize">{d.type}</span>
                <button onClick={() => onRemoveDamage(d.id)} className="ml-1 hover:text-destructive no-print">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};

// Helper to approximate center of an SVG path for marker placement
function getPathCenter(pathD: string): { x: number; y: number } {
  const nums = pathD.match(/[\d.]+/g)?.map(Number) || [];
  let sumX = 0, sumY = 0, count = 0;
  for (let i = 0; i < nums.length - 1; i += 2) {
    sumX += nums[i];
    sumY += nums[i + 1];
    count++;
  }
  return { x: count ? sumX / count : 0, y: count ? sumY / count : 0 };
}
