import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Typography } from "../components/ui/Typography";
import { formatDate } from "../utils/formatDate";

type NoticeListItem = { id: string; publishDate: string; isPinned?: boolean };

const notices: NoticeListItem[] = [
  { id: "membership", publishDate: "2026-07-15T09:00:00Z", isPinned: true },
  { id: "callForPapers", publishDate: "2026-07-01T09:00:00Z", isPinned: true },
  { id: "workshop", publishDate: "2026-06-20T09:00:00Z" },
  { id: "exhibition", publishDate: "2026-06-10T09:00:00Z" },
  { id: "store", publishDate: "2026-05-28T09:00:00Z" },
  { id: "certificate", publishDate: "2026-05-15T09:00:00Z" },
];

export function Notices() {
  const { t, i18n } = useTranslation();
  const sortedNotices = [...notices].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
  });

  return <div className="min-h-screen flex flex-col bg-[#F4F1E9]"><Header />
    <main className="flex-grow container mx-auto px-4 md:px-8 py-16 max-w-5xl">
      <div className="mb-12 border-b border-[#1A3C2F]/20 pb-6"><Typography variant="h4" className="text-[#1A3C2F]/70 mb-2">{t("notices.eyebrow")}</Typography><Typography variant="h1" className="!mb-0">{t("notices.title")}</Typography><Typography variant="p" className="text-[#6B7280] mt-4 max-w-2xl">{t("notices.description")}</Typography></div>
      <div className="bg-white border-t-2 border-[#1A3C2F]"><div className="hidden md:grid grid-cols-12 gap-4 py-4 px-6 border-b border-[#E2DEC6] bg-[#F4F1E9]/50"><Typography variant="h4" className="col-span-1 text-center !text-sm !mb-0 text-[#6B7280]">{t("notices.columns.number")}</Typography><Typography variant="h4" className="col-span-7 !text-sm !mb-0 text-[#6B7280]">{t("notices.columns.title")}</Typography><Typography variant="h4" className="col-span-2 text-center !text-sm !mb-0 text-[#6B7280]">{t("notices.columns.author")}</Typography><Typography variant="h4" className="col-span-2 text-center !text-sm !mb-0 text-[#6B7280]">{t("notices.columns.date")}</Typography></div>
        <div className="flex flex-col">{sortedNotices.map((notice, index) => <Link key={notice.id} to={`/notices/${notice.id}`} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 py-5 px-6 border-b border-[#E2DEC6] hover:bg-[#F4F1E9]/30 transition-colors duration-200 group items-center"><div className="col-span-1 md:text-center order-1 md:order-none">{notice.isPinned ? <span className="inline-block bg-[#1A3C2F] text-[#F4F1E9] text-xs font-semibold px-2 py-1 tracking-wider">{t("notices.pinned")}</span> : <Typography variant="span" className="text-[#6B7280]">{sortedNotices.length - index}</Typography>}</div><div className="col-span-1 md:col-span-7 order-3 md:order-none"><Typography variant="p" className={`!mb-0 truncate ${notice.isPinned ? "font-semibold text-[#1A3C2F]" : "text-[#2C2C2C]"} group-hover:text-[#1A3C2F]`}>{t(`notices.items.${notice.id}.title`)}</Typography></div><div className="col-span-1 md:col-span-2 md:text-center order-4 md:order-none mt-1 md:mt-0"><Typography variant="span" className="text-[#6B7280] !text-xs md:!text-sm">{t(`notices.items.${notice.id}.author`)}</Typography></div><div className="col-span-1 md:col-span-2 md:text-center order-2 md:order-none md:mt-0 text-right md:text-center"><Typography variant="span" className="text-[#6B7280] !text-xs md:!text-sm">{formatDate(notice.publishDate, i18n.language)}</Typography></div></Link>)}</div>
      </div>
    </main><Footer />
  </div>;
}
