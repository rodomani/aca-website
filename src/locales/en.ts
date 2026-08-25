const en = {
  home: {
    hero: {
      eyebrow: "Welcome to {{siteName}}",
      title: "Preserving and sharing the heritage of Asian culture.",
      description:
        "Preserving, researching, and sharing the heritage of Asian culture through archives, education, and community programs.",
      invitation:
        "We invite you to explore our archives, participate in our educational programs, and join our community.",
      exploreArchive: "Explore the Archive",
      viewPrograms: "View Programs",
    },
    quickLinks: {
      title: "Discover ACA",
      items: {
        notices: {
          title: "Notices",
          description: "Announcements and official notices",
        },
        research: {
          title: "Asian Culture Research",
          description: "Asian culture research and articles",
        },
        archive: {
          title: "Culture Archive",
          description: "Cultural archive and historical posters",
        },
        store: {
          title: "ACA Cultural Programs",
          description:
            "Association cultural products, classes, and certificates",
        },
      },
    },
    featured: {
      title: "Join Our Next One-Day Class",
      description:
        "Experience hands-on cultural education with our expert instructors. Registration is now open for our upcoming sessions.",
      button: "Learn More",
    },
  },
  navigation: {
    notices: "Notices",
    research: "Research",
    archive: "Archive",
    store: "Programs & Store",
  },
  header: {
    logoAlt: "{{name}} logo",
    openMenu: "Open navigation menu",
    primaryNavigation: "Primary navigation",
    switchToKorean: "Switch language to Korean",
    switchToEnglish: "Switch language to English",
  },
  footer: {
    description:
      "Preserving, researching, and sharing the heritage of Asian culture through archives, education, and community programs.",
    navigation: "Navigation",
    contact: "Contact",
    copyright: "© {{year}} {{name}}. All rights reserved.",
  },
  notices: {
    eyebrow: "Announcements",
    title: "Notices",
    description:
      "Stay updated with the latest news, official notices, and announcements from the Asian Culture Association.",
    pinned: "NOTICE",
    columns: { number: "No.", title: "Title", author: "Author", date: "Date" },
    items: {
      membership: {
        title: "Membership fee payment and renewal guide",
        author: "Administration",
      },
      callForPapers: {
        title: "Call for papers: Asian Culture Research, Vol. 5",
        author: "Research Institute",
      },
      workshop: {
        title: "Summer traditional textile workshop registration",
        author: "Education Team",
      },
      exhibition: {
        title: "Traditional arts exhibition opening guide",
        author: "Planning Team",
      },
      store: {
        title: "Smart Store opening and course-material purchase guide",
        author: "Operations Team",
      },
      certificate: {
        title: "Certificate Level 2 issuance delay notice",
        author: "Administration",
      },
    },
  },
  research: {
    eyebrow: "Publications & Journals",
    title: "Asian Culture Research",
    description:
      "Discover our collection of academic papers, journals, and scholarly articles dedicated to the deep and diverse heritage of Asian culture.",
    downloadPdf: "Download PDF",
    pdfUnavailable: "PDF Unavailable",
    items: {
      textiles: {
        title: "Traditional textile techniques and contemporary applications",
        abstract:
          "An examination of historic Asian textile methods and their practical relevance today.",
        author: "Dr. Kim Munhwa (ACA Research Institute)",
      },
      tea: {
        title: "A history of East Asian tea culture",
        abstract:
          "A comparative study of the origins and development of tea culture in Korea, China, and Japan.",
        author: "Professor Lee Yeoksa",
      },
      buddhistArt: {
        title: "Buddhist art and cultural exchange along the Silk Road",
        abstract:
          "Tracing the movement and transformation of Buddhist art across Asia.",
        author: "Park Yejin, Researcher",
      },
      architecture: {
        title: "Climate adaptation in Southeast Asian traditional architecture",
        abstract:
          "An analysis of environmental design principles in regional vernacular architecture.",
        author: "Dr. Choi Geonchuk",
      },
    },
  },
  archive: {
    eyebrow: "Archive Gallery",
    title: "Culture Archive",
    description:
      "Explore our collection of visual history, featuring posters from past exhibitions, symposiums, and cultural events hosted by the association.",
    items: {
      festival: { title: "2025 Asian Traditional Arts Festival" },
      symposium: { title: "Heritage & Modernity Symposium" },
      concert: { title: "Echoes of the East: Music Concert" },
      calligraphy: { title: "Calligraphy Masterclass Exhibition" },
      film: { title: "Pan-Asian Film Retrospective" },
      gala: { title: "Winter Solstice Cultural Gala" },
    },
  },
  store: {
    eyebrow: "Culture Store & Programs",
    title: "ACA Cultural Programs",
    description:
      "Register for our classes, purchase official course materials, and process certificate issuances through our Smart Store.",
    tabs: {
      ALL: "View All",
      CLASS: "Classes",
      MATERIAL: "Materials",
      CERTIFICATE: "Certificates",
      SERVICE: "Services",
    },
    instructor: "Instructor",
    purchase: "Buy in Smart Store",
    priceOnRequest: "Price on request",
    empty: "There are no products in this category.",
    items: {
      certificate2: {
        title: "Level 2 private certificate issuance",
        description: "Official certificate issuance for qualified applicants.",
      },
      completion1: {
        title: "Traditional arts completion certificate — Level 1",
        description:
          "Official completion certificate for foundation-course graduates.",
      },
      completion2: {
        title: "East Asian culture completion certificate — Levels 2 and 3",
        description:
          "Official completion certificate for advanced-course graduates.",
      },
      textile: {
        title: "Traditional textile one-day class",
        description:
          "A focused three-hour introduction to traditional textile techniques.",
        instructor: "Jung Kang",
      },
      dyeing: {
        title: "Traditional dyeing one-day class",
        description: "Learn textile-dyeing techniques using natural materials.",
        instructor: "Jo Bomin",
      },
      calligraphy: {
        title: "Calligraphy one-day class",
        description: "Experience East Asian calligraphy and brushwork.",
        instructor: "Kim Bori",
      },
      textbook: {
        title: "Understanding Asian Culture — textbook set",
        description: "Two-volume set used in ACA education courses.",
      },
      kit: {
        title: "Workshop materials kit",
        description: "A comprehensive kit for workshops and practical classes.",
      },
      service: {
        title: "Overseas traditional craft purchase service",
        description: "A sourcing service for authentic overseas crafts.",
      },
    },
  },
} as const;

export default en;
