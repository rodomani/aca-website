import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { Typography } from "../../components/ui/Typography";

import { sortedNotices } from "../../data/notices";
import { formatDate } from "../../utils/formatDate";

export function Notices() {
  const { t, i18n } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F1E9]">
      <Header />

      <main className="container mx-auto max-w-5xl flex-grow px-4 py-16 md:px-8">
        {/* Page heading */}
        <section className="mb-12 border-b border-[#1A3C2F]/20 pb-6">
          <Typography
            variant="h4"
            className="mb-2 text-[#1A3C2F]/70"
          >
            {t("notices.eyebrow")}
          </Typography>

          <Typography variant="h1" className="!mb-0">
            {t("notices.title")}
          </Typography>

          <Typography
            variant="p"
            className="mt-4 max-w-2xl text-[#6B7280]"
          >
            {t("notices.description")}
          </Typography>
        </section>

        {/* Notices table */}
        <section className="overflow-hidden border-t-2 border-[#1A3C2F] bg-white">
          {/* Desktop column headings */}
          <div className="hidden grid-cols-12 gap-4 border-b border-[#E2DEC6] bg-[#F4F1E9]/50 px-6 py-4 md:grid">
            <Typography
              variant="h4"
              className="col-span-1 !mb-0 text-center !text-sm text-[#6B7280]"
            >
              {t("notices.columns.number")}
            </Typography>

            <Typography
              variant="h4"
              className="col-span-7 !mb-0 !text-sm text-[#6B7280]"
            >
              {t("notices.columns.title")}
            </Typography>

            <Typography
              variant="h4"
              className="col-span-2 !mb-0 text-center !text-sm text-[#6B7280]"
            >
              {t("notices.columns.author")}
            </Typography>

            <Typography
              variant="h4"
              className="col-span-2 !mb-0 text-center !text-sm text-[#6B7280]"
            >
              {t("notices.columns.date")}
            </Typography>
          </div>

          {/* Notice rows */}
          <div className="flex flex-col">
            {sortedNotices.map((notice, index) => {
              const titleKey =
                `notices.items.${notice.id}.title`;

              const authorKey =
                `notices.items.${notice.id}.author`;

              const noticeNumber =
                sortedNotices.length - index;

              return (
                <Link
                  key={notice.id}
                  to={`/notices/${notice.id}`}
                  className={[
                    "group grid grid-cols-1 items-center",
                    "gap-2 border-b border-[#E2DEC6] px-6 py-5",
                    "transition-colors duration-200",
                    "hover:bg-[#F4F1E9]/30",
                    "md:grid-cols-12 md:gap-4",
                  ].join(" ")}
                >
                  {/* Number or pinned badge */}
                  <div className="order-1 col-span-1 md:order-none md:text-center">
                    {notice.isPinned ? (
                      <span className="inline-block bg-[#1A3C2F] px-2 py-1 text-xs font-semibold tracking-wider text-[#F4F1E9]">
                        {t("notices.pinned")}
                      </span>
                    ) : (
                      <Typography
                        variant="span"
                        className="text-[#6B7280]"
                      >
                        {noticeNumber}
                      </Typography>
                    )}
                  </div>

                  {/* Notice title */}
                  <div className="order-3 col-span-1 min-w-0 md:order-none md:col-span-7">
                    <Typography
                      variant="p"
                      className={[
                        "!mb-0 truncate",
                        "transition-colors",
                        "group-hover:text-[#1A3C2F]",
                        notice.isPinned
                          ? "font-semibold text-[#1A3C2F]"
                          : "text-[#2C2C2C]",
                      ].join(" ")}
                    >
                      {t(titleKey)}
                    </Typography>
                  </div>

                  {/* Author */}
                  <div className="order-4 col-span-1 mt-1 md:order-none md:col-span-2 md:mt-0 md:text-center">
                    <Typography
                      variant="span"
                      className="!text-xs text-[#6B7280] md:!text-sm"
                    >
                      {t(authorKey)}
                    </Typography>
                  </div>

                  {/* Publication date */}
                  <div className="order-2 col-span-1 text-right md:order-none md:col-span-2 md:text-center">
                    <Typography
                      variant="span"
                      className="!text-xs text-[#6B7280] md:!text-sm"
                    >
                      {formatDate(
                        notice.publishDate,
                        currentLanguage,
                      )}
                    </Typography>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}