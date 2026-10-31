import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AppendixDownloads } from "../../components/posts/AppendixDownloads";
import type { AppendixFile } from "../../components/posts/AppendixDownloads";
import { PostLayout } from "../../components/posts/PostLayout";
import { Typography } from "../../components/ui/Typography";
import { useAdmin } from "../../hooks/useAdmin";
import { supabase } from "../../utils/supabase";

type Appendix = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  display_order: number;
  created_at: string;
  appendix_files?: AppendixFile[];
};

export function Appendices() {
  const access = useAdmin();
  const { appendixId } = useParams();
  return (
    <PostLayout>
      <div lang="ko">
        {access.loading ? (
          <p role="status">관리자 권한을 확인하는 중입니다…</p>
        ) : !access.isAdmin ? (
          <>
            <Typography variant="h1">관리자 전용 페이지</Typography>
            <p role="alert">
              {access.error
                ? "프로필을 확인하지 못했습니다. 새로고침 후 다시 시도해 주세요."
                : "별지는 관리자만 열람할 수 있습니다."}
            </p>
            <Link
              to={access.userId ? "/" : "/login"}
              className="mt-6 inline-block text-[#1A3C2F] underline"
            >
              {access.userId ? "홈으로" : "로그인"}
            </Link>
          </>
        ) : (
          <AppendixContent
            key={`${access.userId}:${appendixId ?? "list"}`}
            appendixId={appendixId}
          />
        )}
      </div>
    </PostLayout>
  );
}

// Mounted only after profile verification. Logout removes fetched private content.
function AppendixContent({ appendixId }: { appendixId?: string }) {
  const [rows, setRows] = useState<Appendix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const query = supabase.from("appendices");
        const result = appendixId
          ? await query
              .select(
                "id,title,description,content,display_order,created_at,appendix_files(id,file_name,file_path,display_order)",
              )
              .eq("id", appendixId)
              .maybeSingle()
          : await query
              .select("id,title,description,display_order,created_at")
              .order("display_order", { ascending: true })
              .order("created_at", { ascending: false });
        if (active) {
          setError(!!result.error);
          setRows(
            result.error || !result.data
              ? []
              : ((Array.isArray(result.data)
                  ? result.data
                  : [result.data]) as Appendix[]),
          );
        }
      } catch {
        if (active) {
          setError(true);
          setRows([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [appendixId, attempt]);
  return (
    <>
      <section className="mb-8 border-b border-[#1A3C2F]/20 pb-6">
        <Typography variant="h1">별지</Typography>
        <p className="text-[#6B7280]">관리자 전용 자료입니다.</p>
      </section>
      {appendixId && (
        <Link
          to="/appendices"
          className="mb-6 inline-block text-sm text-[#1A3C2F] underline"
        >
          ← 별지 목록으로
        </Link>
      )}
      {loading ? (
        <p role="status">자료를 불러오는 중입니다…</p>
      ) : error ? (
        <div role="alert">
          <p>자료를 불러오지 못했습니다. 다시 시도해 주세요.</p>
          <button
            type="button"
            className="mt-4 underline"
            onClick={() => {
              setLoading(true);
              setError(false);
              setAttempt((value) => value + 1);
            }}
          >
            다시 시도
          </button>
        </div>
      ) : appendixId ? (
        rows[0] ? (
          <article className="border border-[#E2DEC6] bg-white p-6 md:p-10">
            <Typography variant="h2" className="break-words">
              {rows[0].title}
            </Typography>
            {rows[0].description && (
              <p className="mb-8 whitespace-pre-wrap break-words border-l-4 border-[#1A3C2F] bg-[#F4F1E9] p-4">
                {rows[0].description}
              </p>
            )}
            <div className="whitespace-pre-wrap break-words leading-8">
              {rows[0].content}
            </div>
            <AppendixDownloads files={rows[0].appendix_files ?? []} />
          </article>
        ) : (
          <p>해당 자료가 없습니다.</p>
        )
      ) : rows.length ? (
        <ul className="divide-y divide-[#E2DEC6] border-y border-[#E2DEC6] bg-white">
          {rows.map((row) => (
            <li key={row.id}>
              <Link
                to={`/appendices/${row.id}`}
                className="block p-6 transition-colors hover:bg-[#F4F1E9]/50"
              >
                <Typography variant="h3" className="break-words">
                  {row.title}
                </Typography>
                {row.description && (
                  <p className="line-clamp-3 whitespace-pre-wrap break-words text-[#6B7280]">
                    {row.description}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="border border-[#E2DEC6] bg-white p-8 text-center text-[#6B7280]">
          등록된 별지가 없습니다.
        </p>
      )}
    </>
  );
}
