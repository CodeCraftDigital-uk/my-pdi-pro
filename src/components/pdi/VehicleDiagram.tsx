import { useState } from 'react';
import { Damage, DamageType, DAMAGE_COLORS, DAMAGE_LABELS } from '@/types/pdi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Paintbrush, X } from 'lucide-react';

interface PanelDef {
  name: string;
  gridArea: string;
}

const TOP_PANELS: PanelDef[] = [
  { name: 'Front Bumper', gridArea: '1 / 2 / 2 / 4' },
  { name: 'Bonnet', gridArea: '2 / 2 / 4 / 4' },
  { name: 'LF Wing', gridArea: '2 / 1 / 4 / 2' },
  { name: 'RF Wing', gridArea: '2 / 4 / 4 / 5' },
  { name: 'Windscreen', gridArea: '4 / 2 / 5 / 4' },
  { name: 'LF Door', gridArea: '5 / 1 / 7 / 2' },
  { name: 'RF Door', gridArea: '5 / 4 / 7 / 5' },
  { name: 'Roof', gridArea: '5 / 2 / 8 / 4' },
  { name: 'LR Door', gridArea: '7 / 1 / 9 / 2' },
  { name: 'RR Door', gridArea: '7 / 4 / 9 / 5' },
  { name: 'Rear Window', gridArea: '8 / 2 / 9 / 4' },
  { name: 'LR Quarter', gridArea: '9 / 1 / 11 / 2' },
  { name: 'RR Quarter', gridArea: '9 / 4 / 11 / 5' },
  { name: 'Boot', gridArea: '9 / 2 / 11 / 4' },
  { name: 'Rear Bumper', gridArea: '11 / 2 / 12 / 4' },
];

const LEFT_PANELS: PanelDef[] = [
  { name: 'L Front Bumper', gridArea: '2 / 1 / 3 / 2' },
  { name: 'L Front Wing', gridArea: '2 / 2 / 3 / 3' },
  { name: 'L Front Door', gridArea: '2 / 3 / 3 / 5' },
  { name: 'L Rear Door', gridArea: '2 / 5 / 3 / 7' },
  { name: 'L Rear Quarter', gridArea: '2 / 7 / 3 / 8' },
  { name: 'L Rear Bumper', gridArea: '2 / 8 / 3 / 9' },
  { name: 'L Roof', gridArea: '1 / 3 / 2 / 7' },
  { name: 'L Sill', gridArea: '3 / 2 / 4 / 8' },
  { name: 'L Mirror', gridArea: '1 / 2 / 2 / 3' },
];

const RIGHT_PANELS: PanelDef[] = [
  { name: 'R Front Bumper', gridArea: '2 / 1 / 3 / 2' },
  { name: 'R Front Wing', gridArea: '2 / 2 / 3 / 3' },
  { name: 'R Front Door', gridArea: '2 / 3 / 3 / 5' },
  { name: 'R Rear Door', gridArea: '2 / 5 / 3 / 7' },
  { name: 'R Rear Quarter', gridArea: '2 / 7 / 3 / 8' },
  { name: 'R Rear Bumper', gridArea: '2 / 8 / 3 / 9' },
  { name: 'R Roof', gridArea: '1 / 3 / 2 / 7' },
  { name: 'R Sill', gridArea: '3 / 2 / 4 / 8' },
  { name: 'R Mirror', gridArea: '1 / 7 / 2 / 8' },
];

const FRONT_PANELS: PanelDef[] = [
  { name: 'F Bumper', gridArea: '3 / 1 / 4 / 5' },
  { name: 'F Bonnet Edge', gridArea: '1 / 2 / 2 / 4' },
  { name: 'F Windscreen', gridArea: '1 / 1 / 2 / 5' },
  { name: 'F Left Light', gridArea: '2 / 1 / 3 / 2' },
  { name: 'F Grille', gridArea: '2 / 2 / 3 / 4' },
  { name: 'F Right Light', gridArea: '2 / 4 / 3 / 5' },
];

const REAR_PANELS: PanelDef[] = [
  { name: 'R Bumper', gridArea: '3 / 1 / 4 / 5' },
  { name: 'R Boot', gridArea: '1 / 2 / 2 / 4' },
  { name: 'R Window', gridArea: '1 / 1 / 2 / 5' },
  { name: 'R Left Light', gridArea: '2 / 1 / 3 / 2' },
  { name: 'R Number Plate', gridArea: '2 / 2 / 3 / 4' },
  { name: 'R Right Light', gridArea: '2 / 4 / 3 / 5' },
];

const WHEEL_POSITIONS = ['FL', 'FR', 'RL', 'RR'];

const DAMAGE_TYPES: DamageType[] = ['scratch', 'dent', 'chip', 'scuff', 'crack'];

