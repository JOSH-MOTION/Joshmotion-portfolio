import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteRateCard } from "@/app/admin/actions";

export default async function AdminRatesPage() {
  const supabase = await createClient();
  const { data: cards } = await supabase
    .from("rate_cards")
    .select("*")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display font-extrabold uppercase text-2xl">Rate cards</h1>
        <Link
          href="/admin/rates/new"
          className="rounded-full bg-fg px-4 py-2 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97]"
        >
          New rate card
        </Link>
      </div>

      {!cards || cards.length === 0 ? (
        <p className="font-sans text-sm text-muted">
          No rate cards yet — add your first package.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {cards.map((card) => {
            const { data: img } = supabase.storage
              .from("photos")
              .getPublicUrl(card.image_path);
            return (
              <div key={card.id} className="flex items-center gap-4 py-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded bg-bg-raised">
                  <Image
                    src={img.publicUrl}
                    alt={card.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-extrabold uppercase text-base">
                    {card.title}
                  </p>
                  <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-muted">
                    {card.price_currency} {card.price_amount} — {card.price_note}
                  </p>
                </div>
                <Link
                  href={`/admin/rates/${card.id}`}
                  className="font-sans text-[13px] uppercase tracking-[0.1em] text-muted transition-colors hover:text-fg"
                >
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await deleteRateCard(card.id, card.image_path);
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
