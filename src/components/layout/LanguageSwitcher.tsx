import { useTranslation } from "react-i18next";

type Language = "en" | "ko";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const currentLanguage: Language =
    i18n.resolvedLanguage?.startsWith("ko") ? "ko" : "en";
  const nextLanguage: Language = currentLanguage === "en" ? "ko" : "en";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={currentLanguage === "ko"}
      aria-label={
        currentLanguage === "en"
          ? t("header.switchToKorean")
          : t("header.switchToEnglish")
      }
      onClick={() => void i18n.changeLanguage(nextLanguage)}
      className="relative inline-flex h-9 w-[5.5rem] items-center rounded-full border border-[#1A3C2F]/40 bg-[#E2DEC6]/50 p-1 text-xs font-semibold tracking-wide text-[#1A3C2F] transition-colors hover:bg-[#E2DEC6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A3C2F]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[2.45rem] rounded-full bg-[#1A3C2F] transition-transform duration-200 ease-out"
        style={{ transform: currentLanguage === "ko" ? "translateX(2.45rem)" : "translateX(0)" }}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1.5">
        <span className={currentLanguage === "en" ? "text-[#F4F1E9]" : ""}>EN</span>
        <span className={currentLanguage === "ko" ? "text-[#F4F1E9]" : ""}>KR</span>
      </span>
    </button>
  );
}
