import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePhoto } from "@/app/admin/actions";
import PhotoForm from "@/components/admin/PhotoForm";

export default async function EditPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: photo }, { data: categories }] = await Promise.all([
    supabase.from("photos").select("*").eq("id", id).single(),
    supabase.from("categories").select("key, label").order("sort_order", { ascending: true }),
  ]);

  if (!photo) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display font-extrabold uppercase text-2xl">Edit photo</h1>
      <PhotoForm
        action={updatePhoto.bind(null, id)}
        categories={categories ?? []}
        currentImageUrl={photo.image_path}
        initial={{
          title: photo.title,
          category: photo.category,
          location: photo.location,
          year: photo.year,
          span: photo.span,
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
