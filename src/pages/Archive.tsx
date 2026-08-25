import { useTranslation } from "react-i18next";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Typography } from "../components/ui/Typography";
import { Grid } from "../components/ui/Grid";
import { formatDate } from "../utils/formatDate";

const posters = [
  { id: "festival", eventDate: "2025-04-15", imageUrl: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800&h=1200" },
  { id: "symposium", eventDate: "2024-11-20", imageUrl: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&q=80&w=800&h=1200" },
  { id: "concert", eventDate: "2024-09-05", imageUrl: "https://images.unsplash.com/photo-1518998053401-878c735777a5?auto=format&fit=crop&q=80&w=800&h=1200" },
  { id: "calligraphy", eventDate: "2024-06-12", imageUrl: "https://images.unsplash.com/photo-1563240619-44ce0ceeb06b?auto=format&fit=crop&q=80&w=800&h=1200" },
  { id: "film", eventDate: "2024-02-28", imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800&h=1200" },
  { id: "gala", eventDate: "2023-12-21", imageUrl: "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?auto=format&fit=crop&q=80&w=800&h=1200" },
] as const;

export function Archive() {
  const { t, i18n } = useTranslation();
  return <div className="min-h-screen flex flex-col bg-[#F4F1E9]"><Header /><main className="flex-grow container mx-auto px-4 md:px-8 py-16"><div className="mb-12 border-b border-[#1A3C2F]/20 pb-6"><Typography variant="h4" className="text-[#1A3C2F]/70 mb-2">{t("archive.eyebrow")}</Typography><Typography variant="h1" className="!mb-0">{t("archive.title")}</Typography><Typography variant="p" className="text-[#6B7280] mt-4 max-w-2xl">{t("archive.description")}</Typography></div><Grid columns={3}>{posters.map((poster) => <div key={poster.id} className="group cursor-pointer flex flex-col"><div className="relative aspect-[2/3] w-full overflow-hidden mb-4 border border-[#E2DEC6] bg-white"><img src={poster.imageUrl} alt={t(`archive.items.${poster.id}.title`)} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-[#1A3C2F]/0 group-hover:bg-[#1A3C2F]/10 transition-colors duration-300" /></div><div className="px-1"><Typography variant="h4" className="!text-base !normal-case tracking-normal mb-1 group-hover:text-[#1A3C2F]">{t(`archive.items.${poster.id}.title`)}</Typography><Typography variant="span" className="text-[#6B7280]">{formatDate(poster.eventDate, i18n.language)}</Typography></div></div>)}</Grid></main><Footer /></div>;
}
