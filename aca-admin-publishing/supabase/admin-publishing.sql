-- ACA admin publishing setup. Review and run in Supabase SQL Editor as postgres.
-- Targets the EXISTING tables from the supplied schema diagram. No tables/data are dropped.
-- App vocabulary: posts.content_type = notice/research/archive; status = published.
-- If existing CHECK constraints use different values, reconcile them before running/testing.
BEGIN;

CREATE OR REPLACE FUNCTION public.aca_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = '' AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role::text = 'admin');
$$;
REVOKE ALL ON FUNCTION public.aca_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aca_is_admin() TO anon, authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_images ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.posts, public.post_images TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.posts, public.post_images TO authenticated;

-- Do not trust user-supplied signup metadata for administrative roles.
-- Existing profile policies cannot bypass this trigger.
CREATE OR REPLACE FUNCTION public.aca_protect_profile_role()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN
  IF auth.role() IN ('anon', 'authenticated') AND NOT public.aca_is_admin() THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.role::text = 'admin' THEN RAISE EXCEPTION 'Only administrators can assign admin roles'; END IF;
    ELSIF NEW.role IS DISTINCT FROM OLD.role OR NEW.id IS DISTINCT FROM OLD.id THEN
      RAISE EXCEPTION 'Only administrators can change profile roles or identity';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.aca_protect_profile_role() FROM PUBLIC;
DROP TRIGGER IF EXISTS aca_protect_profile_role ON public.profiles;
CREATE TRIGGER aca_protect_profile_role BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.aca_protect_profile_role();

DROP POLICY IF EXISTS aca_profile_read ON public.profiles;
CREATE POLICY aca_profile_read ON public.profiles FOR SELECT TO authenticated
USING (id = (SELECT auth.uid()) OR (SELECT public.aca_is_admin()));

DROP POLICY IF EXISTS aca_profile_insert_guard ON public.profiles;
CREATE POLICY aca_profile_insert_guard ON public.profiles AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK ((id = (SELECT auth.uid()) AND role::text <> 'admin') OR (SELECT public.aca_is_admin()));
DROP POLICY IF EXISTS aca_profile_update_guard ON public.profiles;
CREATE POLICY aca_profile_update_guard ON public.profiles AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (id = (SELECT auth.uid()) OR (SELECT public.aca_is_admin()))
WITH CHECK (id = (SELECT auth.uid()) OR (SELECT public.aca_is_admin()));
DROP POLICY IF EXISTS aca_profile_delete_guard ON public.profiles;
CREATE POLICY aca_profile_delete_guard ON public.profiles AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (id = (SELECT auth.uid()) OR (SELECT public.aca_is_admin()));

-- Restrictive policies prevent older permissive policies from granting non-admin writes.
DO $$
DECLARE table_name text; command_name text;
BEGIN
  FOREACH table_name IN ARRAY ARRAY['posts', 'post_images'] LOOP
    EXECUTE format('DROP POLICY IF EXISTS aca_admin_write ON public.%I', table_name);
    EXECUTE format('CREATE POLICY aca_admin_write ON public.%I FOR ALL TO authenticated USING ((SELECT public.aca_is_admin())) WITH CHECK ((SELECT public.aca_is_admin()))', table_name);
    FOREACH command_name IN ARRAY ARRAY['INSERT','UPDATE','DELETE'] LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', 'aca_require_admin_' || lower(command_name), table_name);
      IF command_name = 'INSERT' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK ((SELECT public.aca_is_admin()))', 'aca_require_admin_insert', table_name);
      ELSIF command_name = 'UPDATE' THEN
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING ((SELECT public.aca_is_admin())) WITH CHECK ((SELECT public.aca_is_admin()))', 'aca_require_admin_update', table_name);
      ELSE
        EXECUTE format('CREATE POLICY %I ON public.%I AS RESTRICTIVE FOR DELETE TO anon, authenticated USING ((SELECT public.aca_is_admin()))', 'aca_require_admin_delete', table_name);
      END IF;
    END LOOP;
  END LOOP;
END;
$$;
DROP POLICY IF EXISTS aca_read_posts ON public.posts;
CREATE POLICY aca_read_posts ON public.posts FOR SELECT TO anon, authenticated USING (status = 'published');
DROP POLICY IF EXISTS aca_visible_posts ON public.posts;
CREATE POLICY aca_visible_posts ON public.posts AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING (status = 'published' OR (SELECT public.aca_is_admin()));
DROP POLICY IF EXISTS aca_read_images ON public.post_images;
CREATE POLICY aca_read_images ON public.post_images FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.status = 'published'));
DROP POLICY IF EXISTS aca_visible_images ON public.post_images;
CREATE POLICY aca_visible_images ON public.post_images AS RESTRICTIVE FOR SELECT TO anon, authenticated
USING ((SELECT public.aca_is_admin()) OR EXISTS (SELECT 1 FROM public.posts p WHERE p.id = post_id AND p.status = 'published'));

