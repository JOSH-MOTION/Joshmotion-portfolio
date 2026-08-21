import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deletePhoto } from "@/app/admin/actions";

export default async function AdminPhotosPage() {
  const supabase = await createClient();
  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display font-extrabold uppercase text-2xl">Photos</h1>
        <Link
          href="/admin/photos/new"
          className="rounded-full bg-fg px-4 py-2 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97]"
        >
          New photo
        </Link>
      </div>

      {!photos || photos.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          No photos yet — add your first one.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {photos.map((photo) => {
            return (
              <div key={photo.id} className="flex items-center gap-4 py-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-bg-raised">
                  <Image
                    src={photo.image_path}
                    alt={photo.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-extrabold uppercase text-base">
                    {photo.title}
                  </p>
                  <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-muted">
                    {photo.category} — {photo.location} — {photo.year}
                  </p>
                </div>
                <Link
                  href={`/admin/photos/${photo.id}`}
                  className="font-sans text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
                >
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deletePhoto(photo.id, photo.image_public_id);
                  }}
                >
                  <button
                    type="submit"
                    className="font-sans text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent"
                  >
                    Delete
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
