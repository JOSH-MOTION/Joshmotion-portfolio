import { createClient } from "@/lib/supabase/server";
import { createPhoto } from "@/app/admin/actions";
import PhotoForm from "@/components/admin/PhotoForm";

export default async function NewPhotoPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("key, label")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-8 font-display font-extrabold uppercase text-2xl">New photo</h1>
      <PhotoForm
        action={createPhoto}
        categories={categories ?? []}
        submitLabel="Publish"
      />
    </div>
  );
}
