import { useEffect, useRef, useState } from "react";
import { supabase } from "../../utils/supabase";

export type AppendixFile = {
  id: string;
  file_name: string;
  file_path: string;
  display_order: number;
};
export function AppendixDownloads({ files }: { files: AppendixFile[] }) {
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  const active = useRef(true);
  const busy = useRef(false);
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
    };
  }, []);
  const download = async (file: AppendixFile) => {
    if (busy.current) return;
    busy.current = true;
    setPending(file.id);
    setError("");
    try {
      // Authenticated fetch: no public URL or transferable signed URL is created.
      const { data, error } = await supabase.storage
        .from("aca-appendix-files")
        .download(file.file_path);
      if (error || !data) throw error ?? new Error("Missing file");
      if (!active.current) return;
      const url = URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.file_name.replace(/[\\/]/g, "_");
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Allow the browser to consume the blob before releasing it.
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      if (active.current)
        setError(
          "파일을 다운로드하지 못했습니다. 파일 경로와 관리자 권한을 확인한 뒤 다시 시도해 주세요.",
        );
    } finally {
      busy.current = false;
      if (active.current) setPending(null);
    }
  };
  return (
    <section
      className="mt-8 border-t border-[#E2DEC6] pt-6"
      aria-labelledby="appendix-files-title"
    >
      <h3
        id="appendix-files-title"
        className="mb-4 text-lg font-semibold text-[#1A3C2F]"
      >
        첨부파일
      </h3>
      {files.length ? (
        <ul className="space-y-3">
          {[...files]
            .sort((a, b) => a.display_order - b.display_order)
            .map((file) => (
              <li
                key={file.id}
                className="flex flex-wrap items-center justify-between gap-3 border border-[#E2DEC6] p-4"
              >
                <span className="min-w-0 break-all">{file.file_name}</span>
                <button
                  type="button"
                  disabled={pending !== null}
                  onClick={() => void download(file)}
                  aria-label={`${file.file_name} 다운로드`}
                  className="shrink-0 border border-[#1A3C2F] px-4 py-2 text-sm text-[#1A3C2F] hover:bg-[#F4F1E9] disabled:opacity-50"
                >
                  {pending === file.id ? "다운로드 중…" : "다운로드"}
                </button>
              </li>
            ))}
        </ul>
      ) : (
        <p className="text-sm text-[#6B7280]">첨부된 파일이 없습니다.</p>
      )}
      {pending && (
        <p role="status" className="mt-3 text-sm">
          파일을 준비하는 중입니다…
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
