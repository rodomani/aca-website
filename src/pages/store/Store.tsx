import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Footer } from "../../components/layout/Footer";
import { Header } from "../../components/layout/Header";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Grid } from "../../components/ui/Grid";
import { Typography } from "../../components/ui/Typography";

import type { ProductCategory } from "../../types";

type StoreTab = ProductCategory | "ALL";

type StoreProduct = {
  id: string;
  category: ProductCategory;
  price?: number;
  instructor?: boolean;
  imageUrl?: string;
};

const tabs: StoreTab[] = [
  "ALL",
  "CLASS",
  "MATERIAL",
  "CERTIFICATE",
  "SERVICE",
];

const products: StoreProduct[] = [
  // Certificates
  {
    id: "certificate2",
    category: "CERTIFICATE",
    price: 10_000,
  },
  {
    id: "completion1",
    category: "CERTIFICATE",
    price: 30_000,
  },
  {
    id: "completion2",
    category: "CERTIFICATE",
    price: 35_000,
  },

  // Classes
  {
    id: "textile",
    category: "CLASS",
    price: 80_000,
    instructor: true,
    imageUrl:
      "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "dyeing",
    category: "CLASS",
    price: 85_000,
    instructor: true,
    imageUrl:
      "https://images.unsplash.com/photo-1583749216441-2a1c22bc7083?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "calligraphy",
    category: "CLASS",
    price: 70_000,
    instructor: true,
    imageUrl:
      "https://images.unsplash.com/photo-1571439771120-0089a8c08182?auto=format&fit=crop&q=80&w=600&h=400",
  },

  // Materials
  {
    id: "textbook",
    category: "MATERIAL",
    price: 45_000,
  },
  {
    id: "kit",
    category: "MATERIAL",
    price: 60_000,
  },

  // Services
  {
    id: "service",
    category: "SERVICE",
  },
];

export function Store() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<StoreTab>("ALL");

  const filteredProducts = products.filter(
    (product) =>
      activeTab === "ALL" || product.category === activeTab,
  );

  const formatPrice = (price?: number) => {
    if (price === undefined) {
      return t("store.priceOnRequest");
    }

    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(price);
  };

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
            {t("store.eyebrow")}
          </Typography>

          <Typography variant="h1" className="!mb-0">
            {t("store.title")}
          </Typography>

          <Typography
            variant="p"
            className="mt-4 max-w-2xl text-[#6B7280]"
          >
            {t("store.description")}
          </Typography>
        </section>

        {/* Category tabs */}
        <nav
          className="mb-12 flex flex-wrap gap-2 border-b border-[#E2DEC6] md:gap-6"
          aria-label={t("store.categoryNavigation")}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  "border-b-2 px-2 pb-4",
                  "font-sans text-sm tracking-wide",
                  "transition-colors duration-200",
                  isActive
                    ? "border-[#1A3C2F] font-semibold text-[#1A3C2F]"
                    : "border-transparent text-[#6B7280] hover:text-[#1A3C2F]",
                ].join(" ")}
              >
                {t(`store.tabs.${tab}`)}
              </button>
            );
          })}
        </nav>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <Grid columns={3}>
            {filteredProducts.map((product) => {
              const titleKey = `store.items.${product.id}.title`;
              const descriptionKey =
                `store.items.${product.id}.description`;

              return (
                <Card
                  key={product.id}
                  className="group h-full transition-colors duration-300 hover:border-[#1A3C2F]"
                >
                  {product.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden border-b border-[#E2DEC6]">
                      <img
                        src={product.imageUrl}
                        alt={t(titleKey)}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  <CardContent className="flex flex-col justify-between">
                    <div>
                      {product.instructor && (
                        <span className="mb-3 inline-block bg-[#E2DEC6] px-2 py-1 text-xs text-[#1A3C2F]">
                          {t(
                            `store.items.${product.id}.instructor`,
                          )}{" "}
                          {t("store.instructor")}
                        </span>
                      )}

                      <Typography
                        variant="h3"
                        className="!mb-3 !text-xl"
                      >
                        {t(titleKey)}
                      </Typography>

                      <Typography
                        variant="p"
                        className="!text-sm text-[#6B7280]"
                      >
                        {t(descriptionKey)}
                      </Typography>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-[#F4F1E9] pt-4">
                      <Typography
                        variant="span"
                        className="font-semibold text-[#1A3C2F]"
                      >
                        {formatPrice(product.price)}
                      </Typography>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          window.open(
                            "#",
                            "_blank",
                            "noopener,noreferrer",
                          )
                        }
                      >
                        {t("store.purchase")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
        ) : (
          <div className="py-20 text-center">
            <Typography
              variant="p"
              className="text-[#6B7280]"
            >
              {t("store.empty")}
            </Typography>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}