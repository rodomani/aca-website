import type { Post } from "../../utils/posts";
import { localized } from "../../utils/posts";
export function PostBody({ post, language }: { post: Post; language: string }) {
  const images = [...(post.post_images ?? [])].sort(
    (a, b) => a.display_order - b.display_order,
  );
  // Existing English translations retain their text/gallery display until an English layout is added.
  const blocks =
    language.startsWith("en") && post.body_en ? null : post.body_blocks_ko;
  if (Array.isArray(blocks) && blocks.length)
    return (
      <div className="space-y-6">
        {blocks.map((block, index) => {
          if (block.type === "text")
            return (
              <p
                key={index}
                className="whitespace-pre-wrap break-words leading-8"
              >
                {block.text}
              </p>
            );
          const picture = images.find(
            (image) => image.display_order === block.image_index,
          );
          return picture ? (
            <img
              key={index}
              src={picture.image_url}
              alt={localized(picture.alt_ko, picture.alt_en, language)}
              loading="lazy"
              className="mx-auto h-auto max-w-full"
            />
          ) : null;
        })}
      </div>
    );
  return (
    <>
      <p className="whitespace-pre-wrap break-words leading-8">
        {localized(post.body_ko, post.body_en, language)}
      </p>
      <div className="mt-10 space-y-6">
        {images.map((image) => (
          <img
            key={image.id}
            src={image.image_url}
            alt={localized(image.alt_ko, image.alt_en, language)}
            loading="lazy"
            className="mx-auto h-auto max-w-full"
          />
        ))}
      </div>
    </>
  );
}
