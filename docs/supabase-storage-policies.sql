-- =====================================================
-- SUPABASE STORAGE RLS POLICIES - SIMPLIFIED VERSION
-- =====================================================
-- Run this in Supabase SQL Editor

-- =====================================================
-- OPTION 1: SIMPLE APPROACH (RECOMMENDED)
-- =====================================================
-- Make the profile bucket PUBLIC with simple policies

-- For the "profile" bucket:
-- 1. In Supabase Dashboard > Storage > profile bucket > Configuration
--    Set "Public bucket" to ON

-- Then run these policies:

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'profile' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'profile' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'profile' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access (since bucket is public)
CREATE POLICY "Public can view all avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile');


-- =====================================================
-- OPTION 2: IF OPTION 1 DOESN'T WORK
-- =====================================================
-- Temporarily disable RLS on the profile bucket for testing
-- (Re-enable it later after confirming it works)

-- ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- After testing, re-enable with:
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;


-- =====================================================
-- FOR ARCHIVE BUCKET (Manuscripts)
-- =====================================================
-- Keep archive bucket PRIVATE in dashboard

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload manuscripts"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'archive');

-- Allow authenticated users to read their uploads
CREATE POLICY "Users can read manuscripts"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'archive');

-- Allow admins to delete
CREATE POLICY "Admins can delete manuscripts"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'archive'
  AND EXISTS (
    SELECT 1 FROM public."User" u
    WHERE u.id = auth.uid()
    AND u.role IN ('DEAN', 'EDITOR')
  )
);
