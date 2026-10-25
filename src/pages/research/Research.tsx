import { useTranslation } from "react-i18next";

import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Typography } from "../../components/ui/Typography";

import { formatDate } from "../../utils/formatDate";

type ResearchListItem = {
  id: string;
  publishDate: string;
  pdfUrl?: string;
};

const articles: ResearchListItem[] = [
  {
    id: "textiles",
    publishDate: "2026-06-15T00:00:00Z",
    pdfUrl: "#",
  },
  {
    id: "tea",
    publishDate: "2025-11-20T00:00:00Z",
    pdfUrl: "#",
  },
  {
    id: "buddhistArt",
    publishDate: "2025-08-05T00:00:00Z",
  },
  {
    id: "architecture",
    publishDate: "2024-03-12T00:00:00Z",
    pdfUrl: "#",
  },
];

export function Research() {
  const { t, i18n } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F1E9]">
      <Header />

      <main className="container mx-auto max-w-4xl flex-grow px-4 py-16 md:px-8">
        {/* Page heading */}
        <section className="mb-16 border-b border-[#1A3C2F]/20 pb-6 text-center">
          <Typography
            variant="h4"
            className="mb-2 text-[#1A3C2F]/70"
          >
            {t("research.eyebrow")}
          </Typography>

          <Typography variant="h1" className="!mb-0">
            {t("research.title")}
          </Typography>

          <Typography
            variant="p"
            className="mx-auto mt-4 max-w-2xl text-[#6B7280]"
          >
            {t("research.description")}
          </Typography>
        </section>

        {/* Research articles */}
        <section className="flex flex-col gap-8">
          {articles.map((article) => {
            const authorKey =
              `research.items.${article.id}.author`;
            const titleKey =
              `research.items.${article.id}.title`;
            const abstractKey =
              `research.items.${article.id}.abstract`;

            const openPdf = () => {
              if (!article.pdfUrl) {
                return;
              }

              window.open(
                article.pdfUrl,
                "_blank",
                "noopener,noreferrer",
              );
            };

            return (
              <Card
                key={article.id}
                className="border-l-4 border-l-[#1A3C2F] transition-shadow duration-300 hover:shadow-md"
              >
                <CardContent className="p-6 md:p-8">
                  {/* Article metadata */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#E2DEC6] pb-4">
                    <Typography
                      variant="span"
                      className="font-semibold text-[#1A3C2F]"
                    >
                      {t(authorKey)}
                    </Typography>

                    <Typography
                      variant="span"
                      className="text-[#6B7280]"
                    >
                      {formatDate(
                        article.publishDate,
                        currentLanguage,
                      )}
                    </Typography>
                  </div>

                  {/* Article content */}
                  <Typography
                    variant="h3"
                    className="!mb-4"
                  >
                    {t(titleKey)}
                  </Typography>

                  <Typography
                    variant="p"
                    className="mb-6 leading-relaxed text-[#2C2C2C]/80"
                  >
                    {t(abstractKey)}
                  </Typography>

                  {/* PDF action */}
                  <div className="mt-4 flex justify-end">
                    {article.pdfUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openPdf}
                      >
                        {t("research.downloadPdf")}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled
                        className="cursor-not-allowed opacity-50 hover:bg-transparent hover:text-[#2C2C2C]"
                      >
                        {t("research.pdfUnavailable")}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
}