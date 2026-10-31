import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { newTextBlock } from "../../utils/postBlocks";
import type { DraftBlock } from "../../utils/postBlocks";

export function PostBodyEditor({
  blocks,
  onChange,
  onFiles,
  onRemove,
}: {
  blocks: DraftBlock[];
  onChange: (blocks: DraftBlock[]) => void;
  onFiles: (event: ChangeEvent<HTMLInputElement>, after: number) => void;
  onRemove: (key: string) => void;
}) {
  const { t } = useTranslation();
  const inputClass =
    "mt-2 block w-full border border-[#E2DEC6] bg-white px-4 py-3 text-[#2C2C2C] outline-none focus:border-[#1A3C2F]";
  const move = (index: number, direction: number) => {
    const next = [...blocks];
    [next[index], next[index + direction]] = [
      next[index + direction],
      next[index],
    ];
    onChange(next);
  };
  const insertControls = (after: number) => (
    <div className="my-4 flex flex-wrap items-center gap-3 text-sm">
      <button
        type="button"
        className="border border-[#E2DEC6] bg-[#F4F1E9] px-3 py-2 text-[#1A3C2F]"
        onClick={() =>
          onChange([
            ...blocks.slice(0, after + 1),
            newTextBlock(),
            ...blocks.slice(after + 1),
          ])
        }
      >
        {t("posts.addParagraph")}
      </button>
      <label className="block min-w-0">
        <span className="sr-only">
          {t("posts.insertPhoto", { position: after + 1 })}
        </span>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(event) => onFiles(event, after)}
          className="max-w-full text-sm file:mr-2 file:border-0 file:bg-[#F4F1E9] file:px-3 file:py-2 file:text-[#1A3C2F]"
        />
      </label>
    </div>
  );
  return (
    <section aria-labelledby="post-body-heading">
      <h2 id="post-body-heading" className="font-medium">
        {t("posts.body")}
      </h2>
      <p className="mt-2 text-sm text-[#6B7280]">{t("posts.inlineHelp")}</p>
      <p className="mt-2 text-sm text-[#6B7280]">{t("posts.pictureHelp")}</p>
      {insertControls(-1)}
      <ol>
        {blocks.map((block, index) => (
          <li key={block.key}>
            <div className="border border-[#E2DEC6] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span>
                  {t(
                    block.type === "text"
                      ? "posts.paragraphNumber"
                      : "posts.photoNumber",
                    { number: index + 1 },
                  )}
                </span>
                <div className="flex gap-4">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                    className="underline disabled:opacity-30"
                  >
                    {t("posts.up")}
                  </button>
                  <button
                    type="button"
                    disabled={index === blocks.length - 1}
                    onClick={() => move(index, 1)}
                    className="underline disabled:opacity-30"
                  >
                    {t("posts.down")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(block.key)}
                    className="text-red-700 underline"
                  >
                    {t("posts.remove")}
                  </button>
                </div>
              </div>
              {block.type === "text" ? (
                <label className="block">
                  <span className="sr-only">
                    {t("posts.paragraphNumber", { number: index + 1 })}
                  </span>
                  <textarea
                    rows={5}
                    maxLength={100000}
                    value={block.text}
                    onChange={(event) =>
                      onChange(
                        blocks.map((item) =>
                          item.key === block.key
                            ? { ...block, text: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className={inputClass}
                  />
                </label>
              ) : (
                <>
                  <img
                    src={block.preview}
                    alt={block.alt}
                    className="mx-auto max-h-96 max-w-full object-contain"
                  />
                  <p className="mt-2 break-words text-xs text-[#6B7280]">
                    {block.file.name}
                    {blocks.find((item) => item.type === "image")?.key ===
                    block.key
                      ? ` · ${t("posts.cover")}`
                      : ""}
                  </p>
                  <label className="mt-3 block text-sm">
                    {t("posts.alt")}
                    <input
                      maxLength={300}
                      value={block.alt}
                      onChange={(event) =>
                        onChange(
                          blocks.map((item) =>
                            item.key === block.key
                              ? { ...block, alt: event.target.value }
                              : item,
                          ),
                        )
                      }
                      className={inputClass}
                    />
                  </label>
                </>
              )}
            </div>
            {insertControls(index)}
          </li>
        ))}
      </ol>
    </section>
  );
}
