import RevealOnScroll from "@/components/RevealOnScroll";
import MaskReveal from "@/components/MaskReveal";

const values = [
  {
    index: "01",
    title: "Unhurried craft",
    description:
      "Every session is scoped properly and shot with intention — no rushed timelines, no shortcuts. Quality that holds up long after the shoot ends.",
  },
  {
    index: "02",
    title: "Honest light",
    description:
      "Real light, real rooms, real people. I lean toward what's actually there instead of staging something that isn't — the work looks like you, not a template.",
  },
  {
    index: "03",
    title: "Built on trust",
    description:
      "Every project starts with a conversation, not a contract. Clear pricing, on-time delivery, and images handled with the same care I'd want for my own family.",
  },
];

export default function Values() {
  return (
    <section className="border-t border-line px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl md:mb-20">
          <MaskReveal>
            <p className="mb-3 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
              03 — What I bring
            </p>
          </MaskReveal>
          <MaskReveal delay={0.08}>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] md:text-6xl">
              Not just a
              <span className="block font-light normal-case text-muted">camera for hire.</span>
            </h2>
          </MaskReveal>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {values.map((v, i) => (
            <RevealOnScroll key={v.index} delay={i * 0.1}>
              <div className="border-t border-line pt-6">
                <p className="font-display text-lg font-bold text-accent">
                  {v.index}
                </p>
                <h3 className="mt-3 font-display text-2xl font-extrabold uppercase leading-tight md:text-3xl">
                  {v.title}
                </h3>
                <p className="mt-4 font-sans text-[15px] leading-relaxed text-muted">
                  {v.description}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
