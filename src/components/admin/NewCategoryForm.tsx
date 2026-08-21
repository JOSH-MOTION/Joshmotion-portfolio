"use client";

import { useActionState } from "react";
import { createCategory, type ActionState } from "@/app/admin/actions";

export default function NewCategoryForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createCategory,
    null
  );

  return (
    <form action={formAction} className="flex items-end gap-3">
      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          New category
        </label>
        <input
          name="label"
          type="text"
          required
          placeholder="e.g. Weddings"
          className="rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-fg px-4 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97] disabled:opacity-50"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {state?.error && (
        <p className="font-sans text-[13px] text-accent">{state.error}</p>
      )}
    </form>
  );
}
