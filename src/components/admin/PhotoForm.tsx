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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setUploadError(null);

    const formData = new FormData(event.currentTarget);
    const file = formData.get("image") as File | null;
    formData.delete("image");

    if (file && file.size > 0) {
      setUploading(true);
      try {
        const result = await uploadToCloudinary(file);
        formData.set("imageUrl", result.url);
        formData.set("imagePublicId", result.publicId);
        formData.set("imageWidth", String(result.width));
        formData.set("imageHeight", String(result.height));
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
          Image {currentImageUrl && "(leave empty to keep current)"}
        </label>
        <input
          name="image"
          type="file"
          accept="image/*"
          required={!currentImageUrl}
          className="w-full font-sans text-sm text-muted file:mr-4 file:rounded-full file:border file:border-line file:bg-transparent file:px-3 file:py-1.5 file:font-sans file:text-[12px] file:uppercase file:tracking-[0.1em] file:text-fg"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          Title
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initial?.title}
          className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
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
        {uploading ? "Uploading image…" : pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
