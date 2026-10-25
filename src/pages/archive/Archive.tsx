import { useTranslation } from "react-i18next";

import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";

import { formatDate } from "../../utils/formatDate";

type Poster = {
  id: string;
  eventDate: string;
  imageUrl: string;
};

const posters: Poster[] = [
  {
    id: "festival",
    eventDate: "2025-04-15",
    imageUrl:
      "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: "symposium",
    eventDate: "2024-11-20",
    imageUrl:
      "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: "concert",
    eventDate: "2024-09-05",
    imageUrl:
      "https://images.unsplash.com/photo-1518998053401-878c735777a5?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: "calligraphy",
    eventDate: "2024-06-12",
    imageUrl:
      "https://images.unsplash.com/photo-1563240619-44ce0ceeb06b?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: "film",
    eventDate: "2024-02-28",
    imageUrl:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800&h=1200",
  },
  {
    id: "gala",
    eventDate: "2023-12-21",
    imageUrl:
      "https://images.unsplash.com/photo-1516466723877-e4ec1d736c8a?auto=format&fit=crop&q=80&w=800&h=1200",
  },
];

export function Archive() {
  const { t, i18n } = useTranslation();

  const currentLanguage =
    i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F1E9]">
      <Header />

      <main className="container mx-auto flex-grow px-4 py-16 md:px-8">
        {/* Page heading */}
        <section className="mb-12 border-b border-[#1A3C2F]/20 pb-6">
          <Typography
            variant="h4"
            className="mb-2 text-[#1A3C2F]/70"
          >
            {t("archive.eyebrow")}
          </Typography>

          <Typography variant="h1" className="!mb-0">
            {t("archive.title")}
          </Typography>

          <Typography
            variant="p"
            className="mt-4 max-w-2xl text-[#6B7280]"
          >
            {t("archive.description")}
          </Typography>
        </section>

        {/* Poster gallery */}
        <Grid columns={3}>
          {posters.map((poster) => {
            const titleKey =
              `archive.items.${poster.id}.title`;

            return (
              <article
                key={poster.id}
                className="group flex cursor-pointer flex-col"
              >
                {/* Poster image */}
                <div className="relative mb-4 aspect-[2/3] w-full overflow-hidden border border-[#E2DEC6] bg-white">
                  <img
                    src={poster.imageUrl}
                    alt={t(titleKey)}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[#1A3C2F]/0 transition-colors duration-300 group-hover:bg-[#1A3C2F]/10"
                  />
                </div>

                {/* Poster information */}
                <div className="px-1">
                  <Typography
                    variant="h4"
                    className="mb-1 !text-base !normal-case tracking-normal group-hover:text-[#1A3C2F]"
                  >
                    {t(titleKey)}
                  </Typography>

                  <Typography
                    variant="span"
                    className="text-[#6B7280]"
                  >
                    {formatDate(
                      poster.eventDate,
                      currentLanguage,
                    )}
                  </Typography>
                </div>
              </article>
            );
          })}
        </Grid>
      </main>

      <Footer />
    </div>
  );
}