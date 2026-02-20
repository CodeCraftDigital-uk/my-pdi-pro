import { useRef, useState, useEffect } from 'react';
import { DeliverySignOff } from '@/types/distanceSale';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Truck, RotateCcw } from 'lucide-react';

interface Props {
  data: DeliverySignOff;
  onUpdate: (field: keyof DeliverySignOff, value: boolean | string) => void;
}

const DSSStepDelivery = ({ data, onUpdate }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Restore saved signature on mount
  useEffect(() => {
    if (data.customerSignature && canvasRef.current) {
      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      };
      img.src = data.customerSignature;
    }
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDrawing(true);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !lastPos.current) return;
    const pos = getPos(e, canvas);
    ctx.strokeStyle = '#0f2240';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = () => {
    setDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    onUpdate('customerSignature', canvas.toDataURL());
    onUpdate('signatureTimestamp', new Date().toISOString());
  };

  const clearSig = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onUpdate('customerSignature', '');
    onUpdate('signatureTimestamp', '');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#e8f0f9]">
          <Truck size={20} className="text-[#1e3a5f]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Delivery Condition Sign-Off</h2>
          <p className="text-sm text-muted-foreground">Confirm delivery details and capture customer acknowledgement.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Delivery Date</Label>
          <Input type="date" value={data.deliveryDate} onChange={(e) => onUpdate('deliveryDate', e.target.value)} className="bg-background/60" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Delivery Mileage</Label>
          <Input type="number" value={data.deliveryMileage} placeholder="e.g. 45120" onChange={(e) => onUpdate('deliveryMileage', e.target.value)} className="bg-background/60" />
        </div>
      </div>

      {/* Delivered by */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Delivered By</Label>
        <div className="flex flex-wrap gap-3">
          {(['Dealer', 'Third Party'] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="deliveredBy"
                value={opt}
                checked={data.deliveredBy === opt}
                onChange={() => onUpdate('deliveredBy', opt)}
                className="accent-[#1e3a5f]"
              />
              <span className="text-sm text-foreground">{opt}</span>
            </label>
          ))}
        </div>
        {data.deliveredBy && (
          <Input
            value={data.deliveredByName}
            placeholder={data.deliveredBy === 'Dealer' ? 'Driver / Sales Rep name' : 'Delivery company name'}
            onChange={(e) => onUpdate('deliveredByName', e.target.value)}
            className="bg-background/60 mt-1 max-w-sm"
          />
        )}
      </div>

      {/* Customer confirms */}
      <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
        <Checkbox
          checked={data.customerConfirmsCondition}
          onCheckedChange={(v) => onUpdate('customerConfirmsCondition', !!v)}
          className="mt-0.5 shrink-0"
        />
        <span className="text-sm text-foreground font-medium leading-snug">
          Customer confirms they have received the vehicle and that it was delivered in the agreed condition as described prior to sale.
        </span>
      </label>

      {/* Signature pad */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Customer Signature</Label>
          <button
            type="button"
            onClick={clearSig}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw size={12} /> Clear
          </button>
        </div>
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <canvas
            ref={canvasRef}
            width={700}
            height={160}
            className="w-full h-36 cursor-crosshair touch-none"
            style={{ display: 'block' }}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          <div className="px-3 py-1.5 border-t border-border bg-muted/20 text-[10px] text-muted-foreground">
            Draw signature above using mouse or touch
          </div>
        </div>
        {data.signatureTimestamp && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Signed: {new Date(data.signatureTimestamp).toLocaleString('en-GB')}
          </p>
        )}
      </div>
    </div>
  );
};

export default DSSStepDelivery;
