import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, Download, Send, MessageSquare, Clock, User, Car, CheckCircle2, AlertCircle, Archive, Loader2, Mail, Phone, Hash, Printer } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCaptureMedia, useCaptureSubmission, useCaptureNotes, useAddCaptureNote, useUpdateCaptureStatus } from '@/hooks/useCaptureRequest';
import { getMediaSignedUrl } from '@/hooks/useCaptureRequest';
import { toast } from '@/hooks/use-toast';
import autoprovIcon from '@/assets/autoprov_icon.png';
import type { CaptureRequest, CaptureMedia } from '@/types/capture';

interface CaptureReviewPanelProps {
  request: CaptureRequest;
  onBack: () => void;
}

const MEDIA_SECTIONS = [
  { prefix: 'exterior_', label: 'Exterior' },
  { prefix: 'damage_', label: 'Damage' },
  { prefix: 'interior_', label: 'Interior' },
  { prefix: 'dashboard_', label: 'Dashboard' },
  { prefix: 'vin_', label: 'VIN Plate' },
  { prefix: 'tyre_', label: 'Tyres' },
  { prefix: 'walkaround_', label: 'Walkaround Video' },
  { prefix: 'service_history_', label: 'Service History' },
];

const CaptureReviewPanel = ({ request, onBack }: CaptureReviewPanelProps) => {
  const { data: media = [] } = useCaptureMedia(request.id);
  const { data: submission } = useCaptureSubmission(request.id);
  const { data: notes = [] } = useCaptureNotes(request.id);
  const addNoteMutation = useAddCaptureNote();
  const updateStatusMutation = useUpdateCaptureStatus();
  const [newNote, setNewNote] = useState('');
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});
  const [loadingUrls, setLoadingUrls] = useState(true);

  // Load signed URLs for all media
  useEffect(() => {
    if (media.length === 0) { setLoadingUrls(false); return; }
    let cancelled = false;
    const loadUrls = async () => {
      const urls: Record<string, string> = {};
      for (const m of media) {
        try {
          urls[m.id] = await getMediaSignedUrl(m.file_path);
        } catch { /* skip */ }
      }
      if (!cancelled) {
        setMediaUrls(urls);
        setLoadingUrls(false);
      }
    };
    loadUrls();
    return () => { cancelled = true; };
  }, [media]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await addNoteMutation.mutateAsync({ captureRequestId: request.id, noteText: newNote.trim() });
      setNewNote('');
      toast({ title: 'Note added' });
    } catch (err: any) {
      toast({ title: 'Failed to add note', variant: 'destructive' });
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id: request.id, status: status as any });
      toast({ title: `Status updated to ${status}` });
    } catch (err: any) {
      toast({ title: 'Failed to update status', variant: 'destructive' });
    }
  };

  const downloadFile = async (m: CaptureMedia) => {
    try {
      const url = mediaUrls[m.id] || await getMediaSignedUrl(m.file_path);
      const a = document.createElement('a');
      a.href = url;
      a.download = m.file_path.split('/').pop() || 'file';
      a.target = '_blank';
      a.click();
    } catch {
      toast({ title: 'Download failed', variant: 'destructive' });
    }
  };

  const vehicleRef = request.vehicle_registration || request.vehicle_vin || 'No vehicle ref';

  const handlePrint = () => window.print();

  return (
    <>
    <div className="min-h-screen bg-background print:hidden">
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </button>
          <div className="flex-1" />
          <Button onClick={handlePrint} size="sm" variant="outline" className="gap-2 text-xs" disabled={loadingUrls}>
            <Printer size={14} /> Print / Save PDF
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Request details header */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User size={16} className="text-muted-foreground" />
                <h2 className="text-lg font-bold text-foreground">{request.seller_name}</h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car size={14} />
                <span>{vehicleRef}</span>
              </div>
            </div>

            <Select value={request.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Customer & Vehicle Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-muted/40 rounded-lg p-4 text-sm">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Customer Details</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-foreground">
                  <User size={13} className="text-muted-foreground shrink-0" />
                  <span>{request.seller_name}</span>
                </div>
                {request.seller_email && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Mail size={13} className="text-muted-foreground shrink-0" />
                    <span>{request.seller_email}</span>
                  </div>
                )}
                {request.seller_phone && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Phone size={13} className="text-muted-foreground shrink-0" />
                    <span>{request.seller_phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Vehicle Details</p>
              <div className="space-y-1.5">
                {request.vehicle_registration && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Car size={13} className="text-muted-foreground shrink-0" />
                    <span className="font-mono font-semibold">{request.vehicle_registration}</span>
                  </div>
                )}
                {request.vehicle_vin && (
                  <div className="flex items-center gap-2 text-foreground">
                    <Hash size={13} className="text-muted-foreground shrink-0" />
                    <span className="font-mono text-xs">{request.vehicle_vin}</span>
                  </div>
                )}
                {!request.vehicle_registration && !request.vehicle_vin && (
                  <p className="text-muted-foreground text-xs">No vehicle details provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Submission info */}
          {submission && (
            <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg p-3 space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 size={14} /> Submitted by {submission.declaration_name}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                {new Date(submission.submitted_at).toLocaleString('en-GB')} · {submission.device_type} · {submission.no_damage_confirmed ? 'No damage declared' : 'Damage photos included'}
              </p>
            </div>
          )}
        </div>

        {/* Media sections */}
        {loadingUrls ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          MEDIA_SECTIONS.map(section => {
            const sectionMedia = media.filter(m => m.step.startsWith(section.prefix));
            if (sectionMedia.length === 0) return null;
            return (
              <div key={section.prefix} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <h3 className="text-sm font-bold text-foreground">{section.label}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {sectionMedia.map(m => (
                    <div key={m.id} className="relative group rounded-lg overflow-hidden border border-border bg-muted aspect-square">
                      {m.file_type === 'video' ? (
                        <video src={mediaUrls[m.id]} controls className="w-full h-full object-cover" />
                      ) : (
                        <img src={mediaUrls[m.id]} alt={m.step} className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => downloadFile(m)}
                        className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Download size={14} />
                      </button>
                      <span className="absolute top-1 left-1 text-[10px] font-medium bg-black/50 text-white px-1.5 py-0.5 rounded">
                        {m.step.replace(section.prefix, '').replace(/_/g, ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}

        {media.length === 0 && !loadingUrls && (
          <div className="text-center py-12">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No media uploaded yet</p>
          </div>
        )}

        {/* Notes section */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <MessageSquare size={14} /> Internal Notes
          </h3>

          <div className="flex gap-2">
            <Textarea
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows={2}
              maxLength={500}
              className="flex-1"
            />
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || addNoteMutation.isPending}
              size="sm"
              className="shrink-0"
              style={{ background: '#1e3a5f' }}
            >
              Add
            </Button>
          </div>

          {notes.length > 0 && (
            <div className="space-y-2 mt-3">
              {notes.map(note => (
                <div key={note.id} className="bg-muted/50 rounded-lg p-3 text-sm text-foreground">
                  <p>{note.note_text}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.created_at).toLocaleString('en-GB')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* ── PRINT-ONLY LAYOUT ── */}
    <div className="hidden print:block capture-print-root">
      {/* Print Header */}
      <div className="capture-print-header">
        <div>
          <div style={{ fontSize: '14pt', fontWeight: 800, color: '#1a3558' }}>
            Remote Appraisal Report
          </div>
          <div style={{ fontSize: '8pt', color: '#666', marginTop: '2pt' }}>
            Generated {new Date().toLocaleDateString('en-GB')} · Ref: {request.id.slice(0, 8).toUpperCase()}
          </div>
        </div>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '4pt' }}>
          <div>
            <div style={{ fontSize: '7pt', color: '#999' }}>Generated using the AutoProv Platform</div>
          </div>
          <img src={autoprovIcon} alt="AutoProv" style={{ width: '28pt', height: '28pt', objectFit: 'contain' }} />
        </div>
      </div>

      {/* Customer & Vehicle info */}
      <div className="capture-print-details">
        <div className="capture-print-detail-col">
          <div className="capture-print-detail-heading">Customer Details</div>
          <div className="capture-print-detail-row"><span className="capture-print-label">Name:</span> {request.seller_name}</div>
          {request.seller_email && <div className="capture-print-detail-row"><span className="capture-print-label">Email:</span> {request.seller_email}</div>}
          {request.seller_phone && <div className="capture-print-detail-row"><span className="capture-print-label">Phone:</span> {request.seller_phone}</div>}
        </div>
        <div className="capture-print-detail-col">
          <div className="capture-print-detail-heading">Vehicle Details</div>
          {request.vehicle_registration && <div className="capture-print-detail-row"><span className="capture-print-label">Registration:</span> <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{request.vehicle_registration}</span></div>}
          {request.vehicle_vin && <div className="capture-print-detail-row"><span className="capture-print-label">VIN:</span> <span style={{ fontFamily: 'monospace', fontSize: '8pt' }}>{request.vehicle_vin}</span></div>}
          <div className="capture-print-detail-row"><span className="capture-print-label">Status:</span> {request.status.replace('_', ' ').toUpperCase()}</div>
          <div className="capture-print-detail-row"><span className="capture-print-label">Created:</span> {new Date(request.created_at).toLocaleDateString('en-GB')}</div>
        </div>
      </div>

      {/* Submission */}
      {submission && (
        <div className="capture-print-submission">
          <strong>Seller Declaration:</strong> Submitted by {submission.declaration_name} on {new Date(submission.submitted_at).toLocaleString('en-GB')} · {submission.device_type} · {submission.no_damage_confirmed ? 'No damage declared' : 'Damage photos included'}
        </div>
      )}

      {/* Media sections */}
      {MEDIA_SECTIONS.map(section => {
        const sectionMedia = media.filter(m => m.step.startsWith(section.prefix));
        if (sectionMedia.length === 0) return null;
        return (
          <div key={section.prefix} className="capture-print-media-section">
            <div className="capture-print-media-heading">{section.label}</div>
            <div className="capture-print-media-grid">
              {sectionMedia.filter(m => m.file_type !== 'video').map(m => (
                <div key={m.id} className="capture-print-media-item">
                  <img src={mediaUrls[m.id]} alt={m.step} />
                  <span className="capture-print-media-label">{m.step.replace(section.prefix, '').replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Notes */}
      {notes.length > 0 && (
        <div className="capture-print-notes">
          <div className="capture-print-media-heading">Internal Notes</div>
          {notes.map(note => (
            <div key={note.id} className="capture-print-note-item">
              <span>{note.note_text}</span>
              <span className="capture-print-note-date">{new Date(note.created_at).toLocaleString('en-GB')}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="capture-print-footer">
        This report was generated using the AutoProv Platform (autexa.ai). The content of this report is the responsibility of the issuing business.
      </div>
    </div>
    </>
  );
};

export default CaptureReviewPanel;
