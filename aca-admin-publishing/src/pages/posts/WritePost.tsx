import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAdmin } from "../../hooks/useAdmin";
import { PostLayout } from "../../components/posts/PostLayout";
import { Typography } from "../../components/ui/Typography";
import { Button } from "../../components/ui/Button";
import { supabase } from "../../utils/supabase";
import {
  contentTypes,
  IMAGE_BUCKET,
  imageError,
  imageExtensions,
} from "../../utils/posts";
import type { PostSection } from "../../utils/posts";

type Picture = { key: string; file: File; preview: string; alt: string };
const inputClass =
  "mt-2 block w-full border border-[#E2DEC6] bg-white px-4 py-3 text-[#2C2C2C] outline-none focus:border-[#1A3C2F] disabled:bg-[#F4F1E9]";
export function WritePost({ section }: { section: PostSection }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const access = useAdmin();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [pictures, setPictures] = useState<Picture[]>([]);
  const [busy, setBusy] = useState(false);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [draftId, setDraftId] = useState(() => crypto.randomUUID());
  const uploaded = useRef(new Map<string, string>());
  const urls = useRef(new Set<string>());
  const sending = useRef(false);
  const previousUser = useRef<string | null>(null);

  useEffect(
    () => () => {
      urls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );
  useEffect(() => {
    // Never carry one account's unfinished text into another account's editor.
    if (previousUser.current === access.userId) return;
    previousUser.current = access.userId;
    setTitle("");
    setDescription("");
    setCategory("");
    setBody("");
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current.clear();
    setPictures([]);
    uploaded.current.clear();
    setDraftId(crypto.randomUUID());
    setLocked(false);
    setError("");
  }, [access.userId]);
  useEffect(() => {
    if (!title && !description && !body && !pictures.length) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [title, description, body, pictures.length]);

  const addPictures = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    const issue = imageError(files, pictures.length);
    if (issue) {
      setError(t(issue));
      return;
    }
    setError("");
    setPictures((current) => [
      ...current,
      ...files.map((file) => {
        const preview = URL.createObjectURL(file);
        urls.current.add(preview);
        return { key: crypto.randomUUID(), file, preview, alt: "" };
      }),
    ]);
  };
  const removePicture = (key: string) =>
    setPictures((current) =>
      current.filter((picture) => {
        if (picture.key !== key) return true;
        URL.revokeObjectURL(picture.preview);
        urls.current.delete(picture.preview);
        return false;
      }),
    );
  const movePicture = (index: number, direction: number) =>
    setPictures((current) => {
      const next = [...current];
      [next[index], next[index + direction]] = [
        next[index + direction],
        next[index],
      ];
      return next;
    });
  const publish = async (event: FormEvent) => {
    event.preventDefault();
    if (sending.current || !access.isAdmin || !access.userId) return;
    if (
      !title.trim() ||
      !description.trim() ||
      !category.trim() ||
      !body.trim()
    ) {
      setError(t("posts.required"));
      return;
    }
    const issue = imageError(
      pictures.map((picture) => picture.file),
      0,
    );
    if (issue) {
      setError(t(issue));
      return;
    }
    sending.current = true;
    setBusy(true);
    setError("");
    const publishingUser = access.userId;
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || user?.id !== publishingUser)
        throw new Error(t("posts.denied"));
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", publishingUser)
        .maybeSingle();
      if (profileError || profile?.role !== "admin")
        throw new Error(t("posts.denied"));
      const images: { path: string; url: string; alt: string }[] = [];
      for (const [index, picture] of pictures.entries()) {
        setProgress(
          t("posts.uploading", { current: index + 1, total: pictures.length }),
        );
        let path = uploaded.current.get(picture.key);
        if (!path) {
          path = `${publishingUser}/${draftId}/${picture.key}.${imageExtensions[picture.file.type]}`;
          const { error } = await supabase.storage
            .from(IMAGE_BUCKET)
            .upload(path, picture.file, {
              upsert: true,
              contentType: picture.file.type,
            });
          if (error) throw error;
          uploaded.current.set(picture.key, path);
        }
        images.push({
          path,
          url: supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data
            .publicUrl,
          alt: picture.alt.trim(),
        });
      }
      if (previousUser.current !== publishingUser)
        throw new Error(t("posts.denied"));
      setProgress(t("posts.publishing"));
      setLocked(true);
      // Freeze the payload after the request begins. Retrying the same UUID is idempotent.
      const { data, error } = await supabase.rpc("aca_publish_post", {
        p_post: {
          id: draftId,
          content_type: contentTypes[section],
          title: title.trim(),
          description: description.trim(),
          category: category.trim(),
          body: body.trim(),
        },
        p_images: images,
      });
      if (error) throw error;
      if (typeof data !== "string") throw new Error(t("posts.publishError"));
      navigate(`/${section}/${data}`, { replace: true });
    } catch (reason) {
      const detail =
        reason && typeof reason === "object" && "message" in reason
          ? String(reason.message)
          : "";
      setError(`${t("posts.publishError")} ${detail}`);
    } finally {
      sending.current = false;
      setBusy(false);
      setProgress("");
    }
  };

  if (access.loading)
    return (
      <PostLayout>
        <p role="status">{t("posts.checking")}</p>
      </PostLayout>
    );
  if (!access.isAdmin)
    return (
      <PostLayout>
        <Typography variant="h1">{t("posts.adminOnly")}</Typography>
        <p role="alert">
          {t(access.error ? "posts.profileError" : "posts.denied")}
        </p>
        <Link
          to={access.userId ? `/${section}` : "/login"}
          className="mt-6 inline-block underline"
        >
          {t(access.userId ? "posts.back" : "header.login")}
        </Link>
      </PostLayout>
    );
  return (
    <PostLayout>
      <p className="mb-3 text-sm font-semibold text-[#1A3C2F]/70">
        {t(`navigation.${section}`)}
      </p>
      <Typography variant="h1">{t("posts.write")}</Typography>
      <p className="mb-8 text-[#6B7280]">{t("posts.editorDescription")}</p>
      <form
        onSubmit={publish}
        className="space-y-7 border border-[#E2DEC6] bg-white p-6 md:p-10"
      >
        <fieldset
          disabled={busy || locked}
          className="space-y-6 disabled:opacity-75"
        >
          <label className="block font-medium">
            {t("posts.title")}
            <input
              required
              maxLength={200}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block font-medium">
            {t("posts.description")}
            <textarea
              required
              rows={3}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block font-medium">
            {t("posts.category")}
            <input
              required
              maxLength={100}
              placeholder={t("posts.categoryExample")}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className={inputClass}
            />
          </label>
          <label className="block font-medium">
            {t("posts.body")}
            <textarea
              required
              rows={12}
              maxLength={100000}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className={inputClass}
            />
          </label>
          <section aria-labelledby="picture-heading">
            <h2 id="picture-heading" className="font-medium">
              {t("posts.pictures")}
            </h2>
            <p id="picture-help" className="mt-2 text-sm text-[#6B7280]">
              {t("posts.pictureHelp")}
            </p>
            <label className="mt-4 block">
              <span className="sr-only">{t("posts.addPictures")}</span>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/gif"
                aria-describedby="picture-help"
                onChange={addPictures}
                className="max-w-full text-sm file:mr-4 file:border-0 file:bg-[#F4F1E9] file:px-4 file:py-3 file:text-[#1A3C2F]"
              />
            </label>
            <ol className="mt-5 space-y-4">
              {pictures.map((picture, index) => (
                <li
                  key={picture.key}
                  className="flex flex-col gap-4 border border-[#E2DEC6] p-4 sm:flex-row"
                >
                  <img
                    src={picture.preview}
                    alt=""
                    className="h-28 w-36 object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">
                      {index + 1}. {picture.file.name}
                      {index === 0 && (
                        <span className="ml-3 text-[#1A3C2F]">
                          {t("posts.cover")}
                        </span>
                      )}
                    </p>
                    <label className="mt-2 block text-sm">
                      {t("posts.alt")}
                      <input
                        maxLength={300}
                        value={picture.alt}
                        onChange={(event) =>
                          setPictures((current) =>
                            current.map((item) =>
                              item.key === picture.key
                                ? { ...item, alt: event.target.value }
                                : item,
                            ),
                          )
                        }
                        className={inputClass}
                      />
                    </label>
                    <div className="mt-3 flex gap-4 text-sm">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => movePicture(index, -1)}
                        className="underline disabled:opacity-30"
                      >
                        {t("posts.up")}
                      </button>
                      <button
                        type="button"
                        disabled={index === pictures.length - 1}
                        onClick={() => movePicture(index, 1)}
                        className="underline disabled:opacity-30"
                      >
                        {t("posts.down")}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePicture(picture.key)}
                        className="text-red-700 underline"
                      >
                        {t("posts.remove")}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </fieldset>
        {locked && !busy && (
          <p className="text-sm text-[#6B7280]">{t("posts.retryHint")}</p>
        )}
        {error && (
          <p
            role="alert"
            className="whitespace-pre-wrap break-words text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {progress && (
          <p role="status" aria-live="polite">
            {progress}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-4 border-t border-[#E2DEC6] pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => {
              if (
                (!title && !description && !body && !pictures.length) ||
                window.confirm(t("posts.discard"))
              )
                navigate(`/${section}`);
            }}
          >
            {t("posts.cancel")}
          </Button>
          <Button type="submit" disabled={busy}>
            {busy
              ? t("posts.publishing")
              : locked
                ? t("posts.retry")
                : t("posts.publish")}
          </Button>
        </div>
      </form>
    </PostLayout>
  );
}
