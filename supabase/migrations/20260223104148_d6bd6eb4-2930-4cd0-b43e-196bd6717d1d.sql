
-- ============================================================
-- FIX: Tighten storage policies for capture-media bucket
-- Restrict uploads to paths that reference a valid capture_request_id
-- Restrict reads/deletes to paths referencing valid capture requests
-- ============================================================

-- Drop existing permissive storage policies
DROP POLICY IF EXISTS "Allow uploads to capture-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow reading capture-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow deleting from capture-media" ON storage.objects;

-- Upload: only allow if the first folder segment matches a valid capture_request_id
CREATE POLICY "Scoped upload to capture-media" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'capture-media'
  AND EXISTS (
    SELECT 1 FROM public.capture_requests cr
    WHERE cr.id::text = (storage.foldername(name))[1]
    AND cr.status IN ('pending', 'in_progress')
  )
);

-- Read: only allow if the first folder segment matches a valid capture_request_id
CREATE POLICY "Scoped read from capture-media" ON storage.objects
FOR SELECT
USING (
  bucket_id = 'capture-media'
  AND EXISTS (
    SELECT 1 FROM public.capture_requests cr
    WHERE cr.id::text = (storage.foldername(name))[1]
  )
);

-- Delete: only allow for authenticated users (dealers) when auth is added
-- For now, restrict to paths matching valid capture requests
CREATE POLICY "Scoped delete from capture-media" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'capture-media'
  AND EXISTS (
    SELECT 1 FROM public.capture_requests cr
    WHERE cr.id::text = (storage.foldername(name))[1]
  )
);
