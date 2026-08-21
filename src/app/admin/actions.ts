"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

async function readImageDimensions(file: File): Promise<{ width: number; height: number }> {
  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50) {
      const width = (buffer[16] << 24) | (buffer[17] << 16) | (buffer[18] << 8) | buffer[19];
      const height = (buffer[20] << 24) | (buffer[21] << 16) | (buffer[22] << 8) | buffer[23];
      return { width, height };
    }
    // JPEG — scan markers for the first SOFn segment.
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      let i = 2;
      while (i < buffer.length) {
        if (buffer[i] !== 0xff) {
          i++;
          continue;
        }
        const marker = buffer[i + 1];
        const isSOF =
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc;
        if (isSOF) {
          const height = (buffer[i + 5] << 8) | buffer[i + 6];
          const width = (buffer[i + 7] << 8) | buffer[i + 8];
          return { width, height };
        }
        const segmentLength = (buffer[i + 2] << 8) | buffer[i + 3];
        i += 2 + segmentLength;
      }
    }
  } catch {
    // fall through to default
  }
  return { width: 1200, height: 1500 };
}

export async function createPhoto(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient();

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "Choose an image to upload." };

  const title = String(formData.get("title") ?? "").trim();
  const category = String(formData.get("category") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const year = String(formData.get("year") ?? "").trim();
  const span = String(formData.get("span") ?? "");

  if (!title || !category) return { error: "Title and category are required." };

  const { width, height } = await readImageDimensions(file);
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${slugify(title)}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { count } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true });

  const { error: insertError } = await supabase.from("photos").insert({
    title,
    category,
    location,
    year,
    span,
    width,
    height,
    image_path: path,
    sort_order: count ?? 0,
  });

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

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const { width, height } = await readImageDimensions(file);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${slugify(title)}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) return { error: uploadError.message };

    update.image_path = path;
    update.width = width;
    update.height = height;
  }

  const { error } = await supabase.from("photos").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deletePhoto(id: string, imagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("photos").remove([imagePath]);
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

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "Choose an image to upload." };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceAmount = Number(formData.get("priceAmount") ?? 0);
  const priceCurrency = String(formData.get("priceCurrency") ?? "GHS").trim();
  const priceNote = String(formData.get("priceNote") ?? "").trim();

  if (!title || !priceAmount) return { error: "Title and price are required." };

  const ext = file.name.split(".").pop() || "jpg";
  const path = `rates/${slugify(title)}-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("photos")
    .upload(path, file, { contentType: file.type });

  if (uploadError) return { error: uploadError.message };

  const { count } = await supabase
    .from("rate_cards")
    .select("id", { count: "exact", head: true });

  const { error: insertError } = await supabase.from("rate_cards").insert({
    title,
    description,
    price_amount: priceAmount,
    price_currency: priceCurrency,
    price_note: priceNote,
    image_path: path,
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

  const file = formData.get("image") as File | null;
  if (file && file.size > 0) {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `rates/${slugify(title)}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) return { error: uploadError.message };
    update.image_path = path;
  }

  const { error } = await supabase.from("rate_cards").update(update).eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/rates");
  revalidatePath("/admin/rates");
  redirect("/admin/rates");
}

export async function deleteRateCard(id: string, imagePath: string) {
  const supabase = await createClient();
  await supabase.storage.from("photos").remove([imagePath]);
  await supabase.from("rate_cards").delete().eq("id", id);
  revalidatePath("/rates");
  revalidatePath("/admin/rates");
}