interface Props {
  damages: Damage[];
  damageNotes: string;
  onAddDamage: (damage: Omit<Damage, 'id'>) => void;
  onRemoveDamage: (id: string) => void;
  onNotesChange: (notes: string) => void;
}

const VIEW_CONFIGS: Record<string, { panels: PanelDef[]; cols: number; rows: number; label: string }> = {
  top: { panels: TOP_PANELS, cols: 4, rows: 11, label: 'Top View' },
  left: { panels: LEFT_PANELS, cols: 8, rows: 3, label: 'Left Side' },
  right: { panels: RIGHT_PANELS, cols: 8, rows: 3, label: 'Right Side' },
  front: { panels: FRONT_PANELS, cols: 4, rows: 3, label: 'Front View' },
  rear: { panels: REAR_PANELS, cols: 4, rows: 3, label: 'Rear View' },
};

export const VehicleDiagram = ({ damages, damageNotes, onAddDamage, onRemoveDamage, onNotesChange }: Props) => {
  const [selectedPanel, setSelectedPanel] = useState<{ panel: string; view: string } | null>(null);
  const [activeView, setActiveView] = useState('top');

  const getPanelDamages = (panel: string, view: string) =>
    damages.filter(d => d.panel === panel && d.view === view);

  const handlePanelClick = (panel: string, view: string) => {
    setSelectedPanel({ panel, view });
  };

  const handleDamageSelect = (type: DamageType) => {
    if (!selectedPanel) return;
    onAddDamage({ panel: selectedPanel.panel, view: selectedPanel.view, type });
    setSelectedPanel(null);
  };

  const renderView = (viewKey: string) => {
    const config = VIEW_CONFIGS[viewKey];
    return (
      <div className="space-y-3">
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
            gridTemplateRows: `repeat(${config.rows}, minmax(36px, auto))`,
          }}
        >
          {config.panels.map((p) => {
            const panelDamages = getPanelDamages(p.name, viewKey);
            const isSelected = selectedPanel?.panel === p.name && selectedPanel?.view === viewKey;
            return (
              <div
                key={p.name}
                style={{ gridArea: p.gridArea }}
                className={`panel-cell ${panelDamages.length > 0 ? 'has-damage' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => handlePanelClick(p.name, viewKey)}
              >
                <span className="text-[10px] leading-tight block">{p.name}</span>
                {panelDamages.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5 justify-center">
                    {panelDamages.map(d => (
                      <span
                        key={d.id}
                        className="damage-badge"
                        style={{ backgroundColor: DAMAGE_COLORS[d.type], color: '#fff' }}
                      >
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
    );
  };

  return (
    <section className="pdi-section">
      <div className="pdi-section-header">
        <span className="pdi-section-number">3</span>
        <Paintbrush className="h-5 w-5 text-primary" />
        <h2 className="pdi-section-title">Cosmetic Condition</h2>
      </div>

      {/* Damage type legend */}
      <div className="flex flex-wrap gap-3 mb-4 p-3 bg-secondary rounded-lg">
        {DAMAGE_TYPES.map(t => (
          <div key={t} className="flex items-center gap-1.5 text-xs">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: DAMAGE_COLORS[t] }} />
            <span className="capitalize font-medium">{t}</span>
          </div>
        ))}
      </div>

      {/* Damage selector */}
      {selectedPanel && (
        <div className="mb-4 p-4 border border-accent rounded-lg bg-accent/5">
          <p className="text-sm font-medium mb-2">
            Select damage type for <span className="text-accent font-semibold">{selectedPanel.panel}</span>:
          </p>
          <div className="flex flex-wrap gap-2">
            {DAMAGE_TYPES.map(t => (
              <Button
                key={t}
                size="sm"
                variant="outline"
                onClick={() => handleDamageSelect(t)}
                className="capitalize text-xs"
                style={{ borderColor: DAMAGE_COLORS[t], color: DAMAGE_COLORS[t] }}
              >
                {t}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={() => setSelectedPanel(null)} className="text-xs">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Tabs value={activeView} onValueChange={setActiveView}>
        <TabsList className="mb-4 no-print">
          {Object.entries(VIEW_CONFIGS).map(([key, cfg]) => (
            <TabsTrigger key={key} value={key} className="text-xs">{cfg.label}</TabsTrigger>
          ))}
        </TabsList>
        {Object.keys(VIEW_CONFIGS).map(key => (
          <TabsContent key={key} value={key}>
            <div className="max-w-md mx-auto">
              {renderView(key)}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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
                onClick={() => handlePanelClick(`Wheel ${pos}`, 'wheels')}
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

      {/* Notes */}
      <div className="mt-4 space-y-1.5">
        <label className="text-sm font-medium">Damage Notes</label>
        <Textarea
          placeholder="Additional notes about cosmetic condition..."
          value={damageNotes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="bg-card"
          rows={3}
        />
      </div>
    </section>
  );
};
