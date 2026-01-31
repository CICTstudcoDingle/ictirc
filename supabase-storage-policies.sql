-- Storage policies for event-images, archive, and research guides buckets
-- Run this in your Supabase SQL Editor

-- ============================================
-- EVENT IMAGES BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update event images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete event images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload event images" ON storage.objects;
DROP POLICY IF EXISTS "Public download event images" ON storage.objects;

-- Policy: Anyone can upload event images
CREATE POLICY "Public upload event images"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-images');

-- Policy: Anyone can view event images
CREATE POLICY "Public download event images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'event-images');

-- ============================================
-- ARCHIVE BUCKET (Published Papers)
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('archive', 'archive', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload to archive" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload to archive" ON storage.objects;
DROP POLICY IF EXISTS "Public can view archive" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update archive" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from archive" ON storage.objects;
DROP POLICY IF EXISTS "Public upload archive" ON storage.objects;
DROP POLICY IF EXISTS "Public download archive" ON storage.objects;

-- Policy: Anyone can upload to archive
CREATE POLICY "Public upload archive"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'archive');

-- Policy: Anyone can view archive
CREATE POLICY "Public download archive"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'archive');

-- ============================================
-- RESEARCH GUIDES BUCKET
-- ============================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('research guides', 'research guides', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload research guides" ON storage.objects;
DROP POLICY IF EXISTS "Public can view research guides" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update research guides" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete research guides" ON storage.objects;
DROP POLICY IF EXISTS "Public upload research guides" ON storage.objects;
DROP POLICY IF EXISTS "Public download research guides" ON storage.objects;

-- Policy: Anyone can upload research guides
CREATE POLICY "Public upload research guides"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'research guides');

-- Policy: Anyone can view research guides
CREATE POLICY "Public download research guides"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'research guides');
