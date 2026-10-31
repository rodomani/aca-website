-- Read-only: inspect this output before applying admin-publishing.sql.
SELECT table_name, column_name, data_type, udt_name, is_nullable, column_default
FROM information_schema.columns WHERE table_schema='public'
AND table_name IN ('profiles','posts','post_images') ORDER BY table_name, ordinal_position;
SELECT conrelid::regclass AS table_name, conname, pg_get_constraintdef(oid) AS definition
FROM pg_constraint WHERE conrelid IN ('public.profiles'::regclass,'public.posts'::regclass,'public.post_images'::regclass);
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies WHERE (schemaname='public' AND tablename IN ('profiles','posts','post_images')) OR (schemaname='storage' AND tablename='objects');
SELECT content_type, status, count(*) FROM public.posts GROUP BY content_type,status;
SELECT t.typname, e.enumlabel FROM pg_type t JOIN pg_enum e ON e.enumtypid=t.oid WHERE t.typname='app_role' ORDER BY e.enumsortorder;
