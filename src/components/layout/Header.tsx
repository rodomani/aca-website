import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { siteConfig } from "../../config/site";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { supabase } from "../../utils/supabase";

export function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(Boolean(session));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setIsAuthenticated(Boolean(session)),
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await supabase.auth.signOut();
    setIsLoggingOut(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2DEC6] bg-[#F4F1E9]">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden">
            <img
              src="/acaimage.jpg"
              alt={t("header.logoAlt", { name: siteConfig.shortName })}
              className="h-full w-full object-contain"
            />
          </div>
          <span className="hidden font-serif text-xl leading-tight tracking-wide text-[#1A3C2F] md:block">
            {siteConfig.name}
          </span>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden items-center gap-8 md:flex" aria-label={t("header.primaryNavigation")}>
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="relative font-sans text-sm uppercase tracking-widest text-[#2C2C2C] after:absolute after:bottom-[-4px] after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-[#1A3C2F] after:transition-transform after:duration-300 hover:text-[#1A3C2F] hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {t(`navigation.${item.key}`)}
              </Link>
            ))}
          </nav>

          <LanguageSwitcher />
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="font-sans text-sm font-semibold text-[#1A3C2F] underline underline-offset-4 disabled:cursor-wait disabled:opacity-60"
            >
              {isLoggingOut ? t("header.loggingOut") : t("header.logout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="font-sans text-sm font-semibold text-[#1A3C2F] underline underline-offset-4"
            >
              {t("header.login")}
            </Link>
          )}

          <button
            type="button"
            className="flex flex-col gap-[6px] p-2 md:hidden"
            aria-label={t("header.openMenu")}
          >
            <span className="block h-px w-6 bg-[#1A3C2F]" />
            <span className="block h-px w-6 bg-[#1A3C2F]" />
            <span className="block h-px w-6 bg-[#1A3C2F]" />
          </button>
        </div>
      </div>
    </header>
  );
}
