// Browser integration tests with mocked Supabase responses; run with a local Vite server.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || undefined,
  });
  const adminId = "10000000-0000-4000-8000-000000000001";
  const published = [];
  let uploads = 0,
    rpcCalls = 0,
    failRpc = false;
  async function client(role, width = 1280) {
    const context = await browser.newContext({
      viewport: { width, height: 960 },
    });
    const payload = Buffer.from(
      JSON.stringify({
        sub: adminId,
        role: "authenticated",
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString("base64url");
    await context.addInitScript(
      ({ role, id, payload }) => {
        localStorage.setItem("i18nextLng", "ko");
        if (role)
          localStorage.setItem(
            "sb-aca-test-auth-token",
            JSON.stringify({
              access_token: `eyJhbGciOiJIUzI1NiJ9.${payload}.test`,
              refresh_token: "test-refresh",
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              expires_in: 3600,
              token_type: "bearer",
              user: {
                id,
                email: "admin@example.com",
                app_metadata: {},
                user_metadata: {},
                aud: "authenticated",
                created_at: new Date().toISOString(),
              },
            }),
          );
      },
      { role, id: adminId, payload },
    );
    await context.route("https://aca-test.supabase.co/**", async (route) => {
      const url = new URL(route.request().url());
      let response;
      if (url.pathname === "/auth/v1/user")
        response = { id: adminId, email: "admin@example.com" };
      else if (url.pathname === "/auth/v1/logout") {
        await route.fulfill({ status: 204 });
        return;
      } else if (url.pathname === "/rest/v1/profiles") {
        if (role === "error") {
          await route.fulfill({
            status: 403,
            json: { message: "permission denied" },
          });
          return;
        }
        response = role === "missing" ? null : { role };
      } else if (url.pathname.includes("/storage/v1/object/")) {
        uploads++;
        response = { Key: "uploaded" };
      } else if (url.pathname === "/rest/v1/rpc/aca_publish_post") {
        rpcCalls++;
        const args = route.request().postDataJSON();
        const p = args.p_post;
        if (!published.some((post) => post.id === p.id))
          published.push({
            id: p.id,
            content_type: p.content_type,
            category: p.category,
            title_ko: p.title,
            title_en: null,
            summary_ko: p.description,
            body_ko: p.body,
            author_ko: "Admin",
            published_at: new Date().toISOString(),
            cover_image_url: args.p_images[0]?.url,
            post_images: args.p_images.map((image, i) => ({
              id: String(i),
              image_url: image.url,
              alt_ko: image.alt,
              display_order: i,
            })),
          });
        if (failRpc) {
          failRpc = false;
          await route.abort();
          return;
        }
        response = p.id;
      } else if (url.pathname === "/rest/v1/posts") {
        const id = url.searchParams.get("id")?.replace("eq.", "");
        response = id
          ? (published.find((post) => post.id === id) ?? null)
          : published.filter(
              (post) =>
                post.content_type ===
                url.searchParams.get("content_type")?.replace("eq.", ""),
            );
      } else response = {};
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(response),
      });
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    return { context, page, errors };
  }
  for (const role of [null, "member", "missing", "error"]) {
    const { context, page, errors } = await client(role);
    for (const section of ["notices", "research", "archive"]) {
      await page.goto(`http://127.0.0.1:5173/${section}`);
      await page.getByText("아직 등록된 게시물이 없습니다.").waitFor();
      assert.equal(
        await page
          .getByRole("link", { name: "게시물 쓰기", exact: true })
          .count(),
        0,
      );
      await page.goto(`http://127.0.0.1:5173/${section}/write`);
      await page
        .getByRole("heading", { name: "관리자 권한이 필요합니다" })
        .waitFor();
      assert.equal(
        await page
          .getByRole("button", { name: "게시물 등록", exact: true })
          .count(),
        0,
      );
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
  const { context, page, errors } = await client("admin", 390);
  for (const section of ["notices", "research", "archive"]) {
    await page.goto(`http://127.0.0.1:5173/${section}`);
    await page
      .getByRole("link", { name: "게시물 쓰기", exact: true })
      .waitFor();
    assert.equal(
      await page
        .getByRole("link", { name: "게시물 쓰기", exact: true })
        .getAttribute("href"),
      `/${section}/write`,
    );
  }
  await page.goto("http://127.0.0.1:5173/notices/write");
  await page.getByLabel("제목", { exact: true }).fill("테스트 공지");
  await page.getByLabel("설명 / 요약", { exact: true }).fill("짧은 설명");
  await page.getByLabel("카테고리", { exact: true }).fill("행사");
  await page.getByLabel("본문", { exact: true }).fill("첫째 줄\n둘째 줄");
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jR1sAAAAASUVORK5CYII=",
    "base64",
  );
  await page.getByLabel("사진 추가", { exact: true }).setInputFiles([
    { name: "one.png", mimeType: "image/png", buffer: png },
    { name: "two.png", mimeType: "image/png", buffer: png },
  ]);
  await page
    .getByLabel("사진 설명 (선택)", { exact: true })
    .nth(0)
    .fill("첫 사진");
  await page
    .getByLabel("사진 설명 (선택)", { exact: true })
    .nth(1)
    .fill("둘째 사진");
  await page
    .getByRole("button", { name: "아래로", exact: true })
    .nth(0)
    .click();
  assert.equal(
    await page
      .getByLabel("사진 설명 (선택)", { exact: true })
      .nth(0)
      .inputValue(),
    "둘째 사진",
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  fs.mkdirSync("test-results", { recursive: true });
  await page.screenshot({
    path: "test-results/editor-mobile.png",
    fullPage: true,
  });
  failRpc = true;
  await page.getByRole("button", { name: "게시물 등록", exact: true }).click();
  await page.getByRole("alert").waitFor();
  assert.equal(
    await page.getByLabel("제목", { exact: true }).inputValue(),
    "테스트 공지",
  );
  await page.getByRole("button", { name: "다시 시도", exact: true }).click();
  await page.waitForURL(/\/notices\/[a-f0-9-]{36}$/);
  await page
    .getByRole("heading", { name: "테스트 공지", exact: true })
    .waitFor();
  assert.equal(published.length, 1);
  assert.equal(rpcCalls, 2);
  assert.equal(uploads, 2);
  assert.equal(published[0].post_images[0].alt_ko, "둘째 사진");
  await page.goto("http://127.0.0.1:5173/notices");
  await page
    .getByRole("heading", { name: "테스트 공지", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "로그아웃", exact: true }).click();
  await page.goto("http://127.0.0.1:5173/notices");
  await page.getByRole("link", { name: "로그인", exact: true }).waitFor();
  assert.equal(
    await page.getByRole("link", { name: "게시물 쓰기", exact: true }).count(),
    0,
  );
  assert.deepEqual(errors, []);
  await context.close();
  await browser.close();
  console.log(
    "PASS: anonymous/member/missing/error access denied on all 3 routes, admin buttons, editor, multiple images/reorder, mobile layout, failure retention, idempotent retry, post detail/list, logout.",
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
