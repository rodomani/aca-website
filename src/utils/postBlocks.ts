export type TextBlock = { key: string; type: "text"; text: string };
export type PictureBlock = {
  key: string;
  type: "image";
  file: File;
  preview: string;
  alt: string;
};
export type DraftBlock = TextBlock | PictureBlock;
export const newTextBlock = (): TextBlock => ({
  key: crypto.randomUUID(),
  type: "text",
  text: "",
});
