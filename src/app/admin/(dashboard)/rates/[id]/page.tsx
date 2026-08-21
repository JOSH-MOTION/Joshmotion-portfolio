import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateRateCard } from "@/app/admin/actions";
import RateCardForm from "@/components/admin/RateCardForm";

export default async function EditRateCardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: card } = await supabase
    .from("rate_cards")
    .select("*")
    .eq("id", id)
    .single();

  if (!card) notFound();

  return (
    <div>
      <h1 className="mb-8 font-display font-extrabold uppercase text-2xl">Edit rate card</h1>
      <RateCardForm
        action={updateRateCard.bind(null, id)}
        currentImageUrl={card.image_path}
        initial={{
          title: card.title,
          description: card.description,
          priceAmount: Number(card.price_amount),
          priceCurrency: card.price_currency,
          priceNote: card.price_note,
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
