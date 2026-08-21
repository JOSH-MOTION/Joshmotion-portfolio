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

**Image size:** Supabase's free tier includes 1GB of file storage and a
generous bandwidth allowance — plenty for a photography portfolio as long as
you export web-sized images before uploading (long edge around 2000–2500px,
JPEG quality ~80). A single unresized 24MP RAW-derived JPEG can be 10–20MB;
resized for web it's usually under 500KB with no visible quality loss on
screen. Next.js also re-optimizes and serves the right size per device
automatically via `next/image`, so upload one good-quality version and don't
worry about producing multiple sizes yourself.

**How many photos:** for a single project/case study, 8–15 images is the
sweet spot — a lead shot plus supporting frames that vary in composition.
For the whole site, 20–30 curated images across your categories reads as a
full archive without diluting quality.

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
photo. I've already added `baby-family` ("Baby & Family") and `wedding`
("Weddings") as starting categories, with one sample photo each.

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

## Deploy

Deploys cleanly to [Vercel](https://vercel.com/new). Add these env vars in
the Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_EMAIL` — if you're using the admin.
- `NEXT_PUBLIC_SITE_URL` — set this to your real deployed URL (e.g.
  `https://joshmotion.vercel.app` or your custom domain) once you have one.
  Without it, the link-preview (Open Graph) image URL embedded in the page's
  metadata falls back to `localhost`, which breaks previews on WhatsApp/
  Twitter/iMessage once the site is live.

And swap the placeholder email first.
