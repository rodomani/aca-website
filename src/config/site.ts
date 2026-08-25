export const siteConfig = {
  name: "Asian Culture Association",
  shortName: "ACA",
  description:
    "Preserving, researching, and sharing the heritage of Asian culture through archives, education, and community programs.",
  url: "https://www.aca-example.org",
  orgInfo: {
    email: "contact@aca-example.org",
  },
  mainNav: [
    { key: "notices", href: "/notices" },
    { key: "research", href: "/research" },
    { key: "archive", href: "/archive" },
    { key: "store", href: "/store" },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
