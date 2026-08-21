import { createClient } from "@/lib/supabase/server";
import { deleteCategory, renameCategory } from "@/app/admin/actions";
import NewCategoryForm from "@/components/admin/NewCategoryForm";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-8 font-display font-extrabold uppercase text-2xl">Categories</h1>

      <div className="mb-10 flex flex-col divide-y divide-line border-y border-line">
        {(categories ?? []).map((c) => (
          <div key={c.key} className="flex items-center gap-4 py-3">
            <form action={renameCategory.bind(null, c.key)} className="flex flex-1 items-center gap-3">
              <input
                name="label"
                type="text"
                defaultValue={c.label}
                className="flex-1 rounded-md border border-transparent bg-transparent px-2 py-1.5 font-sans text-sm outline-none transition-colors hover:border-line focus:border-accent"
              />
              <button
                type="submit"
                className="font-sans text-[12px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
              >
                Save
              </button>
            </form>
            <form action={deleteCategory.bind(null, c.key)}>
              <button
                type="submit"
                className="font-sans text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-accent"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>

      <NewCategoryForm />
    </div>
  );
}
