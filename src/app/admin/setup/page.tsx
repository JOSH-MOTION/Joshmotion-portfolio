export default function AdminSetupPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24">
      <p className="mb-3 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
        Admin — Setup required
      </p>
      <h1 className="font-display font-extrabold uppercase text-3xl leading-[1.1] md:text-4xl">
        Connect a Supabase project to enable the admin.
      </h1>
      <p className="mt-4 font-sans text-[15px] leading-relaxed text-muted">
        The admin panel and public gallery both read from Supabase once it&apos;s
        configured. Until then, the site falls back to the sample photos in{" "}
        <code className="text-fg">src/lib/photos.ts</code>.
      </p>

      <ol className="mt-8 flex flex-col gap-4 border-t border-line pt-8 font-sans text-[15px] leading-relaxed text-muted">
        <li>
          <span className="text-fg">1.</span> Create a free project at{" "}
          <span className="text-fg">supabase.com</span>.
        </li>
        <li>
          <span className="text-fg">2.</span> In the SQL Editor, paste and run{" "}
          <code className="text-fg">supabase/schema.sql</code> from this project.
        </li>
        <li>
          <span className="text-fg">3.</span> In Storage, create a public bucket
          named exactly <code className="text-fg">photos</code> (the SQL in step 2
          adds its access policies, but the bucket itself has to exist first).
        </li>
        <li>
          <span className="text-fg">4.</span> In Authentication → Users, add a
          user whose email matches <code className="text-fg">ADMIN_EMAIL</code>{" "}
          below, with its password set to whatever PIN you want to type at{" "}
          <code className="text-fg">/admin/login</code> (6–8 digits).
        </li>
        <li>
          <span className="text-fg">5.</span> In Project Settings → API, copy the
          Project URL and the anon/public key into{" "}
          <code className="text-fg">.env.local</code>:
        </li>
      </ol>

      <pre className="mt-4 overflow-x-auto rounded-lg border border-line bg-bg-raised p-4 font-sans text-[13px] text-muted">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
ADMIN_EMAIL=you@example.com`}
      </pre>

      <p className="mt-6 font-sans text-[13px] text-muted">
        Restart <code className="text-fg">npm run dev</code> after saving the file.
      </p>
    </div>
  );
}
