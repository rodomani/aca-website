export const siteConfig = {
  name: "Asian Culture Association",
  shortName: "ACA",
  description:
    "Preserving, researching, and sharing the heritage of Asian culture through archives, education, and community programs.",
  url: "https://www.aca-example.org",
  orgInfo: {
    email: "asian05@naver.com",
  },
  mainNav: [
    { key: "notices", href: "/notices" },
    { key: "research", href: "/research" },
    { key: "archive", href: "/archive" },
    { key: "store", href: "/store" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
