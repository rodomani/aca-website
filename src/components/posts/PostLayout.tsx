import type { ReactNode } from "react";
import { Header } from "../layout/Header";
import { Footer } from "../layout/Footer";
export function PostLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#F4F1E9]">
      <Header />
      <main className="container mx-auto w-full max-w-5xl flex-grow px-4 py-12 md:px-8 md:py-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}
