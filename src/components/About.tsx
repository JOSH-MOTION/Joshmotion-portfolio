import Image from "next/image";
import RevealOnScroll from "@/components/RevealOnScroll";
import MaskReveal from "@/components/MaskReveal";

const stats = [
  { label: "Based in", value: "Accra, Ghana" },
  { label: "Shooting since", value: "2019" },
  { label: "Kit", value: "Modern mirrorless" },
  { label: "Available for", value: "Editorial, portrait, corporate, travel" },
];

export default function About() {
  return (
    <section id="about" className="border-t border-line">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2 md:gap-16 md:px-10 md:py-32">
        <RevealOnScroll className="relative aspect-[4/5] w-full overflow-hidden">
          <Image
            src="/about.jpg"
            alt="Joshua on set, shooting a wedding"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover grayscale"
          />
        </RevealOnScroll>

        <div className="flex flex-col justify-center">
          <MaskReveal>
            <p className="mb-3 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
              02 — About
            </p>
          </MaskReveal>
          <MaskReveal delay={0.08}>
            <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] md:text-5xl">
              Photography, made
              <span className="block font-light normal-case text-muted">unhurried.</span>
            </h2>
          </MaskReveal>
          <RevealOnScroll delay={0.18}>
            <p className="mt-6 max-w-lg font-sans text-[15px] leading-relaxed text-muted">
              I&apos;m Joshua — a portrait and editorial photographer. My work
              leans toward stillness: real light, real rooms, people who
              forget the camera is there.
              Every set starts with a conversation, not a shot list. I also
              run{" "}
              <a
                href="https://brainworksstudioafrica.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-accent"
              >
                Brain Works Studio Africa
              </a>
              , a creative studio, as founder and CEO.
            </p>
          </RevealOnScroll>

          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line pt-8">
            {stats.map((s, i) => (
              <RevealOnScroll key={s.label} delay={0.22 + i * 0.06}>
                <dt className="font-sans text-[11px] uppercase tracking-[0.15em] text-muted">
                  {s.label}
                </dt>
                <dd className="mt-1.5 font-display text-lg">
                  {s.value}
                </dd>
              </RevealOnScroll>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
