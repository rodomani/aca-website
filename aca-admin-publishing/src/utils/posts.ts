export const sections = ["notices", "research", "archive"] as const;
export type PostSection = (typeof sections)[number];
export const contentTypes: Record<PostSection, string> = {
  notices: "notice",
  research: "research",
  archive: "archive",
};
export const IMAGE_BUCKET = "aca-post-images";
export const MAX_IMAGES = 10;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const imageExtensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
export function isPostSection(value: string | undefined): value is PostSection {
  return sections.some((section) => section === value);
}
export function imageError(
  files: { type: string; size: number }[],
  count: number,
): string | null {
  if (count + files.length > MAX_IMAGES) return "posts.tooManyImages";
  if (
    files.some(
      (file) =>
        !imageExtensions[file.type] ||
        file.size > MAX_IMAGE_BYTES ||
        file.size === 0,
    )
  )
    return "posts.invalidImage";
  return null;
}
export type PostImage = {
  id: string;
  image_url: string;
  alt_ko: string | null;
  alt_en: string | null;
  display_order: number;
};
export type Post = {
  id: string;
  content_type: string;
  category: string;
  title_ko: string;
  title_en: string | null;
  summary_ko: string | null;
  summary_en: string | null;
  body_ko: string;
  body_en: string | null;
  author_ko: string | null;
  author_en: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  is_pinned: boolean;
  post_images: PostImage[];
};
export const postColumns =
  "id,content_type,category,title_ko,title_en,summary_ko,summary_en,body_ko,body_en,author_ko,author_en,cover_image_url,published_at,is_pinned,post_images(id,image_url,alt_ko,alt_en,display_order)";
export function localized(
  ko: string | null,
  en: string | null,
  language: string,
): string {
  return (language.startsWith("en") ? en || ko : ko || en) ?? "";
}
