
-- Drop storage policies that reference capture_requests
DROP POLICY IF EXISTS "Scoped upload to capture-media" ON storage.objects;
DROP POLICY IF EXISTS "Scoped read from capture-media" ON storage.objects;
DROP POLICY IF EXISTS "Scoped delete from capture-media" ON storage.objects;

-- Drop tables in dependency order
DROP TABLE IF EXISTS public.capture_media;
DROP TABLE IF EXISTS public.capture_notes;
DROP TABLE IF EXISTS public.capture_status_log;
DROP TABLE IF EXISTS public.capture_submissions;
DROP TABLE IF EXISTS public.capture_requests;

-- Drop the enum type
DROP TYPE IF EXISTS public.capture_status;
