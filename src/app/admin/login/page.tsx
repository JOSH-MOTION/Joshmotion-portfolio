"use client";

import { useActionState } from "react";
import { signIn, type ActionState } from "@/app/admin/actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    signIn,
    null
  );

  return (
    <div className="mx-auto flex min-h-screen max-w-xs flex-col items-center justify-center px-6 text-center">
      <p className="mb-2 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
        Joshmotion
      </p>
      <h1 className="mb-8 font-display font-extrabold uppercase text-3xl">Enter PIN</h1>

      <form action={formAction} className="flex w-full flex-col items-center gap-6">
        <input
          name="pin"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          className="w-full rounded-md border border-line bg-transparent px-4 py-4 text-center font-display text-2xl font-bold tracking-[0.3em] outline-none transition-colors focus:border-accent"
        />

        {state?.error && (
          <p className="font-sans text-[13px] text-accent">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full bg-fg px-4 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97] disabled:opacity-50"
        >
          {pending ? "Checking…" : "Unlock"}
        </button>
      </form>

      <a
        href="/admin/setup-account"
        className="mt-8 font-sans text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
      >
        First time? Create your account
      </a>
    </div>
  );
}
