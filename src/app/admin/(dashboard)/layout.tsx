import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-display text-lg font-extrabold uppercase"
            >
              <Image src="/logo-icon.png" alt="" width={32} height={31} className="h-6 w-auto" />
              Joshmotion admin
            </Link>
            <nav className="flex items-center gap-5 font-sans text-[13px] uppercase tracking-[0.1em] text-muted">
              <Link href="/admin" className="transition-colors hover:text-fg">
                Photos
              </Link>
              <Link href="/admin/categories" className="transition-colors hover:text-fg">
                Categories
              </Link>
              <Link href="/admin/rates" className="transition-colors hover:text-fg">
                Rates
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden font-sans text-[13px] text-muted sm:inline">
              {user?.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-line px-3.5 py-1.5 font-sans text-[12px] uppercase tracking-[0.1em] transition-colors hover:border-accent hover:text-accent"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
