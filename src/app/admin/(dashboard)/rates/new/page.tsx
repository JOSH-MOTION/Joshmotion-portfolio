import { createRateCard } from "@/app/admin/actions";
import RateCardForm from "@/components/admin/RateCardForm";

export default function NewRateCardPage() {
  return (
    <div>
      <h1 className="mb-8 font-display font-extrabold uppercase text-2xl">New rate card</h1>
      <RateCardForm action={createRateCard} submitLabel="Publish" />
    </div>
  );
}
