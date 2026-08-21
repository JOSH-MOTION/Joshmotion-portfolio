import "server-only";
import { createClient } from "@/lib/supabase/server";
import {
  photos as staticPhotos,
  categories as staticCategories,
  rateCards as staticRateCards,
  photoUrl,
  type Photo as StaticPhoto,
} from "@/lib/photos";

export type GalleryPhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  category: string;
  title: string;
  location: string;
  year: string;
  span: string;
};

export type CategoryOption = { key: string; label: string };

export type RateCardItem = {
  id: string;
  title: string;
  description: string;
  priceAmount: number;
  priceCurrency: string;
  priceNote: string;
  src: string;
};

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function fallbackPhotos(): GalleryPhoto[] {
  return staticPhotos.map((p: StaticPhoto) => ({
    id: p.id,
    src: photoUrl(p),
    width: p.width,
    height: p.height,
    category: p.category,
    title: p.title,
    location: p.location,
    year: p.year,
    span: p.span,
  }));
}

function fallbackCategories(): CategoryOption[] {
  return staticCategories.filter((c) => c.key !== "all") as CategoryOption[];
}

export async function getPhotos(): Promise<GalleryPhoto[]> {
  if (!isSupabaseConfigured) return fallbackPhotos();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fallbackPhotos();

  return data.map((row) => ({
    id: row.id,
    src: supabase.storage.from("photos").getPublicUrl(row.image_path).data.publicUrl,
    width: row.width,
    height: row.height,
    category: row.category,
    title: row.title,
    location: row.location,
    year: row.year,
    span: row.span ?? "",
  }));
}

/** One random photo per category — used for the homepage teaser grid.
 * Re-sampled on every call, so pair with dynamic rendering for it to
 * actually change on each visit. */
export async function getRandomPhotoSample(): Promise<GalleryPhoto[]> {
  const [photos, categories] = await Promise.all([getPhotos(), getCategories()]);

  return categories
    .map((c) => {
      const inCategory = photos.filter((p) => p.category === c.key);
      if (inCategory.length === 0) return null;
      return inCategory[Math.floor(Math.random() * inCategory.length)];
    })
    .filter((p): p is GalleryPhoto => !!p);
}

function fallbackRateCards(): RateCardItem[] {
  return staticRateCards.map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    priceAmount: r.priceAmount,
    priceCurrency: r.priceCurrency,
    priceNote: r.priceNote,
    src: photoUrl(r),
  }));
}

export async function getRateCards(): Promise<RateCardItem[]> {
  if (!isSupabaseConfigured) return fallbackRateCards();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("rate_cards")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fallbackRateCards();

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    priceAmount: Number(row.price_amount),
    priceCurrency: row.price_currency,
    priceNote: row.price_note,
    src: supabase.storage.from("photos").getPublicUrl(row.image_path).data.publicUrl,
  }));
}

export async function getCategories(): Promise<CategoryOption[]> {
  if (!isSupabaseConfigured) return fallbackCategories();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return fallbackCategories();

  return data.map((row) => ({ key: row.key, label: row.label }));
}
