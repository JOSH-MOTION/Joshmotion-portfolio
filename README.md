Joshmotion — a photography portfolio built with Next.js, Tailwind CSS v4, and Framer Motion.

## Getting started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin panel (posting photos, categories & rates)

There's a password-protected admin at `/admin` for uploading photos, managing
categories, and editing the rate cards on `/rates` — backed by
[Supabase](https://supabase.com) (free tier — Postgres database, file
storage, and auth). **Already provisioned**: the project `JOSH-MOTION's
Project` has the schema applied (`supabase/schema.sql`), a public `photos`
storage bucket, and `.env.local` already points at it. If `/admin` ever
falls back to a `/admin/setup` screen instead of a login form, it means
those env vars are missing (e.g. on a fresh clone or a new deploy target) —
see `.env.local.example` and the Deploy section below.

**Login is a PIN**, not an email/password form — `/admin/login` just asks for
a PIN. Under the hood it's still real Supabase Auth (same security, same
session cookies, same RLS policies); the PIN *is* the password for one fixed
account (`ADMIN_EMAIL` in `.env.local`, defaults to `joshuadoe168@gmail.com`),
so there's nothing weaker about it than before, just less to type.

**Creating that account is self-service** — one step only you can do, on
purpose, since I never see or set your password:

- Visit `/admin/setup-account` and set a password (6+ characters — a short
  PIN like 6 digits works, or a longer real password if you'd rather). It
  works exactly once: after the account exists, that page refuses to create
  a second one and points you to `/admin/login` instead. There's a "First
  time? Create your account" link on the login page too. If your Supabase
  project requires email confirmation, you'll get an email to confirm before
  you can sign in — that's normal, not a bug.
- (Fallback: you can also do this by hand in the Supabase dashboard →
  Authentication → Users, using the same email/password — useful if you ever
  need a second admin account, since self-service is capped at one.)

Once that's done, `/admin` lets you upload a photo (title, category,
location, year, grid size), edit or delete existing ones, and add/rename/
delete categories; `/admin/rates` does the same for the pricing packages
shown on `/rates`. The public site updates immediately after any change
(each mutation calls `revalidatePath`).

