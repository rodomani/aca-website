import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { Typography } from "../../components/ui/Typography";

import { notices } from "../../data/notices";
import { formatDate } from "../../utils/formatDate";

export function NoticeDetail() {
  const { noticeId } = useParams<{
    noticeId: string;
  }>();

  const { t, i18n } = useTranslation();

  const notice = notices.find(
    (item) => item.id === noticeId,
  );

  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language;

  if (!notice) {
    return (
      <div className="flex min-h-screen flex-col bg-[#F4F1E9]">
        <Header />

        <main className="container mx-auto flex flex-grow items-center justify-center px-4 py-16 md:px-8">
          <section className="w-full max-w-xl border border-[#E2DEC6] bg-white p-8 text-center md:p-12">
            <Typography
              variant="h4"
              className="mb-3 text-[#1A3C2F]/70"
            >
              404
            </Typography>

            <Typography
              variant="h1"
              className="!text-4xl"
            >
              {t("notices.notFound.title")}
            </Typography>

            <Typography
              variant="p"
              className="mt-4 text-[#6B7280]"
            >
              {t("notices.notFound.description")}
            </Typography>

            <Link
              to="/notices"
              className="mt-8 inline-flex border border-[#1A3C2F] px-5 py-3 font-sans text-sm font-semibold text-[#1A3C2F] transition-colors hover:bg-[#1A3C2F] hover:text-[#F4F1E9]"
            >
              {t("notices.detail.backToList")}
            </Link>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  const titleKey =
    `notices.items.${notice.id}.title`;
  const authorKey =
    `notices.items.${notice.id}.author`;
  const summaryKey =
    `notices.items.${notice.id}.summary`;
  const bodyKey =
    `notices.items.${notice.id}.body`;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F1E9]">
      <Header />

      <main className="container mx-auto w-full max-w-4xl flex-grow px-4 py-12 md:px-8 md:py-16">
        {/* Back navigation */}
        <nav className="mb-8">
          <Link
            to="/notices"
            className="inline-flex items-center gap-2 font-sans text-sm font-medium text-[#6B7280] transition-colors hover:text-[#1A3C2F]"
          >
            <span aria-hidden="true">←</span>
            {t("notices.detail.backToList")}
          </Link>
        </nav>

        <article>
          {/* Notice header */}
          <header className="border-t-2 border-[#1A3C2F] bg-white px-6 py-8 md:px-10 md:py-12">
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <Typography
                variant="h4"
                className="!mb-0 text-[#1A3C2F]/70"
              >
                {t("notices.detail.category")}
              </Typography>

              {notice.isPinned && (
                <span className="bg-[#1A3C2F] px-2 py-1 font-sans text-xs font-semibold tracking-wider text-[#F4F1E9]">
                  {t("notices.pinned")}
                </span>
              )}
            </div>

            <Typography
              variant="h1"
              className="!mb-8 !text-4xl leading-tight md:!text-5xl"
            >
              {t(titleKey)}
            </Typography>

            {/* Notice metadata */}
            <div className="flex flex-col gap-3 border-t border-[#E2DEC6] pt-5 font-sans text-sm text-[#6B7280] sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span>
                  {t("notices.detail.author")}
                </span>

                <span className="text-[#E2DEC6]">
                  |
                </span>

                <span className="font-medium text-[#2C2C2C]">
                  {t(authorKey)}
                </span>
              </div>

              <time dateTime={notice.publishDate}>
                {formatDate(
                  notice.publishDate,
                  currentLanguage,
                )}
              </time>
            </div>
          </header>

          {/* Notice content */}
          <section className="border-x border-b border-[#E2DEC6] bg-white px-6 pb-10 md:px-10 md:pb-14">
            {/* Summary */}
            <div className="mb-10 border-l-4 border-[#1A3C2F] bg-[#F4F1E9] px-5 py-4">
              <Typography
                variant="p"
                className="!mb-0 font-medium leading-relaxed text-[#1A3C2F]"
              >
                {t(summaryKey)}
              </Typography>
            </div>

            {/* Main body */}
            <Typography
              variant="p"
              className="whitespace-pre-line leading-8 text-[#2C2C2C]"
            >
              {t(bodyKey)}
            </Typography>
          </section>

          {/* Bottom navigation */}
          <footer className="mt-8 flex justify-center border-t border-[#1A3C2F]/20 pt-8">
            <Link
              to="/notices"
              className="inline-flex min-w-36 justify-center border border-[#1A3C2F] px-6 py-3 font-sans text-sm font-semibold text-[#1A3C2F] transition-colors hover:bg-[#1A3C2F] hover:text-[#F4F1E9]"
            >
              {t("notices.detail.viewAll")}
            </Link>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
}