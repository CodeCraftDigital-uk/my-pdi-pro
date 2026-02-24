import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type {
  CaptureRequest,
  CaptureSubmission,
  CaptureMedia,
  CaptureNote,
  CreateCaptureRequestInput,
  CaptureStatus,
} from '@/types/capture';

// ─── Fetch all capture requests ───
export function useCaptureRequests(statusFilter?: CaptureStatus | 'all') {
  return useQuery({
    queryKey: ['capture-requests', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('capture_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as unknown as CaptureRequest[];
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

// ─── Fetch single capture request by token ───
export function useCaptureRequestByToken(token: string | undefined) {
  return useQuery({
    queryKey: ['capture-request-token', token],
    queryFn: async () => {
      if (!token) throw new Error('No token provided');
      const { data, error } = await supabase
        .from('capture_requests')
        .select('*')
        .eq('token', token)
        .maybeSingle();
      if (error) throw error;
      if (!data) throw new Error('Capture request not found');
      return data as unknown as CaptureRequest;
    },
    enabled: !!token,
  });
}

// ─── Fetch single capture request by ID ───
export function useCaptureRequestById(id: string | undefined) {
  return useQuery({
    queryKey: ['capture-request', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID');
      const { data, error } = await supabase
        .from('capture_requests')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as CaptureRequest;
    },
    enabled: !!id,
  });
}

// ─── Fetch media for a capture request ───
export function useCaptureMedia(captureRequestId: string | undefined) {
  return useQuery({
    queryKey: ['capture-media', captureRequestId],
    queryFn: async () => {
      if (!captureRequestId) return [];
      const { data, error } = await supabase
        .from('capture_media')
        .select('*')
        .eq('capture_request_id', captureRequestId)
        .order('uploaded_at', { ascending: true });
      if (error) throw error;
      return data as unknown as CaptureMedia[];
    },
    enabled: !!captureRequestId,
  });
}

// ─── Fetch submission for a capture request ───
export function useCaptureSubmission(captureRequestId: string | undefined) {
  return useQuery({
    queryKey: ['capture-submission', captureRequestId],
    queryFn: async () => {
      if (!captureRequestId) return null;
      const { data, error } = await supabase
        .from('capture_submissions')
        .select('*')
        .eq('capture_request_id', captureRequestId)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as CaptureSubmission | null;
    },
    enabled: !!captureRequestId,
  });
}

// ─── Fetch notes for a capture request ───
export function useCaptureNotes(captureRequestId: string | undefined) {
  return useQuery({
    queryKey: ['capture-notes', captureRequestId],
    queryFn: async () => {
      if (!captureRequestId) return [];
      const { data, error } = await supabase
        .from('capture_notes')
        .select('*')
        .eq('capture_request_id', captureRequestId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as unknown as CaptureNote[];
    },
    enabled: !!captureRequestId,
  });
}

// ─── Create capture request ───
export function useCreateCaptureRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCaptureRequestInput) => {
      const { data, error } = await supabase
        .from('capture_requests')
        .insert({
          seller_name: input.seller_name,
          seller_email: input.seller_email || null,
          seller_phone: input.seller_phone || null,
          vehicle_registration: input.vehicle_registration || null,
          vehicle_vin: input.vehicle_vin || null,
          internal_notes: input.internal_notes || null,
          dealer_name: input.dealer_name || null,
          dealer_email: input.dealer_email || null,
          expires_at: input.expires_at,
          required_steps: input.required_steps as any,
        } as any)
        .select()
        .single();
      if (error) throw error;
      return data as unknown as CaptureRequest;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['capture-requests'] }),
  });
}

// ─── Update capture request status ───
export function useUpdateCaptureStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: CaptureStatus }) => {
      // Get current status first for audit log
      const { data: current } = await supabase
        .from('capture_requests')
        .select('status')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('capture_requests')
        .update({ status } as any)
        .eq('id', id);
      if (error) throw error;

      // Log status change
      await supabase.from('capture_status_log').insert({
        capture_request_id: id,
        old_status: (current as any)?.status || null,
        new_status: status,
      } as any);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['capture-requests'] });
      qc.invalidateQueries({ queryKey: ['capture-request'] });
    },
  });
}

// ─── Delete capture request (cascading) ───
export function useDeleteCaptureRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      // Delete related media files from storage first
      const { data: mediaFiles } = await supabase
        .from('capture_media')
        .select('file_path')
        .eq('capture_request_id', id);

      if (mediaFiles && mediaFiles.length > 0) {
        const paths = mediaFiles.map((m: any) => m.file_path);
        await supabase.storage.from('capture-media').remove(paths);
      }

      // Delete related rows in order
      await supabase.from('capture_media').delete().eq('capture_request_id', id);
      await supabase.from('capture_notes').delete().eq('capture_request_id', id);
      await supabase.from('capture_submissions').delete().eq('capture_request_id', id);
      await supabase.from('capture_status_log').delete().eq('capture_request_id', id);

      // Delete the request itself
      const { error } = await supabase.from('capture_requests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['capture-requests'] });
    },
  });
}

// ─── Add note ───
export function useAddCaptureNote() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ captureRequestId, noteText }: { captureRequestId: string; noteText: string }) => {
      const { error } = await supabase
        .from('capture_notes')
        .insert({ capture_request_id: captureRequestId, note_text: noteText } as any);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['capture-notes'] }),
  });
}

// ─── Upload media file ───
export async function uploadCaptureMedia(
  captureRequestId: string,
  step: string,
  file: File,
): Promise<CaptureMedia> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${captureRequestId}/${step}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('capture-media')
    .upload(path, file, { upsert: false });
  if (uploadError) throw uploadError;

  const fileType = file.type.startsWith('video/') ? 'video' : 'image';

  const { data, error } = await supabase
    .from('capture_media')
    .insert({
      capture_request_id: captureRequestId,
      step,
      file_path: path,
      file_type: fileType,
      file_size: file.size,
    } as any)
    .select()
    .single();
  if (error) throw error;
  return data as unknown as CaptureMedia;
}

// ─── Delete media file ───
export async function deleteCaptureMedia(media: CaptureMedia) {
  await supabase.storage.from('capture-media').remove([media.file_path]);
  const { error } = await supabase.from('capture_media').delete().eq('id', media.id);
  if (error) throw error;
}

// ─── Get signed URL for media ───
export async function getMediaSignedUrl(filePath: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('capture-media')
    .createSignedUrl(filePath, 3600);
  if (error) throw error;
  return data.signedUrl;
}

// ─── Submit capture (seller declaration) ───
export async function submitCapture(
  captureRequestId: string,
  declaration: {
    declarationName: string;
    noDamageConfirmed: boolean;
  },
): Promise<CaptureSubmission> {
  const { data, error } = await supabase
    .from('capture_submissions')
    .insert({
      capture_request_id: captureRequestId,
      declaration_name: declaration.declarationName,
      declaration_confirmed: true,
      no_damage_confirmed: declaration.noDamageConfirmed,
      ip_address: null, // Would need edge function for real IP
      user_agent: navigator.userAgent,
      device_type: /Mobile|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    } as any)
    .select()
    .single();
  if (error) throw error;

  // Update request status to completed
  await supabase
    .from('capture_requests')
    .update({ status: 'completed' } as any)
    .eq('id', captureRequestId);

  return data as unknown as CaptureSubmission;
}
