
-- Drop all permissive "allow all" policies
DROP POLICY IF EXISTS "Allow all access to capture_requests" ON public.capture_requests;
DROP POLICY IF EXISTS "Allow all access to capture_submissions" ON public.capture_submissions;
DROP POLICY IF EXISTS "Allow all access to capture_media" ON public.capture_media;
DROP POLICY IF EXISTS "Allow all access to capture_notes" ON public.capture_notes;
DROP POLICY IF EXISTS "Allow all access to capture_status_log" ON public.capture_status_log;

-- Create deny-all policies (no access without authentication)
CREATE POLICY "Deny all access" ON public.capture_requests FOR ALL USING (false) WITH CHECK (false);
CREATE POLICY "Deny all access" ON public.capture_submissions FOR ALL USING (false) WITH CHECK (false);
CREATE POLICY "Deny all access" ON public.capture_media FOR ALL USING (false) WITH CHECK (false);
CREATE POLICY "Deny all access" ON public.capture_notes FOR ALL USING (false) WITH CHECK (false);
CREATE POLICY "Deny all access" ON public.capture_status_log FOR ALL USING (false) WITH CHECK (false);
