export type NoticeListItem = {
  id: string;
  publishDate: string;
  isPinned?: boolean;
};

export const notices: NoticeListItem[] = [
  {
    id: "membership",
    publishDate: "2026-07-15T09:00:00Z",
    isPinned: true,
  },
  {
    id: "callForPapers",
    publishDate: "2026-07-01T09:00:00Z",
    isPinned: true,
  },
  {
    id: "workshop",
    publishDate: "2026-06-20T09:00:00Z",
  },
  {
    id: "exhibition",
    publishDate: "2026-06-10T09:00:00Z",
  },
  {
    id: "store",
    publishDate: "2026-05-28T09:00:00Z",
  },
  {
    id: "certificate",
    publishDate: "2026-05-15T09:00:00Z",
  },
];

export const sortedNotices = [...notices].sort(
  (a, b) => {
    if (a.isPinned && !b.isPinned) {
      return -1;
    }

    if (!a.isPinned && b.isPinned) {
      return 1;
    }

    return (
      new Date(b.publishDate).getTime() -
      new Date(a.publishDate).getTime()
    );
  },
);