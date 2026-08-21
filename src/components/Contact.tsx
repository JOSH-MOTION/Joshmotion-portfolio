import RevealOnScroll from "@/components/RevealOnScroll";
import MaskReveal from "@/components/MaskReveal";

const socials = [
  { label: "WhatsApp", href: "https://wa.me/message/YZ5UIBD2HAFOF1" },
  { label: "Instagram", href: "https://www.instagram.com/josh_motionz/" },
  { label: "+233 24 240 3450", href: "tel:+233242403450" },
];

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-line px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <MaskReveal>
          <p className="mb-3 font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
            04 — Get in touch
          </p>
        </MaskReveal>
        <MaskReveal delay={0.08}>
          <h2 className="max-w-3xl font-display text-4xl font-extrabold uppercase leading-[0.95] md:text-6xl">
            Have a story worth
            <span className="block font-light normal-case text-muted">photographing?</span>
          </h2>
        </MaskReveal>

        <RevealOnScroll delay={0.2}>
          <a
            href="mailto:hello@joshmotion.com"
            data-cursor="Say hi"
            className="group mt-10 inline-block font-display text-3xl font-bold md:text-5xl"
          >
            hello@joshmotion.com
            <span className="mt-2 block h-px w-0 bg-accent transition-[width] duration-500 ease-out group-hover:w-full" />
          </a>
        </RevealOnScroll>

        <RevealOnScroll delay={0.26}>
          <a
            href="https://wa.me/message/YZ5UIBD2HAFOF1"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="Chat"
            className="group mt-4 inline-flex items-center gap-2 font-sans text-[13px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-accent"
          >
            or message on WhatsApp
            <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
              →
            </span>
          </a>
        </RevealOnScroll>

        <RevealOnScroll delay={0.32}>
          <div className="mt-16 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-sans text-[13px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-fg"
              >
                {s.label}
              </a>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
