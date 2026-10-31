// Run after: npm install --no-save --package-lock=false @electric-sql/pglite
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import assert from "node:assert/strict";
const db = new PGlite();
await db.exec(`
CREATE ROLE anon; CREATE ROLE authenticated;
CREATE SCHEMA auth; CREATE SCHEMA storage;
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
CREATE FUNCTION auth.role() RETURNS text LANGUAGE sql STABLE AS $$ SELECT nullif(current_setting('request.jwt.claim.role', true),'') $$;
CREATE FUNCTION storage.foldername(text) RETURNS text[] LANGUAGE sql IMMUTABLE AS $$ SELECT string_to_array($1, '/') $$;
CREATE TABLE auth.users(id uuid PRIMARY KEY);
CREATE TYPE public.app_role AS ENUM ('member','admin');
CREATE TABLE public.profiles(id uuid PRIMARY KEY REFERENCES auth.users, role app_role DEFAULT 'member' NOT NULL, display_name text, created_at timestamptz DEFAULT now());
CREATE TABLE public.posts(id uuid PRIMARY KEY, slug text UNIQUE NOT NULL, content_type text NOT NULL, category text NOT NULL, title_ko text NOT NULL, summary_ko text, body_ko text NOT NULL, author_ko text, created_by uuid REFERENCES profiles, status text DEFAULT 'draft', published_at timestamptz, created_at timestamptz, updated_at timestamptz, is_pinned boolean, is_featured boolean, cover_image_url text);
CREATE TABLE public.post_images(id uuid PRIMARY KEY, post_id uuid REFERENCES posts, image_url text NOT NULL, alt_ko text, display_order integer NOT NULL);
CREATE TABLE storage.buckets(id text PRIMARY KEY, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
CREATE TABLE storage.objects(id uuid DEFAULT gen_random_uuid(), bucket_id text, name text);
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
GRANT USAGE ON SCHEMA public, auth, storage TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON storage.objects, profiles TO anon, authenticated;
-- Deliberately permissive legacy policies test that the new guards still work.
CREATE POLICY old_open_profiles ON profiles FOR ALL TO authenticated USING(true) WITH CHECK(true);
CREATE POLICY old_open_posts ON posts FOR ALL TO authenticated USING(true) WITH CHECK(true);
CREATE POLICY old_open_images ON post_images FOR ALL TO authenticated USING(true) WITH CHECK(true);
CREATE POLICY old_open_storage ON storage.objects FOR ALL TO authenticated USING(true) WITH CHECK(true);
`);
const migration = await readFile(
  new URL("../supabase/admin-publishing.sql", import.meta.url),
  "utf8",
);
await db.exec(migration);
await db.exec(migration); // Rerunnable.
const admin = "10000000-0000-4000-8000-000000000001",
  member = "10000000-0000-4000-8000-000000000002";
await db.exec(
  `INSERT INTO auth.users VALUES ('${admin}'),('${member}'); INSERT INTO profiles(id,role,display_name) VALUES ('${admin}','admin','ACA Admin'),('${member}','member','Member');`,
);
async function as(role, id = "") {
  await db.exec(
    `RESET ROLE; SELECT set_config('request.jwt.claim.sub','${id}',false); SELECT set_config('request.jwt.claim.role','${role}',false); SET ROLE ${role};`,
  );
}
const post = {
  id: "20000000-0000-4000-8000-000000000001",
  content_type: "notice",
  title: "공지 제목",
  description: "설명",
  category: "공지",
  body: "본문\n둘째 줄",
};
const call = (value, images = []) =>
  db.query("SELECT public.aca_publish_post($1::jsonb,$2::jsonb) AS id", [
    JSON.stringify(value),
    JSON.stringify(images),
  ]);
await as("authenticated", admin);
assert.equal((await call(post)).rows[0].id, post.id);
assert.equal((await call(post)).rows[0].id, post.id);
assert.equal(
  (await db.query("SELECT count(*)::int n FROM posts")).rows[0].n,
  1,
);
for (const content_type of ["research", "archive"])
  await call({ ...post, content_type, id: crypto.randomUUID() });
await assert.rejects(call({ ...post, id: crypto.randomUUID(), title: " " }));
const picturePost = { ...post, id: crypto.randomUUID() };
const pictures = [0, 1].map((n) => ({
  path: `${admin}/${picturePost.id}/${n}.png`,
  url: `https://aca-test.supabase.co/storage/v1/object/public/aca-post-images/${admin}/${picturePost.id}/${n}.png`,
  alt: `image ${n}`,
}));
for (const picture of pictures)
  await db.query(
    "INSERT INTO storage.objects(bucket_id,name) VALUES ('aca-post-images',$1)",
    [picture.path],
  );
await call(picturePost, pictures);
assert.deepEqual(
  (
    await db.query(
      "SELECT display_order,alt_ko FROM post_images WHERE post_id=$1 ORDER BY display_order",
      [picturePost.id],
    )
  ).rows,
  [
    { display_order: 0, alt_ko: "image 0" },
    { display_order: 1, alt_ko: "image 1" },
  ],
);
await as("authenticated", member);
await assert.rejects(call({ ...post, id: crypto.randomUUID() }));
await assert.rejects(
  db.exec(`UPDATE profiles SET role='admin' WHERE id='${member}'`),
);
await assert.rejects(
  db.exec(
    `INSERT INTO posts(id,slug,content_type,category,title_ko,body_ko) VALUES(gen_random_uuid(),'bad','notice','bad','bad','bad')`,
  ),
);
await assert.rejects(
  db.exec(
    `INSERT INTO storage.objects(bucket_id,name) VALUES ('aca-post-images','${member}/bad.png')`,
  ),
);
await as("anon");
assert.equal(
  (await db.query("SELECT count(*)::int n FROM posts")).rows[0].n,
  4,
);
await assert.rejects(call({ ...post, id: crypto.randomUUID() }));
// Force an image-row failure AFTER post insert, verifying atomic rollback.
await db.exec(
  "RESET ROLE; ALTER TABLE post_images ADD CONSTRAINT fail_second CHECK(display_order <> 1) NOT VALID",
);
await as("authenticated", admin);
const failing = { ...post, id: crypto.randomUUID() };
const badImages = pictures.map((p) => ({
  ...p,
  path: p.path.replace(picturePost.id, failing.id),
  url: p.url.replace(picturePost.id, failing.id),
}));
for (const picture of badImages)
  await db.query(
    "INSERT INTO storage.objects(bucket_id,name) VALUES ('aca-post-images',$1)",
    [picture.path],
  );
await assert.rejects(call(failing, badImages));
assert.equal(
  (
    await db.query("SELECT count(*)::int n FROM posts WHERE id=$1", [
      failing.id,
    ])
  ).rows[0].n,
  0,
);
console.log(
  "PASS: rerunnable migration, admin publishing in 3 sections, Korean text, duplicate retry, required fields, image ordering, member/anonymous rejection, role escalation prevention, storage guard, atomic rollback.",
);
await db.close();