-- A dedicated bucket for PUBLIC article pictures, not confidential documents.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('aca-post-images', 'aca-post-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = EXCLUDED.file_size_limit, allowed_mime_types = EXCLUDED.allowed_mime_types;
DROP POLICY IF EXISTS aca_image_admin ON storage.objects;
CREATE POLICY aca_image_admin ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'aca-post-images' AND (SELECT public.aca_is_admin()) AND (storage.foldername(name))[1] = (SELECT auth.uid())::text)
WITH CHECK (bucket_id = 'aca-post-images' AND (SELECT public.aca_is_admin()) AND (storage.foldername(name))[1] = (SELECT auth.uid())::text);
-- Scope restrictive policies to this bucket; leave other buckets unaffected.
DROP POLICY IF EXISTS aca_image_insert_guard ON storage.objects;
CREATE POLICY aca_image_insert_guard ON storage.objects AS RESTRICTIVE FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id <> 'aca-post-images' OR ((SELECT public.aca_is_admin()) AND (storage.foldername(name))[1] = (SELECT auth.uid())::text));
DROP POLICY IF EXISTS aca_image_update_guard ON storage.objects;
CREATE POLICY aca_image_update_guard ON storage.objects AS RESTRICTIVE FOR UPDATE TO anon, authenticated
USING (bucket_id <> 'aca-post-images' OR ((SELECT public.aca_is_admin()) AND (storage.foldername(name))[1] = (SELECT auth.uid())::text))
WITH CHECK (bucket_id <> 'aca-post-images' OR ((SELECT public.aca_is_admin()) AND (storage.foldername(name))[1] = (SELECT auth.uid())::text));
DROP POLICY IF EXISTS aca_image_delete_guard ON storage.objects;
CREATE POLICY aca_image_delete_guard ON storage.objects AS RESTRICTIVE FOR DELETE TO anon, authenticated
USING (bucket_id <> 'aca-post-images' OR ((SELECT public.aca_is_admin()) AND (storage.foldername(name))[1] = (SELECT auth.uid())::text));

-- The post and ordered image rows commit together. RLS still applies (SECURITY INVOKER).
CREATE OR REPLACE FUNCTION public.aca_publish_post(p_post jsonb, p_images jsonb DEFAULT '[]'::jsonb)
RETURNS uuid LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  post_id uuid := (p_post->>'id')::uuid;
  author_name text;
  image jsonb;
  image_index integer := 0;
  existing_author uuid;
BEGIN
  IF NOT public.aca_is_admin() THEN RAISE EXCEPTION 'Administrator role required' USING ERRCODE = '42501'; END IF;
  IF post_id IS NULL THEN RAISE EXCEPTION 'Post ID required'; END IF;
  -- Serialize retries for the same UUID, including requests still in flight.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(post_id::text, 0));
  SELECT created_by INTO existing_author FROM public.posts WHERE id = post_id;
  IF FOUND THEN
    IF existing_author = auth.uid() THEN RETURN post_id; END IF;
    RAISE EXCEPTION 'Post ID already exists';
  END IF;
  IF coalesce(p_post->>'content_type', '') NOT IN ('notice','research','archive') THEN RAISE EXCEPTION 'Invalid post section'; END IF;
  IF coalesce(length(btrim(p_post->>'title')),0) NOT BETWEEN 1 AND 200
    OR coalesce(length(btrim(p_post->>'description')),0) NOT BETWEEN 1 AND 2000
    OR coalesce(length(btrim(p_post->>'category')),0) NOT BETWEEN 1 AND 100
    OR coalesce(length(btrim(p_post->>'body')),0) NOT BETWEEN 1 AND 100000 THEN
    RAISE EXCEPTION 'Title, description, category and body are required and must fit the length limits';
  END IF;
  IF p_images IS NULL OR jsonb_typeof(p_images) <> 'array' THEN RAISE EXCEPTION 'Picture list must be an array'; END IF;
  IF jsonb_array_length(p_images) > 10 THEN RAISE EXCEPTION 'Maximum 10 pictures'; END IF;
  FOR image IN SELECT value FROM jsonb_array_elements(p_images) LOOP
    IF image->>'path' IS NULL OR NOT starts_with(image->>'path', auth.uid()::text || '/' || post_id::text || '/')
      OR image->>'url' IS NULL OR image->>'url' !~ '^https?://'
      OR right(image->>'url', length('/storage/v1/object/public/aca-post-images/' || (image->>'path'))) <> '/storage/v1/object/public/aca-post-images/' || (image->>'path')
      OR coalesce(length(image->>'alt'),0) > 300
      OR NOT EXISTS (SELECT 1 FROM storage.objects WHERE bucket_id = 'aca-post-images' AND name = image->>'path') THEN
      RAISE EXCEPTION 'Invalid or missing uploaded picture';
    END IF;
  END LOOP;
  SELECT coalesce(nullif(display_name, ''), 'ACA') INTO author_name FROM public.profiles WHERE id = auth.uid();
  INSERT INTO public.posts (id, slug, content_type, category, title_ko, summary_ko, body_ko,
    author_ko, created_by, status, published_at, created_at, updated_at, is_pinned, is_featured, cover_image_url)
  VALUES (post_id, 'post-' || post_id::text, p_post->>'content_type', btrim(p_post->>'category'),
    btrim(p_post->>'title'), btrim(p_post->>'description'), btrim(p_post->>'body'), author_name, auth.uid(),
    'published', now(), now(), now(), false, false, p_images->0->>'url');
  FOR image IN SELECT value FROM jsonb_array_elements(p_images) LOOP
    INSERT INTO public.post_images (id, post_id, image_url, alt_ko, display_order)
    VALUES (gen_random_uuid(), post_id, image->>'url', nullif(image->>'alt',''), image_index);
    image_index := image_index + 1;
  END LOOP;
  RETURN post_id;
END;
$$;
REVOKE ALL ON FUNCTION public.aca_publish_post(jsonb, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.aca_publish_post(jsonb, jsonb) TO authenticated;
COMMIT;
