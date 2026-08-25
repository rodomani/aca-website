import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { Typography } from "../components/ui/Typography";
import { Grid } from "../components/ui/Grid";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import type { ProductCategory } from "../types";

type StoreProduct = {
  id: string;
  category: ProductCategory;
  price?: number;
  instructor?: boolean;
  imageUrl?: string;
};

const products: StoreProduct[] = [
  { id: "certificate2", category: "CERTIFICATE", price: 50000 }, { id: "completion1", category: "CERTIFICATE", price: 30000 }, { id: "completion2", category: "CERTIFICATE", price: 35000 },
  { id: "textile", category: "CLASS", price: 80000, instructor: true, imageUrl: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&q=80&w=600&h=400" }, { id: "dyeing", category: "CLASS", price: 85000, instructor: true, imageUrl: "https://images.unsplash.com/photo-1583749216441-2a1c22bc7083?auto=format&fit=crop&q=80&w=600&h=400" }, { id: "calligraphy", category: "CLASS", price: 70000, instructor: true, imageUrl: "https://images.unsplash.com/photo-1571439771120-0089a8c08182?auto=format&fit=crop&q=80&w=600&h=400" },
  { id: "textbook", category: "MATERIAL", price: 45000 }, { id: "kit", category: "MATERIAL", price: 60000 }, { id: "service", category: "SERVICE" },
];

export function Store() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<ProductCategory | "ALL">("ALL");
  const filteredProducts = products.filter((product) => activeTab === "ALL" || product.category === activeTab);
  const tabs: Array<{ value: ProductCategory | "ALL" }> = [{ value: "ALL" }, { value: "CLASS" }, { value: "MATERIAL" }, { value: "CERTIFICATE" }, { value: "SERVICE" }];
  const formatPrice = (price?: number) => price ? new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price) : t("store.priceOnRequest");
  return <div className="min-h-screen flex flex-col bg-[#F4F1E9]"><Header /><main className="flex-grow container mx-auto px-4 md:px-8 py-16"><div className="mb-12 border-b border-[#1A3C2F]/20 pb-6"><Typography variant="h4" className="text-[#1A3C2F]/70 mb-2">{t("store.eyebrow")}</Typography><Typography variant="h1" className="!mb-0">{t("store.title")}</Typography><Typography variant="p" className="text-[#6B7280] mt-4 max-w-2xl">{t("store.description")}</Typography></div><div className="flex flex-wrap gap-2 md:gap-6 mb-12 border-b border-[#E2DEC6]">{tabs.map((tab) => <button key={tab.value} type="button" onClick={() => setActiveTab(tab.value)} className={`pb-4 px-2 font-sans text-sm tracking-wide transition-colors duration-200 border-b-2 ${activeTab === tab.value ? "border-[#1A3C2F] text-[#1A3C2F] font-semibold" : "border-transparent text-[#6B7280] hover:text-[#1A3C2F]"}`}>{t(`store.tabs.${tab.value}`)}</button>)}</div>{filteredProducts.length > 0 ? <Grid columns={3}>{filteredProducts.map((product) => <Card key={product.id} className="h-full group hover:border-[#1A3C2F] transition-colors duration-300">{product.imageUrl && <div className="aspect-video w-full overflow-hidden border-b border-[#E2DEC6]"><img src={product.imageUrl} alt={t(`store.items.${product.id}.title`)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>}<CardContent className="flex flex-col justify-between"><div>{product.instructor && <span className="inline-block bg-[#E2DEC6] text-[#1A3C2F] text-xs px-2 py-1 mb-3">{t(`store.items.${product.id}.instructor`)} {t("store.instructor")}</span>}<Typography variant="h3" className="!text-xl !mb-3">{t(`store.items.${product.id}.title`)}</Typography><Typography variant="p" className="text-[#6B7280] !text-sm">{t(`store.items.${product.id}.description`)}</Typography></div><div className="mt-8 pt-4 border-t border-[#F4F1E9] flex items-center justify-between"><Typography variant="span" className="font-semibold text-[#1A3C2F]">{formatPrice(product.price)}</Typography><Button variant="outline" size="sm" onClick={() => window.open("#", "_blank", "noopener,noreferrer")}>{t("store.purchase")}</Button></div></CardContent></Card>)}</Grid> : <div className="py-20 text-center"><Typography variant="p" className="text-[#6B7280]">{t("store.empty")}</Typography></div>}</main><Footer /></div>;
}
