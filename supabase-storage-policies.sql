-- Storage policies for event-images, archive, and research guides buckets
-- Run this in your Supabase SQL Editor

-- ============================================
-- EVENT IMAGES BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Allow authenticated users to upload (INSERT)
CREATE POLICY "Authenticated users can upload event images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Policy: Allow public read access (SELECT)
CREATE POLICY "Public can view event images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- Policy: Allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update event images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images')
WITH CHECK (bucket_id = 'event-images');

-- Policy: Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete event images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'event-images');

-- ============================================
-- ARCHIVE BUCKET (Published Papers)
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('archive', 'archive', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Allow authenticated users to upload to archive
CREATE POLICY "Authenticated users can upload to archive"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'archive');

-- Policy: Allow public read access to archive
CREATE POLICY "Public can view archive"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'archive');

-- Policy: Allow authenticated users to update archive
CREATE POLICY "Authenticated users can update archive"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'archive')
WITH CHECK (bucket_id = 'archive');

-- Policy: Allow authenticated users to delete from archive
CREATE POLICY "Authenticated users can delete from archive"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'archive');

-- ============================================
-- RESEARCH GUIDES BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('research guides', 'research guides', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy: Allow authenticated users to upload research guides
CREATE POLICY "Authenticated users can upload research guides"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'research guides');

-- Policy: Allow public read access to research guides
CREATE POLICY "Public can view research guides"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'research guides');

-- Policy: Allow authenticated users to update research guides
CREATE POLICY "Authenticated users can update research guides"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'research guides')
WITH CHECK (bucket_id = 'research guides');

-- Policy: Allow authenticated users to delete research guides
CREATE POLICY "Authenticated users can delete research guides"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'research guides');
