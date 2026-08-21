"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/admin/actions";

export default function RateCardForm({
  action,
  initial,
  currentImageUrl,
  submitLabel,
}: {
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  initial?: {
    title: string;
    description: string;
    priceAmount: number;
    priceCurrency: string;
    priceNote: string;
  };
  currentImageUrl?: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className="flex max-w-lg flex-col gap-5">
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
          placeholder="e.g. Wedding Photography"
          className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          Description
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial?.description}
          className="w-full resize-none rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            Price
          </label>
          <input
            name="priceAmount"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={initial?.priceAmount}
            className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            Currency
          </label>
          <input
            name="priceCurrency"
            type="text"
            defaultValue={initial?.priceCurrency ?? "GHS"}
            className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
            Note
          </label>
          <input
            name="priceNote"
            type="text"
            defaultValue={initial?.priceNote}
            placeholder="starting at · 1hr"
            className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      {state?.error && (
        <p className="font-sans text-[13px] text-accent">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-full bg-fg px-5 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97] disabled:opacity-50"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
