"use client";

import { useActionState, useState, type FormEvent } from "react";
import type { ActionState } from "@/app/admin/actions";
import type { CategoryOption } from "@/lib/data";
import { uploadToCloudinary } from "@/lib/cloudinary";

const spanOptions = [
  { value: "", label: "Normal (1 col)" },
  { value: "md:col-span-2", label: "Wide (2 col)" },
  { value: "md:row-span-2", label: "Tall (2 row)" },
  { value: "md:col-span-2 md:row-span-2", label: "Large (2x2)" },
];

export default function PhotoForm({
  action,
  categories,
  initial,
  currentImageUrl,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  categories: CategoryOption[];
  initial?: {
    title: string;
    category: string;
    location: string;
    year: string;
    span: string;
    project?: string;
  };
  currentImageUrl?: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedCount, setSelectedCount] = useState(0);
  const isEdit = !!initial;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const formData = new FormData(event.currentTarget);
    const files = formData
      .getAll("image")
      .filter((f): f is File => f instanceof File && f.size > 0);
    formData.delete("image");

    if (!isEdit && files.length === 0) {
      setUploadError("Choose at least one image to upload.");
      return;
    }

    if (files.length > 0) {
      setUploading(true);
      try {
        const results = await Promise.all(files.map(uploadToCloudinary));
        const toPayload = (r: (typeof results)[number]) => ({
          url: r.url,
          publicId: r.publicId,
          width: r.width,
          height: r.height,
        });

        if (isEdit) {
          // The first file replaces this photo's own image; any further
          // files become new photos alongside it (same category/location/
          // year, numbered off this photo's title).
          const [first, ...rest] = results;
          formData.set("imageUrl", first.url);
          formData.set("imagePublicId", first.publicId);
          formData.set("imageWidth", String(first.width));
          formData.set("imageHeight", String(first.height));
          if (rest.length > 0) {
            formData.set("photosJson", JSON.stringify(rest.map(toPayload)));
          }
        } else {
          // Creating: every file becomes its own new photo.
          formData.set("photosJson", JSON.stringify(results.map(toPayload)));
        }
      } catch (err) {
        setUploading(false);
        setUploadError(err instanceof Error ? err.message : "Upload failed.");
        return;
      }
      setUploading(false);
    }

    formAction(formData);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5">
      {currentImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentImageUrl}
          alt="Current"
          className="h-40 w-32 rounded object-cover"
        />
      )}

      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          {isEdit ? "Image (leave empty to keep current)" : "Images"}
        </label>
        <input
          name="image"
          type="file"
          accept="image/*"
          multiple
          required={!currentImageUrl}
          onChange={(e) => setSelectedCount(e.target.files?.length ?? 0)}
          className="w-full font-sans text-sm text-muted file:mr-4 file:rounded-full file:border file:border-line file:bg-transparent file:px-3 file:py-1.5 file:font-sans file:text-[12px] file:uppercase file:tracking-[0.1em] file:text-fg"
        />
        {selectedCount > 1 && (
          <p className="mt-1.5 font-sans text-[12px] text-muted">
            {isEdit
              ? `${selectedCount} images selected — the first replaces this photo, the other ${selectedCount - 1} publish as new photos alongside it.`
              : `${selectedCount} images selected — each will be published as its own photo.`}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          Title{" "}
          {selectedCount > 1 &&
            (isEdit
              ? "(extra images are numbered off this — “Title 2”, “Title 3”, …)"
              : "(used as a base — “Title 1”, “Title 2”, …)")}
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initial?.title}
          className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          Project (optional)
        </label>
        <input
          name="project"
          type="text"
          defaultValue={initial?.project}
          placeholder="e.g. Mother's Love"
          className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
        <p className="mt-1.5 font-sans text-[12px] text-muted">
          Give a shoot a name and every photo that shares it groups together
          as one tile on /work — leave empty for a standalone photo.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            Category
          </label>
          <select
            name="category"
            required
            defaultValue={initial?.category}
            className="w-full rounded-md border border-line bg-bg px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
          >
            <option value="" disabled>
              Choose…
            </option>
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            Grid size
          </label>
          <select
            name="span"
            defaultValue={initial?.span}
            className="w-full rounded-md border border-line bg-bg px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
          >
            {spanOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            Location
          </label>
          <input
            name="location"
            type="text"
            defaultValue={initial?.location}
            placeholder="Accra, GH"
            className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            Year
          </label>
          <input
            name="year"
            type="text"
            defaultValue={initial?.year}
            placeholder="2025"
            className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      {(uploadError || state?.error) && (
        <p className="font-sans text-[13px] text-accent">
          {uploadError ?? state?.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || uploading}
        className="mt-2 self-start rounded-full bg-fg px-5 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97] disabled:opacity-50"
      >
        {uploading
          ? selectedCount > 1
            ? `Uploading ${selectedCount} images…`
            : "Uploading image…"
          : pending
            ? "Saving…"
            : submitLabel}
      </button>
    </form>
  );
}
