import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SetupAccountForm from "@/components/admin/SetupAccountForm";

export default async function SetupAccountPage() {
  const email = process.env.ADMIN_EMAIL ?? "";

  const supabase = await createClient();
  const { count } = await supabase
    .from("admin_setup")
    .select("key", { count: "exact", head: true });
  const alreadySetUp = !!count && count > 0;

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <p className="mb-2 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
        Joshmotion
      </p>

      {alreadySetUp ? (
        <>
          <h1 className="mb-2 font-display font-extrabold uppercase text-3xl">Already set up</h1>
          <p className="mb-8 font-sans text-[13px] leading-relaxed text-muted">
            The admin account has already been created. This page doesn&apos;t
            accept new sign-ups anymore.
          </p>
          <Link
            href="/admin/login"
            className="w-fit rounded-full bg-fg px-4 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97]"
          >
            Go to login
          </Link>
        </>
      ) : (
        <>
          <h1 className="mb-2 font-display font-extrabold uppercase text-3xl">Create your account</h1>
          <p className="mb-8 font-sans text-[13px] leading-relaxed text-muted">
            One-time setup. This works once — after your account exists, this
            page stops accepting new sign-ups and you&apos;ll use{" "}
            <span className="text-fg">/admin/login</span> instead.
          </p>
          <SetupAccountForm email={email} />
        </>
      )}
    </div>
  );
}
