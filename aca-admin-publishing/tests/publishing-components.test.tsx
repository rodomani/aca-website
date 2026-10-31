// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "../src/locales/ko";
import en from "../src/locales/en";
import { AdminWriteButton } from "../src/components/ui/AdminWriteButton";
import { WritePost } from "../src/pages/posts/WritePost";
import { imageError } from "../src/utils/posts";

const state = vi.hoisted(() => ({
  user: "10000000-0000-4000-8000-000000000001" as string | null,
  role: "admin" as string | null,
  error: false,
  listeners: new Set<(event: string, session: unknown) => void>(),
  rpc: vi.fn(),
  upload: vi.fn(),
}));
vi.mock("../src/utils/supabase", () => ({
  supabase: {
    auth: {
      onAuthStateChange: (
        callback: (event: string, session: unknown) => void,
      ) => {
        state.listeners.add(callback);
        queueMicrotask(() => {
          if (state.listeners.has(callback))
            callback(
              "INITIAL_SESSION",
              state.user ? { user: { id: state.user } } : null,
            );
        });
        return {
          data: {
            subscription: {
              unsubscribe: () => state.listeners.delete(callback),
            },
          },
        };
      },
      getSession: async () => ({
        data: { session: state.user ? { user: { id: state.user } } : null },
      }),
      getUser: async () => ({
        data: { user: state.user ? { id: state.user } : null },
        error: null,
      }),
      signOut: async () => ({ error: null }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: state.role ? { role: state.role } : null,
            error: state.error ? { message: "Denied" } : null,
          }),
        }),
      }),
    }),
    storage: {
      from: () => ({
        upload: state.upload,
        getPublicUrl: (path: string) => ({
          data: {
            publicUrl: `https://example.com/storage/v1/object/public/aca-post-images/${path}`,
          },
        }),
      }),
    },
    rpc: state.rpc,
  },
}));

beforeEach(async () => {
  state.user = "10000000-0000-4000-8000-000000000001";
  state.role = "admin";
  state.error = false;
  state.rpc.mockReset();
  state.upload.mockReset();
  state.upload.mockResolvedValue({ error: null });
  state.rpc.mockImplementation(async (_name, args) => ({
    data: args.p_post.id,
    error: null,
  }));
  URL.createObjectURL = vi.fn(() => "blob:test");
  URL.revokeObjectURL = vi.fn();
  if (!i18n.isInitialized)
    await i18n
      .use(initReactI18next)
      .init({
        lng: "ko",
        resources: { ko: { translation: ko }, en: { translation: en } },
        interpolation: { escapeValue: false },
      });
  await i18n.changeLanguage("ko");
});
afterEach(() => {
  cleanup();
  state.listeners.clear();
});
function editor() {
  return render(
    <MemoryRouter initialEntries={["/notices/write"]}>
      <Routes>
        <Route
          path="/notices/write"
          element={<WritePost section="notices" />}
        />
        <Route path="/notices/:id" element={<p>Published detail</p>} />
      </Routes>
    </MemoryRouter>,
  );
}
async function fill() {
  fireEvent.change(await screen.findByLabelText("제목"), {
    target: { value: "테스트 제목" },
  });
  fireEvent.change(screen.getByLabelText("설명 / 요약"), {
    target: { value: "설명" },
  });
  fireEvent.change(screen.getByLabelText("카테고리"), {
    target: { value: "행사" },
  });
  fireEvent.change(screen.getByLabelText("본문"), {
    target: { value: "첫째 줄\n둘째 줄" },
  });
}

