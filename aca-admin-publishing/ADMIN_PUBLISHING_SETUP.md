# ACA admin publishing

This change adds an admin-only **게시물 쓰기 / Write a post** link to Notices, Research and Archive. Each opens its own `/write` route. Administrators enter a title, description, category, main content and an optional ordered picture list. Submitting publishes to the originating section and opens the new detail page.

## Apply the code

1. Commit or back up your existing working changes.
2. Extract `aca-admin-publishing.zip` into the repository root (the folder containing `package.json`), merging its `src`, `supabase` and `tests` folders. The ZIP includes full replacement versions of changed files. Compare them first if you have made other changes since the GitHub version reviewed here.
3. Keep your existing `.env.local` with `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. No secret/service-role key belongs in this app.
4. Run `npm ci`, then `npm run dev`.

No changes were pushed to GitHub or applied to your Supabase project.

## Configure Supabase

The implementation uses your supplied schema diagram; its defaults, constraints, existing triggers and policies were not available. First run `supabase/inspect-publishing-schema.sql` in SQL Editor. It is read-only.

Confirm the existing `profiles`, `posts` and `post_images` tables match the diagram. This implementation writes lowercase `content_type` values `notice`, `research`, `archive` and `status = 'published'`. If existing constraints or content use different values, reconcile the mapping in `src/utils/posts.ts`, the list/detail queries and the SQL before applying it. Do not remove valid constraints or delete existing posts to make this work. Share the inspection output if you need help mapping those values.

Then review and run `supabase/admin-publishing.sql` in SQL Editor as the database owner. It:

- Enables RLS on the three existing public tables; adds public reads for published content and an own-profile read for signed-in users.
- Adds administrator write policies AND restrictive guards so older permissive policies cannot allow ordinary users to write posts/images.
- Protects profile identity/role changes with a trigger and restricts profile writes to the owner or an administrator. Normal users cannot promote themselves.
- Creates the `aca-post-images` public Storage bucket, restricted to JPEG, PNG, WebP and GIF, 5 MiB per file. Upload/update/delete permissions require an admin and a user-owned folder. Other buckets are not targeted.
- Creates `aca_publish_post`, which checks the authenticated account's role and saves a post plus its image rows in one database transaction. The function runs as the caller so RLS applies.

Existing policy names outside this script are preserved, but the restrictive guards intentionally narrow access to these tables. Review existing policies before applying. This does not create a signup/profile trigger: accounts must already have their matching `profiles.id` row. Set your administrator's `role` to `admin` through the Supabase dashboard using the UUID from Authentication → Users. Never give signups an admin default.

## Field mapping

| Form | Database |
|---|---|
| Originating section | `posts.content_type` |
| Title | `posts.title_ko` |
| Description | `posts.summary_ko` |
| Category | `posts.category` |
| Main content | `posts.body_ko` |
| First picture | `posts.cover_image_url` |
| Picture URLs / descriptions / order | `post_images.image_url`, `alt_ko`, `display_order` |
| Author | Authenticated profile's display name / `posts.created_by` |

Text is stored in the Korean/source columns. English UI falls back to this source text when English translations are absent. Text is rendered as plain text, preserving line breaks; arbitrary HTML is not executed. Images appear after the text, in the chosen order. No editor, PDF-upload or translation feature beyond these fields is included.

## What changes on the public pages

Notices, Research and Archive now read published posts from Supabase instead of displaying the hard-coded sample records. They show empty/loading/error states. Previously hard-coded sample notice URLs no longer resolve through the new database detail route. The old source sample data files are retained but are not rendered by these routes. Store and Home are unchanged.

## Images and retries

Pictures are optional, maximum 10, with previews, remove and move-up/down controls. The first becomes the cover. The bucket is public: uploaded images are publicly retrievable, even before the database publication finishes. Only upload material intended for public display.

The form stays populated on failure. Once a publishing request starts, its fields lock; retry uses the same post UUID to avoid duplicates even if a successful server response was lost. Upload retries reuse the same object paths. A failed/abandoned upload may leave unused objects in Storage. They are deliberately not deleted automatically on an ambiguous error, which could otherwise break a post that actually committed. Check post/image references before removing unused uploads. Leaving/reloading does not preserve a draft; there is no persistent draft editor.

## Verify on your project

1. With no account, check all three pages: no write link. Direct `/notices/write`, `/research/write` and `/archive/write` must deny access.
2. Repeat as a non-admin, and then as an account with no profile. Both must be denied.
3. As an admin, open each write page and publish a post. Confirm it appears in that section and its detail URL still works after refresh.
4. Add several pictures; move the last one first and remove another. Verify the cover and saved order. Check non-image and oversized file rejection.
5. Simulate a network error, then retry. Verify one post exists and the text stays intact.
6. Sign out and verify the write link disappears. Verify direct database and Storage writes as a non-admin are rejected, even when bypassing the UI.
7. In production configure your host's SPA fallback to `index.html` so direct `/.../write` and detail URLs work. Set the Vite environment variables in the build environment and redeploy.

## Automated checks

- `npm run build`
- `npm run lint` (existing warnings in Footer, useMediaQuery and formatDate; no errors)
- Simulated-DOM component tests: install `vitest jsdom @testing-library/react` as development-only tools, then run `npx vitest run tests/publishing-components.test.tsx --maxWorkers=1`. Ten tests passed for access control, links, publishing, picture ordering/removal, validation and retry behavior.
- Full browser checks were not run successfully in this environment because Chromium was blocked by system permissions. The test script is included for running locally.
- Local SQL/RLS checks: install the development-only test dependency with `npm install --no-save --package-lock=false @electric-sql/pglite`, then `node tests/publishing-db.mjs`. This uses a disposable database with an assumed copy of the supplied schema, not your live project.
- Browser checks: install Playwright locally if necessary, install its Chromium browser, and run Vite with `VITE_SUPABASE_URL=https://aca-test.supabase.co` and `VITE_SUPABASE_PUBLISHABLE_KEY=test-publishable-key`. Then run `node tests/publishing-ui.cjs`. Supabase is mocked; never point this test at a live database. Its test credentials are placeholders.
