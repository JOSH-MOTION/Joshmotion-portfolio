import type { Metadata } from "next";
import RatesSlider from "@/components/RatesSlider";
import MaskReveal from "@/components/MaskReveal";
import { getRateCards } from "@/lib/data";

export const metadata: Metadata = {
  title: "Rates — Joshmotion",
  description: "Photography packages and pricing — portraits, weddings, baby & family, product and corporate shoots.",
};

export const revalidate = 60;

export default async function RatesPage() {
  const cards = await getRateCards();

  return (
    <div className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="mb-14 px-6 md:mb-20 md:px-10">
        <MaskReveal>
          <p className="mb-3 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
            Rates
          </p>
        </MaskReveal>
        <MaskReveal delay={0.08}>
          <h1 className="max-w-2xl font-display text-4xl leading-[1.05] md:text-6xl">
            Packages, made
            <span className="font-light"> plain.</span>
          </h1>
        </MaskReveal>
        <MaskReveal delay={0.16}>
          <p className="mt-5 max-w-md font-sans text-[15px] leading-relaxed text-muted">
            Starting prices below — every shoot is scoped to what you actually
            need, so get in touch and we&apos;ll fine-tune it together.
          </p>
        </MaskReveal>
      </div>

      <RatesSlider cards={cards} />
    </div>
  );
}
