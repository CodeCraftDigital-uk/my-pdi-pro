import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Clock, CheckCircle2, AlertCircle, Archive, Car, User, Send, Loader2, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useDeleteCaptureRequest } from '@/hooks/useCaptureRequest';
import type { CaptureRequest } from '@/types/capture';

interface CaptureRequestCardProps {
  request: CaptureRequest;
  onClick: () => void;
}

const statusConfig: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700', icon: <Clock size={10} /> },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700', icon: <Clock size={10} /> },
  completed: { label: 'Completed', className: 'bg-emerald-100 text-emerald-700', icon: <CheckCircle2 size={10} /> },
  expired: { label: 'Expired', className: 'bg-red-100 text-red-700', icon: <AlertCircle size={10} /> },
  archived: { label: 'Archived', className: 'bg-slate-100 text-slate-600', icon: <Archive size={10} /> },
};

const CaptureRequestCard = ({ request, onClick }: CaptureRequestCardProps) => {
  const [sendingEmail, setSendingEmail] = useState(false);
  const deleteMutation = useDeleteCaptureRequest();
  const status = statusConfig[request.status] || statusConfig.pending;
  const isExpired = new Date(request.expires_at) < new Date() && request.status === 'pending';
  const vehicleRef = request.vehicle_registration || request.vehicle_vin || 'No vehicle ref';
  const expiresIn = formatDistanceToNow(new Date(request.expires_at), { addSuffix: true });
  const captureUrl = `${window.location.origin}/capture/${request.token}`;
  const canResend = request.status === 'pending' && !isExpired;

  const handleResendEmail = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!request.seller_email) {
      navigator.clipboard.writeText(captureUrl);
      toast({ title: 'Link copied', description: 'No email on file — link copied to clipboard instead.' });
      return;
    }
    setSendingEmail(true);
    try {
      const { error } = await supabase.functions.invoke('send-capture-link', {
        body: {
          sellerName: request.seller_name,
          sellerEmail: request.seller_email,
          captureUrl,
          dealerName: request.dealer_name,
          vehicleRef: request.vehicle_registration || request.vehicle_vin,
          expiresAt: request.expires_at,
        },
      });
      if (error) throw error;
      toast({ title: 'Email resent', description: `Capture link sent to ${request.seller_email}` });
    } catch (err: any) {
      toast({ title: 'Failed to send', description: err.message, variant: 'destructive' });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(captureUrl);
    toast({ title: 'Link copied to clipboard' });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const confirmDelete = () => {
    deleteMutation.mutate(request.id, {
      onSuccess: () => toast({ title: 'Deleted', description: 'Capture request has been permanently removed.' }),
      onError: (err: any) => toast({ title: 'Delete failed', description: err.message, variant: 'destructive' }),
    });
  };

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl border border-border shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-border/80 transition-all duration-200 flex flex-col gap-3"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <User size={14} className="text-muted-foreground shrink-0" />
          <span className="font-semibold text-foreground text-sm truncate">{request.seller_name}</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold shrink-0 ${isExpired ? statusConfig.expired.className : status.className}`}>
          {isExpired ? statusConfig.expired.icon : status.icon}
          {isExpired ? 'Expired' : status.label}
        </span>
      </div>

      {/* Vehicle ref */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Car size={12} />
        <span>{vehicleRef}</span>
      </div>

      {/* Expiry */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock size={12} />
        <span>{isExpired ? 'Expired' : `Expires ${expiresIn}`}</span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-1">
        {canResend && (
          <>
            <Button
              onClick={handleResendEmail}
              disabled={sendingEmail}
              size="sm"
              variant="outline"
              className="gap-1.5 text-xs flex-1"
            >
              {sendingEmail ? (
                <><Loader2 size={12} className="animate-spin" /> Sending...</>
              ) : (
                <><Send size={12} /> {request.seller_email ? 'Send Email' : 'Copy Link'}</>
              )}
            </Button>
            <Button
              onClick={handleCopyLink}
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs shrink-0"
            >
              <Copy size={12} /> Copy
            </Button>
          </>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              onClick={handleDelete}
              size="sm"
              variant="ghost"
              className="gap-1.5 text-xs shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent onClick={(e) => e.stopPropagation()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete capture request?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this capture request for <strong>{request.seller_name}</strong>, including all uploaded media, notes, and submissions. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CaptureRequestCard;
