import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PostLayout } from "../../components/posts/PostLayout";
import { AdminWriteButton } from "../../components/ui/AdminWriteButton";
import { Typography } from "../../components/ui/Typography";
import { supabase } from "../../utils/supabase";
import { contentTypes, localized, postColumns } from "../../utils/posts";
import type { Post, PostSection } from "../../utils/posts";
import { formatDate } from "../../utils/formatDate";

export function PostList({ section }: { section: PostSection }) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [result, setResult] = useState<{
    section: PostSection;
    retry: number;
    posts: Post[];
    error: boolean;
  } | null>(null);
  const [retry, setRetry] = useState(0);
  const loading =
    !result || result.section !== section || result.retry !== retry;
  const posts = result?.posts ?? [];
  const error = result?.error ?? false;
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(postColumns)
          .eq("content_type", contentTypes[section])
          .eq("status", "published")
          .order("is_pinned", { ascending: false, nullsFirst: false })
          .order("published_at", { ascending: false });
        if (active) {
          setResult({
            section,
            retry,
            posts: (data ?? []) as Post[],
            error: !!error,
          });
        }
      } catch {
        if (active) setResult({ section, retry, posts: [], error: true });
      }
    })();
    return () => {
      active = false;
    };
  }, [section, retry]);
  return (
    <PostLayout>
      <section className="mb-10 border-b border-[#1A3C2F]/20 pb-6">
        <Typography variant="h4" className="text-[#1A3C2F]/70">
          {t(`${section}.eyebrow`)}
        </Typography>
        <div className="flex flex-wrap items-center justify-between gap-5">
          <Typography variant="h1" className="!mb-0">
            {t(`${section}.title`)}
          </Typography>
          <AdminWriteButton section={section} />
        </div>
        <Typography className="mt-4 max-w-2xl text-[#6B7280]">
          {t(`${section}.description`)}
        </Typography>
      </section>
      {loading ? (
        <p role="status">{t("posts.loading")}</p>
      ) : error ? (
        <div role="alert">
          <p>{t("posts.loadError")}</p>
          <button
            type="button"
            onClick={() => setRetry((value) => value + 1)}
            className="mt-3 underline"
          >
            {t("posts.retry")}
          </button>
        </div>
      ) : posts.length === 0 ? (
        <p className="border border-[#E2DEC6] bg-white p-10 text-center text-[#6B7280]">
          {t("posts.empty")}
        </p>
      ) : (
        <div
          className={
            section === "archive"
              ? "grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-5"
          }
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/${section}/${post.id}`}
              className="block overflow-hidden border border-[#E2DEC6] bg-white transition-shadow hover:shadow-md"
            >
              {section === "archive" && post.cover_image_url && (
                <img
                  src={post.cover_image_url}
                  alt=""
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"
                />
              )}
              <article className="p-6">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                  <span>{post.category}</span>
                  {post.is_pinned && (
                    <span className="bg-[#1A3C2F] px-2 py-1 text-white">
                      {t("notices.pinned")}
                    </span>
                  )}
                  {post.published_at && (
                    <time dateTime={post.published_at}>
                      {formatDate(post.published_at, language)}
                    </time>
                  )}
                </div>
                <Typography variant="h3">
                  {localized(post.title_ko, post.title_en, language)}
                </Typography>
                <p className="line-clamp-3 whitespace-pre-line text-[#6B7280]">
                  {localized(post.summary_ko, post.summary_en, language)}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </PostLayout>
  );
}