**Image hosting:** photo and rate-card images upload straight to
[Cloudinary](https://cloudinary.com) (not Supabase) — see the Cloudinary
section below for how that works and how many images its free tier holds.
Next.js also re-optimizes and serves the right size per device automatically
via `next/image`, so upload one good-quality version and don't worry about
producing multiple sizes yourself.

**How many photos:** for a single project/case study, 8–15 images is the
sweet spot — a lead shot plus supporting frames that vary in composition.
For the whole site, 20–30 curated images across your categories reads as a
full archive without diluting quality.

**Grouping a shoot into one album:** give photos a "Project" name in
`/admin` (e.g. "Mother's Love") and every photo sharing that name displays
as one tile on `/work` — a cover image with a photo-count badge — instead
of cluttering the grid as separate tiles. Clicking it opens the lightbox
straight into that shoot; arrowing past the last photo continues into
whatever comes next in the grid, same as browsing normally. Uploading
several photos at once in `/admin` auto-groups them under the title you
typed, so you usually don't need to fill in "Project" separately — it's
there for grouping photos added at different times, or naming the group
something shorter than the title.

## Site structure

- `/` — hero, a random one-photo-per-category teaser (re-shuffled on every
  visit — the page is `force-dynamic` so this doesn't get cached), the
  cinematic section, about, contact.
- `/work` — the full gallery with category filter tabs (what used to be a
  homepage section is now its own page).
- `/rates` — the horizontal pricing slider.
- `/admin` — the CMS described above.

**Where to add "baby pictures" (or any new category):** categories are
shared across the whole site — `/work`'s filter tabs and each photo's
`category` field both come from the same `categories` table. Add one via
`/admin/categories` (or by hand in `supabase/schema.sql`'s seed list / the
fallback `categories` array in `src/lib/photos.ts`) and it's immediately
available as a filter on `/work` and as a value to pick when uploading a
photo. I've already added `baby-family` ("Baby & Family"), `wedding`
("Weddings"), and `corporate` ("Corporate") as starting categories, with one
sample photo each — the rates page's "Corporate & Headshots" package and
the About page's stats already mention corporate work too.

## Swapping in real photos (without the admin)

If you'd rather skip Supabase entirely and just edit files by hand:

1. Add your images to `public/photos/` (create the folder).
2. Edit `src/lib/photos.ts` — each entry has a `title`, `category`,
   `location`, `year`, and a `seed`/`width`/`height` used to build a
   [Lorem Picsum](https://picsum.photos) placeholder URL. Swap `photoUrl(photo)`
   calls in `Gallery.tsx`/`GalleryCard.tsx`/`Lightbox.tsx` for a local path
   like `/photos/half-light.jpg`.
3. Add/remove entries in the `photos` array — the `span` field controls how
   large each image sits in the grid (`md:col-span-2`, `md:row-span-2`, etc).

This static file is also the fallback the site uses automatically whenever
Supabase isn't configured, so it's always worth keeping current even if you
mainly use the admin.

## Cloudinary (image uploads)

Uploading a photo or rate card in `/admin` does **not** send the file to our
own server first — it uploads straight from your browser to Cloudinary
using an **unsigned upload preset**, then only the resulting URL gets saved
in Supabase. Concretely:

1. You pick a file in the admin form (`PhotoForm.tsx` / `RateCardForm.tsx`).
2. The browser POSTs it directly to
   `https://api.cloudinary.com/v1_1/<cloud name>/image/upload` along with
   the upload preset name (`src/lib/cloudinary.ts`). This only needs the
   cloud name and preset name — both safe to expose in client code, which
   is the whole point of an *unsigned* preset (create one at Cloudinary →
   Settings → Upload → Upload presets, mode set to "Unsigned").
3. Cloudinary uploads the image, resizes/optimizes nothing on its own but
   serves it from its CDN, and responds with a `secure_url` + `public_id`
   (and the image's real width/height, which we use instead of parsing the
   file ourselves).
4. The admin form then submits that URL (not the file) to the normal server
   action, which saves it as `image_path` on the `photos`/`rate_cards` row —
   so `image_path` is now a full Cloudinary URL, not a Supabase Storage
   path.
5. Deleting a photo in admin deletes the Cloudinary asset too, via a
   *signed* request built server-side in `src/app/admin/actions.ts`
   (`deleteCloudinaryAsset`) — signing requires the API secret, which is
   why deletion happens on the server and uploads don't. If that call ever
   fails (bad signature, network blip, wrong `public_id`), it's logged to
   the server console/Vercel function logs rather than silently ignored —
   a common cause of "it's gone from the site but still in Cloudinary" is
   exactly that kind of swallowed error.

Env vars: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` and
`NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` are safe client-side (that's how
unsigned uploads work). `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` are
server-only — never prefix them with `NEXT_PUBLIC_`, they're only used for
the signed delete call.

Cloudinary's free tier is generous for a portfolio (25 credits/month, each
credit ≈ 1GB of storage or bandwidth) — export web-sized images before
uploading (long edge ~2000–2500px, JPEG quality ~80) the same as you would
for any host.

`src/components/Cinematic.tsx` — the full-bleed section between the gallery
and the about section uses a placeholder wave photo with a scroll-linked
zoom, standing in for a real background video. Swap the `<Image>` for a
`<video autoPlay muted loop playsInline>` pointed at your own footage
whenever you have some — the scroll-scale/parallax wiring works the same
either way.

## Logo & social preview image

Your real logo (`public/logo.png`) is now wired in — I cut it apart into
transparent-background assets since the original was a flat square on a
black background:

- `public/logo-icon.png` — just the "JM" monogram + shutter mark, full
  color, transparent background. Used in the nav, admin header, and the
  favicon (`src/app/icon.png`).
- `public/logo-icon-white.png` / `public/logo-icon-black.png` — solid-tint
  versions of the same mark, for contexts where the full color doesn't read
  well (used at small size in the footer).
- `public/logo-full.png` — the complete lockup (icon + "JOSHMOTION" +
  "PHOTOGRAPHY") with a transparent background, if you ever want the whole
  thing somewhere.

`src/app/opengraph-image.png` is the link-preview image (what shows up when
this site is shared on WhatsApp, Twitter/X, iMessage, etc.) — it composites
your About photo (dimmed, grayscale) with the logo mark and your name. It's
a static file Next.js picks up automatically; regenerate it by editing and
rerunning the Python script used to build it (not checked into the repo —
ask me to rebuild it if you change the photo or copy).

## What to personalize before shipping

- `src/components/Hero.tsx` — the `HeroCamera` 3D object is placeholder-free
  (built from primitives, not an image), but the name/subtitle/credential text
  is real — update if anything changes.
- `src/components/About.tsx` — bio copy and the `stats` list (location, kit, availability).
- `src/components/Contact.tsx` — the email (`hello@joshmotion.com`) is still a
  placeholder; Instagram and the phone number are already real.
- `src/app/layout.tsx` — the `metadata` title/description used for SEO and link previews.

## Stack notes

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4.
- Supabase (`@supabase/ssr`) for the admin's database, file storage, and auth — see
  `src/lib/supabase/`, `src/lib/data.ts`, `src/proxy.ts`, and `src/app/admin/`.
- Framer Motion for the reveal-on-scroll, filter tabs, page-load stagger, the lightbox, the scroll-zoom in `Cinematic.tsx`, and the gallery's cursor-tilt cards.
- `src/app/(site)` is a route group holding every public page (`/`, `/work`, `/rates`) so they share one layout (nav, footer, cursor, grain, scroll progress) without that chrome leaking into `/admin`.
- `RatesSlider.tsx` is a dependency-free horizontal slider (CSS scroll-snap, no carousel library).
- `HeroCamera.tsx` renders an original low-poly 3D camera (Three.js via `@react-three/fiber`, no external model files) — auto-rotates and tilts toward the cursor with damped, spring-like easing.
- A custom cursor (desktop, fine-pointer only), a scroll progress bar, and a lightweight film-grain overlay for texture.
- Animation timing follows [Emil Kowalski's design-engineering principles](.claude/skills/emil-design-eng/SKILL.md) (installed as a project skill) — custom easing curves, sub-300ms UI transitions, scale-from-0.95 entrances, `prefers-reduced-motion` support throughout.

## SEO: sitemap & robots.txt

`src/app/sitemap.ts` and `src/app/robots.ts` are Next.js's built-in
conventions — they generate `/sitemap.xml` and `/robots.txt` automatically
at build time, no static files to keep in sync by hand. The sitemap lists
`/`, `/work`, and `/rates`; robots.txt allows everything except `/admin`
and points crawlers at the sitemap. Both read `NEXT_PUBLIC_SITE_URL` (same
env var as the Open Graph metadata) so they always point at the real
domain — add a new public page to the array in `sitemap.ts` if you add one.

## Security

- **No service-role key anywhere** — the app only ever uses Supabase's
  public anon key, both client- and server-side. All the real access
  control lives in Postgres Row Level Security (RLS) policies
  (`supabase/schema.sql`): anyone can *read* photos/categories/rate cards,
  but only an authenticated session can write, and `admin_setup` can only
  ever hold one row (enforced by the app checking count before insert, not
  by RLS alone — worth knowing if you ever query that table directly).
- **`/admin` is gated server-side**, not just hidden — `src/proxy.ts` checks
  a real Supabase session on every request under `/admin/*` and redirects
  to `/admin/login` if there isn't one. There's no client-only "logged in"
  flag to spoof.
- **The PIN is a real password**, not a shortcut — `/admin/login` calls
  `supabase.auth.signInWithPassword` under the hood, so Supabase Auth's own
  built-in rate-limiting on failed sign-ins applies to it exactly like a
  normal login form.
- **Secrets stay server-only.** `.env.local` is git-ignored (`.gitignore`'s
  `.env*` rule); `.env.local.example` is the only env file tracked in git
  and holds placeholders, never real values. `CLOUDINARY_API_SECRET` (used
  only for signed delete calls) and `ADMIN_EMAIL` never reach the browser —
  only `NEXT_PUBLIC_`-prefixed vars do, and those are all values that are
  safe to expose by design (anon key, cloud name, upload preset name).
- **HTTP security headers** are set for every route in `next.config.ts`:
  a Content-Security-Policy scoped to the origins the app actually talks to
  (Supabase, Cloudinary, Picsum), plus `X-Frame-Options: DENY` (blocks
  clickjacking via iframe embedding), `X-Content-Type-Options: nosniff`,
  `Strict-Transport-Security`, and a locked-down `Permissions-Policy`.

None of this makes the site literally unhackable — no site is — but it
closes the common gaps (leaked secrets, unauthenticated admin routes,
missing RLS, clickjacking, XSS via a wide-open CSP) that most break-ins
actually come from.

## Deploy

Deploys cleanly to [Vercel](https://vercel.com/new). Add these env vars in
the Vercel project settings (mirroring `.env.local.example`):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAIL` — if you're using the admin.
- `NEXT_PUBLIC_SITE_URL` — set this to your real deployed URL,
  `https://joshmotion.vercel.app` (or your custom domain once you have
  one). It feeds the Open Graph/Twitter preview image URL, the sitemap, and
  robots.txt — without it those all fall back to the same value hardcoded
  in the code, which is fine until the domain changes.
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — for image uploads, see the Cloudinary section above.

And swap the placeholder email first.
