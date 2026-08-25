import { useTranslation } from "react-i18next";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Typography } from "../components/ui/Typography";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { formatDate } from "../utils/formatDate";

type ResearchListItem = { id: string; publishDate: string; pdfUrl?: string };

const articles: ResearchListItem[] = [
  { id: "textiles", publishDate: "2026-06-15T00:00:00Z", pdfUrl: "#" },
  { id: "tea", publishDate: "2025-11-20T00:00:00Z", pdfUrl: "#" },
  { id: "buddhistArt", publishDate: "2025-08-05T00:00:00Z" },
  { id: "architecture", publishDate: "2024-03-12T00:00:00Z", pdfUrl: "#" },
];

export function Research() {
  const { t, i18n } = useTranslation();
  return <div className="min-h-screen flex flex-col bg-[#F4F1E9]"><Header />
    <main className="flex-grow container mx-auto px-4 md:px-8 py-16 max-w-4xl"><div className="mb-16 border-b border-[#1A3C2F]/20 pb-6 text-center"><Typography variant="h4" className="text-[#1A3C2F]/70 mb-2">{t("research.eyebrow")}</Typography><Typography variant="h1" className="!mb-0">{t("research.title")}</Typography><Typography variant="p" className="text-[#6B7280] mt-4 mx-auto max-w-2xl">{t("research.description")}</Typography></div>
      <div className="flex flex-col gap-8">{articles.map((article) => <Card key={article.id} className="border-l-4 border-l-[#1A3C2F] hover:shadow-md transition-shadow duration-300"><CardContent className="p-6 md:p-8"><div className="flex flex-wrap justify-between items-center mb-4 gap-4 border-b border-[#E2DEC6] pb-4"><Typography variant="span" className="font-semibold text-[#1A3C2F]">{t(`research.items.${article.id}.author`)}</Typography><Typography variant="span" className="text-[#6B7280]">{formatDate(article.publishDate, i18n.language)}</Typography></div><Typography variant="h3" className="!mb-4">{t(`research.items.${article.id}.title`)}</Typography><Typography variant="p" className="text-[#2C2C2C]/80 mb-6 leading-relaxed">{t(`research.items.${article.id}.abstract`)}</Typography><div className="flex justify-end mt-4">{article.pdfUrl ? <Button variant="outline" size="sm" onClick={() => window.open(article.pdfUrl, "_blank", "noopener,noreferrer")}>{t("research.downloadPdf")}</Button> : <Button variant="ghost" size="sm" className="cursor-not-allowed opacity-50 hover:bg-transparent hover:text-[#2C2C2C]">{t("research.pdfUnavailable")}</Button>}</div></CardContent></Card>)}</div>
    </main><Footer />
  </div>;
}
