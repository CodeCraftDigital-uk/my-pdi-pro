
-- Create capture request status enum
CREATE TYPE public.capture_status AS ENUM ('pending', 'in_progress', 'completed', 'expired', 'archived');

-- Create capture_requests table
CREATE TABLE public.capture_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::text,
  dealer_name TEXT,
  dealer_email TEXT,
  seller_name TEXT NOT NULL,
  seller_email TEXT,
  seller_phone TEXT,
  vehicle_registration TEXT,
  vehicle_vin TEXT,
  internal_notes TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  required_steps JSONB NOT NULL DEFAULT '{}',
  status public.capture_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create capture_submissions table
CREATE TABLE public.capture_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capture_request_id UUID NOT NULL REFERENCES public.capture_requests(id) ON DELETE CASCADE,
  declaration_name TEXT,
  declaration_confirmed BOOLEAN NOT NULL DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  no_damage_confirmed BOOLEAN NOT NULL DEFAULT false
);

-- Create capture_media table
CREATE TABLE public.capture_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capture_request_id UUID NOT NULL REFERENCES public.capture_requests(id) ON DELETE CASCADE,
  submission_id UUID REFERENCES public.capture_submissions(id) ON DELETE SET NULL,
  step TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create capture_notes table
CREATE TABLE public.capture_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capture_request_id UUID NOT NULL REFERENCES public.capture_requests(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create capture_status_log table
CREATE TABLE public.capture_status_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  capture_request_id UUID NOT NULL REFERENCES public.capture_requests(id) ON DELETE CASCADE,
  old_status public.capture_status,
  new_status public.capture_status NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_capture_requests_token ON public.capture_requests(token);
CREATE INDEX idx_capture_requests_status ON public.capture_requests(status);
CREATE INDEX idx_capture_media_request ON public.capture_media(capture_request_id);
CREATE INDEX idx_capture_submissions_request ON public.capture_submissions(capture_request_id);

-- No RLS for MVP (no auth) — disable RLS on all tables
ALTER TABLE public.capture_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.capture_status_log ENABLE ROW LEVEL SECURITY;

-- Allow all access for MVP (no auth) with permissive policies
CREATE POLICY "Allow all access to capture_requests" ON public.capture_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to capture_submissions" ON public.capture_submissions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to capture_media" ON public.capture_media FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to capture_notes" ON public.capture_notes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to capture_status_log" ON public.capture_status_log FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for capture media (private bucket, access via signed URLs)
INSERT INTO storage.buckets (id, name, public) VALUES ('capture-media', 'capture-media', false);

-- Storage policies: allow anonymous uploads and reads for MVP
CREATE POLICY "Allow uploads to capture-media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'capture-media');
CREATE POLICY "Allow reading capture-media" ON storage.objects FOR SELECT USING (bucket_id = 'capture-media');
CREATE POLICY "Allow deleting from capture-media" ON storage.objects FOR DELETE USING (bucket_id = 'capture-media');
