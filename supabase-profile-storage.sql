-- Todayis Project - Profile Image Storage RLS Policies
-- Supabase Dashboard > SQL Editor에서 실행
-- Run as: postgres (또는 service_role)

-- 1. Upload own image
DROP POLICY IF EXISTS "Users can upload their own profile image" ON storage.objects;
CREATE POLICY "Users can upload their own profile image"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = (storage.foldername(name))[1]
        AND bucket_id = 'profile-images'
        AND split_part(name, '.', -1) IN ('jpg', 'jpeg', 'png', 'webp', 'gif')
    );

-- 2. View own image
DROP POLICY IF EXISTS "Users can view their own profile image" ON storage.objects;
CREATE POLICY "Users can view their own profile image"
    ON storage.objects
    FOR SELECT
    USING (
        auth.uid()::text = (storage.foldername(name))[1]
        AND bucket_id = 'profile-images'
    );

-- 3. Delete own image
DROP POLICY IF EXISTS "Users can delete their own profile image" ON storage.objects;
CREATE POLICY "Users can delete their own profile image"
    ON storage.objects
    FOR DELETE
    USING (
        auth.uid()::text = (storage.foldername(name))[1]
        AND bucket_id = 'profile-images'
    );

-- 4. View public images
DROP POLICY IF EXISTS "Anyone can view public profile images" ON storage.objects;
CREATE POLICY "Anyone can view public profile images"
    ON storage.objects
    FOR SELECT
    USING (
        bucket_id = 'profile-images'
    );
