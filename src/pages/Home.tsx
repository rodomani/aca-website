import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Typography } from "../components/ui/Typography";
import { Button } from "../components/ui/Button";
import { Grid } from "../components/ui/Grid";
import { Card, CardContent } from "../components/ui/Card";
import { siteConfig } from "../config/site";

const navigationKeyByHref = {
  "/notices": "notices",
  "/research": "research",
  "/archive": "archive",
  "/store": "store",
} as const;

export function Home() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage ?? "en";
  }, [i18n.resolvedLanguage]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F1E9]">
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-[#E2DEC6]">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-4xl">
              <Typography
                variant="h4"
                className="text-[#1A3C2F]/70 mb-6"
              >
                {t("home.hero.eyebrow", {
                  siteName: siteConfig.shortName,
                })}
              </Typography>

              <Typography
                variant="h1"
                className="!text-5xl md:!text-7xl mb-8"
              >
                {t("home.hero.title")}
              </Typography>

              <Typography
                variant="p"
                className="text-xl max-w-2xl text-[#2C2C2C]/80 mb-10"
              >
                {t("home.hero.description")} {t("home.hero.invitation")}
              </Typography>

              <div className="flex flex-wrap gap-4">
                <Link to="/archive">
                  <Button variant="primary" size="lg">
                    {t("home.hero.exploreArchive")}
                  </Button>
                </Link>

                <Link to="/store">
                  <Button variant="outline" size="lg">
                    {t("home.hero.viewPrograms")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK LINKS / NAVIGATION CARDS */}
        <section className="py-20">
          <div className="container mx-auto px-4 md:px-8">
            <div className="mb-12 flex justify-between items-end border-b border-[#1A3C2F]/20 pb-4">
              <Typography variant="h2" className="!mb-0">
                {t("home.quickLinks.title")}
              </Typography>
            </div>

            <Grid columns={4}>
              {siteConfig.mainNav.map((item) => {
                const navigationKey = navigationKeyByHref[item.href];

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="group block h-full"
                  >
                    <Card className="h-full transition-all duration-300 group-hover:border-[#1A3C2F] group-hover:bg-[#E2DEC6]/20">
                      <CardContent className="justify-between">
                        <div>
                          <Typography
                            variant="h3"
                            className="!text-xl mb-3 group-hover:text-[#1A3C2F]"
                          >
                            {t(
                              `home.quickLinks.items.${navigationKey}.title`,
                            )}
                          </Typography>

                          <Typography
                            variant="p"
                            className="!text-sm text-[#6B7280]"
                          >
                            {t(
                              `home.quickLinks.items.${navigationKey}.description`,
                            )}
                          </Typography>
                        </div>

                        <div className="mt-8 flex justify-end">
                          <span
                            aria-hidden="true"
                            className="w-8 h-[1px] bg-[#1A3C2F] transition-all duration-300 group-hover:w-12"
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </Grid>
          </div>
        </section>

        {/* FEATURED PROMO SECTION */}
        <section className="py-20 bg-[#1A3C2F] text-[#F4F1E9]">
          <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
            <Typography
              variant="h2"
              className="!text-[#F4F1E9] mb-6"
            >
              {t("home.featured.title")}
            </Typography>

            <Typography
              variant="p"
              className="!text-[#F4F1E9]/80 mb-8"
            >
              {t("home.featured.description")}
            </Typography>

            <Link to="/store">
              <Button
                variant="outline"
                className="!border-[#F4F1E9] !text-[#F4F1E9] hover:!bg-[#F4F1E9] hover:!text-[#1A3C2F]"
              >
                {t("home.featured.button")}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}