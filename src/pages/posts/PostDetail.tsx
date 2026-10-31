import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PostBody } from "../../components/posts/PostBody";
import { PostLayout } from "../../components/posts/PostLayout";
import { Typography } from "../../components/ui/Typography";
import { contentTypes, localized, postColumns } from "../../utils/posts";
import type { Post, PostSection } from "../../utils/posts";
import { supabase } from "../../utils/supabase";
import { formatDate } from "../../utils/formatDate";
export function PostDetail({ section }: { section: PostSection }) {
  const { postId } = useParams();
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;
  const [result, setResult] = useState<{
    section: PostSection;
    postId: string | undefined;
    post: Post | null;
    error: boolean;
  } | null>(null);
  const loading =
    !result || result.section !== section || result.postId !== postId;
  const post = result?.post ?? null;
  const error = result?.error ?? false;
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const { data, error } = await supabase
          .from("posts")
          .select(postColumns)
          .eq("id", postId ?? "")
          .eq("content_type", contentTypes[section])
          .eq("status", "published")
          .maybeSingle();
        if (active) {
          setResult({
            section,
            postId,
            post: data as Post | null,
            error: !!error,
          });
        }
      } catch {
        if (active) setResult({ section, postId, post: null, error: true });
      }
    })();
    return () => {
      active = false;
    };
  }, [postId, section]);
  return (
    <PostLayout>
      <Link
        to={`/${section}`}
        className="mb-8 inline-block text-sm text-[#1A3C2F] underline"
      >
        ← {t("posts.back")}
      </Link>
      {loading ? (
        <p role="status">{t("posts.loading")}</p>
      ) : error ? (
        <p role="alert">{t("posts.loadError")}</p>
      ) : !post ? (
        <p>{t("posts.notFound")}</p>
      ) : (
        <article className="border border-[#E2DEC6] border-t-4 border-t-[#1A3C2F] bg-white p-6 md:p-10">
          <p className="mb-4 text-sm text-[#6B7280]">{post.category}</p>
          <Typography variant="h1" className="break-words !text-4xl">
            {localized(post.title_ko, post.title_en, language)}
          </Typography>
          <div className="mb-8 flex flex-wrap gap-4 text-sm text-[#6B7280]">
            <span>{localized(post.author_ko, post.author_en, language)}</span>
            {post.published_at && (
              <time dateTime={post.published_at}>
                {formatDate(post.published_at, language)}
              </time>
            )}
          </div>
          {(post.summary_ko || post.summary_en) && (
            <p className="mb-8 whitespace-pre-wrap break-words border-l-4 border-[#1A3C2F] bg-[#F4F1E9] p-5">
              {localized(post.summary_ko, post.summary_en, language)}
            </p>
          )}
          <PostBody post={post} language={language} />
        </article>
      )}
    </PostLayout>
  );
}
