import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Copy, Link2, Loader2, Mail, Send } from 'lucide-react';
import { useCreateCaptureRequest } from '@/hooks/useCaptureRequest';
import { CAPTURE_STEPS, defaultRequiredSteps } from '@/types/capture';
import type { RequiredSteps, CaptureRequest, CaptureStepKey } from '@/types/capture';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CreateCaptureModalProps {
  onClose: () => void;
  onCreated: (req: CaptureRequest) => void;
}

const CreateCaptureModal = ({ onClose, onCreated }: CreateCaptureModalProps) => {
  const createMutation = useCreateCaptureRequest();
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [vehicleReg, setVehicleReg] = useState('');
  const [vehicleVin, setVehicleVin] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [dealerName, setDealerName] = useState(() => localStorage.getItem('autoprov_dealer_name') || '');
  const [dealerEmail, setDealerEmail] = useState(() => localStorage.getItem('autoprov_dealer_email') || '');
  const [expiryPreset, setExpiryPreset] = useState('48h');
  const [requiredSteps, setRequiredSteps] = useState<RequiredSteps>(defaultRequiredSteps);
  const [createdRequest, setCreatedRequest] = useState<CaptureRequest | null>(null);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const toggleStep = (key: CaptureStepKey) => {
    setRequiredSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getExpiryDate = (): string => {
    const now = new Date();
    switch (expiryPreset) {
      case '24h': return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
      case '48h': return new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
      case '72h': return new Date(now.getTime() + 72 * 60 * 60 * 1000).toISOString();
      case '7d': return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
      default: return new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
    }
  };

  const handleCreate = async () => {
    if (!sellerName.trim()) {
      toast({ title: 'Seller name is required', variant: 'destructive' });
      return;
    }
    try {
      // Persist dealer details for next time
      if (dealerName.trim()) localStorage.setItem('autoprov_dealer_name', dealerName.trim());
      if (dealerEmail.trim()) localStorage.setItem('autoprov_dealer_email', dealerEmail.trim());

      const result = await createMutation.mutateAsync({
        seller_name: sellerName.trim(),
        seller_email: sellerEmail.trim() || undefined,
        seller_phone: sellerPhone.trim() || undefined,
        vehicle_registration: vehicleReg.trim() || undefined,
        vehicle_vin: vehicleVin.trim() || undefined,
        internal_notes: internalNotes.trim() || undefined,
        dealer_name: dealerName.trim() || undefined,
        dealer_email: dealerEmail.trim() || undefined,
        expires_at: getExpiryDate(),
        required_steps: requiredSteps,
      });
      setCreatedRequest(result);
      onCreated(result);
    } catch (err: any) {
      toast({ title: 'Failed to create request', description: err.message, variant: 'destructive' });
    }
  };

  const captureUrl = createdRequest
    ? `${window.location.origin}/capture/${createdRequest.token}`
    : '';

  const handleSendEmail = async () => {
    if (!createdRequest?.seller_email) return;
    setSendingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-capture-link', {
        body: {
          sellerName: createdRequest.seller_name,
          sellerEmail: createdRequest.seller_email,
          captureUrl,
          dealerName: createdRequest.dealer_name,
          vehicleRef: createdRequest.vehicle_registration || createdRequest.vehicle_vin,
          expiresAt: createdRequest.expires_at,
        },
      });
      if (error) throw error;
      setEmailSent(true);
      toast({ title: 'Email sent', description: `Capture link sent to ${createdRequest.seller_email}` });
    } catch (err: any) {
      toast({ title: 'Failed to send email', description: err.message, variant: 'destructive' });
    } finally {
      setSendingEmail(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(captureUrl);
    toast({ title: 'Link copied to clipboard' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-card rounded-2xl border border-border shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">
            {createdRequest ? 'Capture Link Generated' : 'New Capture Request'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {createdRequest ? (
            /* Success state — show generated link */
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 text-center space-y-3">
                <Link2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Secure capture link generated</p>
              </div>

              <div className="flex gap-2">
                <Input value={captureUrl} readOnly className="text-xs flex-1" />
                <Button onClick={copyLink} size="sm" variant="outline" className="gap-2 shrink-0">
                  <Copy size={14} /> Copy
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Send this link to <strong>{createdRequest.seller_name}</strong>. 
                They can complete the capture on their mobile device without logging in.
              </p>

              {/* Email send section */}
              {createdRequest.seller_email ? (
                <div className="border border-border rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Mail size={16} className="text-muted-foreground" />
                    Send link via email
                  </div>
                  {emailSent ? (
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                      ✓ Email sent to {createdRequest.seller_email}
                    </p>
                  ) : (
                    <Button
                      onClick={handleSendEmail}
                      disabled={sendingEmail}
                      variant="outline"
                      className="w-full gap-2"
                    >
                      {sendingEmail ? (
                        <><Loader2 size={14} className="animate-spin" /> Sending...</>
                      ) : (
                        <><Send size={14} /> Send to {createdRequest.seller_email}</>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  No seller email provided — share the link manually.
                </p>
              )}

              <Button onClick={onClose} className="w-full" style={{ background: '#1e3a5f' }}>
                Done
              </Button>
            </div>
          ) : (
            /* Create form */
            <>
              {/* Seller details */}
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Seller Details</p>
                <div>
                  <Label className="text-xs">Seller Name *</Label>
                  <Input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="Full name" maxLength={100} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Email</Label>
                    <Input value={sellerEmail} onChange={e => setSellerEmail(e.target.value)} placeholder="email@example.com" type="email" maxLength={255} />
                  </div>
                  <div>
                    <Label className="text-xs">Phone</Label>
                    <Input value={sellerPhone} onChange={e => setSellerPhone(e.target.value)} placeholder="07..." maxLength={20} />
                  </div>
                </div>
              </div>

              {/* Vehicle details */}
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Vehicle Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Registration</Label>
                    <Input value={vehicleReg} onChange={e => setVehicleReg(e.target.value)} placeholder="AB12 CDE" maxLength={10} />
                  </div>
                  <div>
                    <Label className="text-xs">VIN</Label>
                    <Input value={vehicleVin} onChange={e => setVehicleVin(e.target.value)} placeholder="Vehicle VIN" maxLength={17} />
                  </div>
                </div>
              </div>

              {/* Dealer details */}
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Dealer Details (shown to seller)</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Dealer Name</Label>
                    <Input value={dealerName} onChange={e => setDealerName(e.target.value)} placeholder="Your dealership" maxLength={100} />
                  </div>
                  <div>
                    <Label className="text-xs">Dealer Email</Label>
                    <Input value={dealerEmail} onChange={e => setDealerEmail(e.target.value)} placeholder="dealer@example.com" type="email" maxLength={255} />
                  </div>
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <Label className="text-xs">Internal Notes</Label>
                <Textarea value={internalNotes} onChange={e => setInternalNotes(e.target.value)} placeholder="Notes for your reference only..." rows={2} maxLength={500} />
              </div>

              {/* Expiry */}
              <div>
                <Label className="text-xs">Link Expiry</Label>
                <Select value={expiryPreset} onValueChange={setExpiryPreset}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 hours</SelectItem>
                    <SelectItem value="48h">48 hours</SelectItem>
                    <SelectItem value="72h">72 hours</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Required capture steps */}
              <div className="space-y-3">
                <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground">Required Capture Steps</p>
                <div className="space-y-2">
                  {CAPTURE_STEPS.map(cs => (
                    <label key={cs.key} className="flex items-center justify-between gap-3 py-2 px-3 rounded-lg border border-border hover:bg-muted/50 cursor-pointer">
                      <div>
                        <span className="text-sm font-medium text-foreground">{cs.label}</span>
                        <span className="text-xs text-muted-foreground block">{cs.description}</span>
                      </div>
                      <Switch
                        checked={requiredSteps[cs.key]}
                        onCheckedChange={() => toggleStep(cs.key)}
                      />
                    </label>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending || !sellerName.trim()}
                className="w-full gap-2"
                style={{ background: '#1e3a5f' }}
              >
                {createMutation.isPending ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : 'Generate Secure Link'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCaptureModal;