describe("admin publication", () => {
  for (const role of ["member", null, "error", "logged-out"]) {
    it(`hides the button and denies the editor for ${role}`, async () => {
      state.role = role === "error" ? "admin" : role;
      state.error = role === "error";
      if (role === "logged-out") state.user = null;
      render(
        <MemoryRouter>
          <AdminWriteButton section="archive" />
        </MemoryRouter>,
      );
      editor();
      await screen.findByRole("heading", { name: "관리자 권한이 필요합니다" });
      expect(screen.queryByRole("link", { name: "게시물 쓰기" })).toBeNull();
      expect(screen.queryByRole("button", { name: "게시물 등록" })).toBeNull();
    });
  }
  for (const section of ["notices", "research", "archive"] as const) {
    it(`links admins to ${section}/write and hides on signout`, async () => {
      render(
        <MemoryRouter>
          <AdminWriteButton section={section} />
        </MemoryRouter>,
      );
      expect(
        (await screen.findByRole("link", { name: "게시물 쓰기" })).getAttribute(
          "href",
        ),
      ).toBe(`/${section}/write`);
      await act(async () => {
        state.user = null;
        state.listeners.forEach((fn) => fn("SIGNED_OUT", null));
      });
      expect(screen.queryByRole("link", { name: "게시물 쓰기" })).toBeNull();
    });
  }
  it("publishes with optional pictures omitted", async () => {
    editor();
    await fill();
    fireEvent.click(screen.getByRole("button", { name: "게시물 등록" }));
    await screen.findByText("Published detail");
    expect(state.rpc.mock.calls[0][1].p_images).toEqual([]);
    expect(state.rpc.mock.calls[0][1].p_post.body).toBe("첫째 줄\n둘째 줄");
  });
  it("keeps text after failure and retries the same UUID and ordered image paths", async () => {
    state.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "Network failure" },
    });
    editor();
    await fill();
    fireEvent.change(screen.getByLabelText("사진 추가"), {
      target: {
        files: [
          new File(["x"], "one.png", { type: "image/png" }),
          new File(["y"], "two.png", { type: "image/png" }),
        ],
      },
    });
    const descriptions = screen.getAllByLabelText("사진 설명 (선택)");
    fireEvent.change(descriptions[0], { target: { value: "one" } });
    fireEvent.change(descriptions[1], { target: { value: "two" } });
    fireEvent.click(screen.getAllByRole("button", { name: "아래로" })[0]);
    fireEvent.click(screen.getByRole("button", { name: "게시물 등록" }));
    await screen.findByRole("alert");
    expect((screen.getByLabelText("제목") as HTMLInputElement).value).toBe(
      "테스트 제목",
    );
    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    await screen.findByText("Published detail");
    expect(state.rpc).toHaveBeenCalledTimes(2);
    expect(state.rpc.mock.calls[0][1]).toEqual(state.rpc.mock.calls[1][1]);
    expect(
      state.rpc.mock.calls[1][1].p_images.map(
        (image: { alt: string }) => image.alt,
      ),
    ).toEqual(["two", "one"]);
    expect(state.upload).toHaveBeenCalledTimes(2);
  });
  it("supports removal and rejects invalid images", async () => {
    editor();
    await fill();
    fireEvent.change(screen.getByLabelText("사진 추가"), {
      target: {
        files: [new File(["x"], "test.svg", { type: "image/svg+xml" })],
      },
    });
    await screen.findByRole("alert");
    expect(screen.queryByRole("button", { name: "삭제" })).toBeNull();
    fireEvent.change(screen.getByLabelText("사진 추가"), {
      target: { files: [new File(["x"], "test.png", { type: "image/png" })] },
    });
    fireEvent.click(screen.getByRole("button", { name: "삭제" }));
    await waitFor(() =>
      expect(screen.queryByRole("button", { name: "삭제" })).toBeNull(),
    );
    expect(URL.revokeObjectURL).toHaveBeenCalled();
    expect(imageError([{ type: "image/png", size: 6 * 1024 * 1024 }], 0)).toBe(
      "posts.invalidImage",
    );
    expect(imageError([{ type: "image/png", size: 10 }], 10)).toBe(
      "posts.tooManyImages",
    );
  });
});
