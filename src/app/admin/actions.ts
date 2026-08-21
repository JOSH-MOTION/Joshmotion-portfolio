"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";

export type ActionState = { error?: string } | null;

export async function signIn(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const email = process.env.ADMIN_EMAIL;
  const pin = String(formData.get("pin") ?? "");

  if (!email) {
    return { error: "ADMIN_EMAIL isn't set in .env.local — see the README." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: pin });

  if (error) return { error: "Wrong PIN." };

  redirect("/admin");
}

export type SetupState = { error?: string; message?: string } | null;

export async function setupAdminAccount(
  _prev: SetupState,
  formData: FormData
): Promise<SetupState> {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { error: "ADMIN_EMAIL isn't set in .env.local — see the README." };
  }

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }
  if (password !== confirm) {
    return { error: "Passwords don't match." };
  }

  const supabase = await createClient();

  const { count } = await supabase
    .from("admin_setup")
    .select("key", { count: "exact", head: true });

  if (count && count > 0) {
    return { error: "An admin account already exists — sign in at /admin/login instead." };
  }

  const { data, error } = await supabase.auth.signUp({
    email: adminEmail,
    password,
  });

  if (error) return { error: error.message };

  await supabase.from("admin_setup").insert({ key: "done" });

  if (data.session) redirect("/admin");

  return {
    message:
      "Account created. Check your email to confirm it, then sign in at /admin/login.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Deletes an asset from Cloudinary using a signed request — the API secret
 * never leaves the server. Unsigned uploads don't need this for creating
 * images, but deletion always requires a signature.
 *
 * Errors are logged, not swallowed — a silently-ignored failure here is
 * exactly what leaves an asset stranded in Cloudinary after its row is gone
 * from the DB, with the admin UI showing success either way. */
async function deleteCloudinaryAsset(publicId: string) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret || !publicId) {
    console.error("Cloudinary delete skipped — missing config or public_id", { publicId });
    return;
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`public_id=${publicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const body = new FormData();
  body.append("public_id", publicId);
  body.append("timestamp", String(timestamp));
  body.append("api_key", apiKey);
  body.append("signature", signature);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
      { method: "POST", body }
    );
    const result = await response.json();
    if (!response.ok || (result.result !== "ok" && result.result !== "not found")) {
      console.error("Cloudinary delete failed", { publicId, status: response.status, result });
    }
  } catch (err) {
    console.error("Cloudinary delete request errored", { publicId, err });
  }
}

type UploadedImage = { url: string; publicId: string; width: number; height: number };

/** Creates one or more photos at once (the admin form lets you pick several
 * files in one go). Shared fields (category/location/year/span) apply to
 * every photo in the batch; when more than one image is uploaded, the title
 * becomes a numbered base ("Wedding Shoot 1", "Wedding Shoot 2", …) rather
 * than being reused as-is. */
export async function createPhotos(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const titleBase = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const span = String(formData.get("span") ?? "");

  if (!titleBase || !category) return { error: "Title and category are required." };

  let images: UploadedImage[];
  try {
    images = JSON.parse(String(formData.get("photosJson") ?? "[]"));
  } catch {
    return { error: "Something went wrong reading the uploaded images." };
  }
  if (!Array.isArray(images) || images.length === 0) {
    return { error: "Choose at least one image to upload." };
  }

  const { count } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true });
  const startOrder = count ?? 0;

  const rows = images.map((img, i) => ({
    title: images.length > 1 ? `${titleBase} ${i + 1}` : titleBase,
    category,
    location,
    year,
    span,
    width: img.width,
    height: img.height,
    image_path: img.url,
    image_public_id: img.publicId,
    sort_order: startOrder + i,
  }));

  const { error: insertError } = await supabase.from("photos").insert(rows);
  if (insertError) return { error: insertError.message };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function updatePhoto(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const span = String(formData.get("span") ?? "");

  if (!title || !category) return { error: "Title and category are required." };

  const update: Record<string, unknown> = { title, category, location, year, span };

  const imageUrl = String(formData.get("imageUrl") ?? "");
  if (imageUrl) {
    update.image_path = imageUrl;
    update.image_public_id = String(formData.get("imagePublicId") ?? "");
    update.width = Number(formData.get("imageWidth") ?? 1200);
    update.height = Number(formData.get("imageHeight") ?? 1500);
  }

  const { error } = await supabase.from("photos").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePhoto(id: string, imagePublicId: string) {
  const supabase = await createClient();
  await deleteCloudinaryAsset(imagePublicId);
  await supabase.from("photos").delete().eq("id", id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function createCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return { error: "Category name is required." };

  const key = slugify(label);
  const { count } = await supabase
    .from("categories")
    .select("key", { count: "exact", head: true });

  const { error } = await supabase
    .from("categories")
    .insert({ key, label, sort_order: count ?? 0 });

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function renameCategory(key: string, formData: FormData) {
  const label = String(formData.get("label") ?? "").trim();
  if (!label) return;
  const supabase = await createClient();
  await supabase.from("categories").update({ label }).eq("key", key);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function deleteCategory(key: string) {
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("key", key);
  revalidatePath("/");
  revalidatePath("/admin/categories");
}

export async function createRateCard(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const imageUrl = String(formData.get("imageUrl") ?? "");
  if (!imageUrl) return { error: "Choose an image to upload." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceAmount = Number(formData.get("priceAmount") ?? 0);
  const priceCurrency = String(formData.get("priceCurrency") ?? "GHS").trim();
  const priceNote = String(formData.get("priceNote") ?? "").trim();
  const imagePublicId = String(formData.get("imagePublicId") ?? "");

  if (!title || !priceAmount) return { error: "Title and price are required." };

  const { count } = await supabase
    .from("rate_cards")
    .select("id", { count: "exact", head: true });

  const { error: insertError } = await supabase.from("rate_cards").insert({
    title,
    description,
    price_amount: priceAmount,
    price_currency: priceCurrency,
    price_note: priceNote,
    image_path: imageUrl,
    image_public_id: imagePublicId,
    sort_order: count ?? 0,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/rates");
  revalidatePath("/admin/rates");
  redirect("/admin/rates");
}

export async function updateRateCard(
  id: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceAmount = Number(formData.get("priceAmount") ?? 0);
  const priceCurrency = String(formData.get("priceCurrency") ?? "GHS").trim();
  const priceNote = String(formData.get("priceNote") ?? "").trim();

  if (!title || !priceAmount) return { error: "Title and price are required." };

  const update: Record<string, unknown> = {
    title,
    description,
    price_amount: priceAmount,
    price_currency: priceCurrency,
    price_note: priceNote,
  };

  const imageUrl = String(formData.get("imageUrl") ?? "");
  if (imageUrl) {
    update.image_path = imageUrl;
    update.image_public_id = String(formData.get("imagePublicId") ?? "");
  }

  const { error } = await supabase.from("rate_cards").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/rates");
  revalidatePath("/admin/rates");
  redirect("/admin/rates");
}

export async function deleteRateCard(id: string, imagePublicId: string) {
  const supabase = await createClient();
  await deleteCloudinaryAsset(imagePublicId);
  await supabase.from("rate_cards").delete().eq("id", id);
  revalidatePath("/rates");
  revalidatePath("/admin/rates");
}
