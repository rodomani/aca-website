import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdmin } from "../../hooks/useAdmin";
import type { PostSection } from "../../utils/posts";
export function AdminWriteButton({ section }: { section: PostSection }) {
  const { t } = useTranslation();
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;
  return (
    <Link
      to={`/${section}/write`}
      className="inline-flex shrink-0 items-center justify-center border border-[#1A3C2F] bg-[#1A3C2F] px-6 py-3 text-sm font-semibold text-[#F4F1E9] transition-colors hover:bg-[#2C5243] focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      {t("posts.write")}
    </Link>
  );
}
