"use client";

import { useActionState } from "react";
import { setupAdminAccount, type SetupState } from "@/app/admin/actions";

export default function SetupAccountForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState<SetupState, FormData>(
    setupAdminAccount,
    null
  );

  if (state?.message) {
    return (
      <p className="font-sans text-[15px] leading-relaxed text-fg">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="flex w-full flex-col gap-4">
      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          Email
        </label>
        <input
          value={email}
          readOnly
          className="w-full rounded-md border border-line bg-bg-raised px-3 py-2.5 font-sans text-sm text-muted outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          Password (or PIN)
        </label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="At least 6 characters"
          className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      <div>
        <label className="mb-1.5 block font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
          Confirm
        </label>
        <input
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className="w-full rounded-md border border-line bg-transparent px-3 py-2.5 font-sans text-sm outline-none transition-colors focus:border-accent"
        />
      </div>

      {state?.error && (
        <p className="font-sans text-[13px] text-accent">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-full bg-fg px-4 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97] disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create account"}
      </button>
    </form>
  );
}
