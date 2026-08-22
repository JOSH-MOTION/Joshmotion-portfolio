"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import type { RateCardItem } from "@/lib/data";

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function RatesSlider({ cards }: { cards: RateCardItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(cards.length - 1, i));
    const slide = track.children[clamped] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setActive(clamped);
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    setActive(Math.max(0, Math.min(cards.length - 1, i)));
  };

  const hasMore = active < cards.length - 1;

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cards.map((card) => (
          <div
            key={card.id}
            className="grid w-full shrink-0 snap-start grid-cols-1 gap-8 px-6 md:grid-cols-2 md:gap-16 md:px-10"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto">
              <Image
                src={card.src}
                alt={`${card.title} — Joshmotion photography package`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
                priority={cards.indexOf(card) === 0}
              />
            </div>

            <div className="flex flex-col justify-center py-10 md:py-0">
              <div className="mb-3 flex items-center gap-3">
                <p className="font-sans text-[13px] uppercase tracking-[0.25em] text-muted">
                  {String(cards.indexOf(card) + 1).padStart(2, "0")} /{" "}
                  {String(cards.length).padStart(2, "0")}
                </p>
                {cards.indexOf(card) === 0 && cards.length > 1 && (
                  <motion.p
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    className="font-sans text-[13px] uppercase tracking-[0.25em] text-accent"
                  >
                    swipe for more →
                  </motion.p>
                )}
              </div>
              <h3 className="font-display text-4xl font-extrabold uppercase leading-[0.95] md:text-5xl">
                {card.title}
              </h3>
              <p className="mt-6 max-w-md font-sans text-[15px] leading-relaxed text-muted">
                {card.description}
              </p>

              <div className="mt-8 border-t border-line pt-6">
                <p className="font-display text-3xl font-bold">
                  {formatPrice(card.priceAmount, card.priceCurrency)}
                </p>
                <p className="mt-1 font-sans text-[12px] uppercase tracking-[0.1em] text-muted">
                  {card.priceNote}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`mailto:hello@joshmotion.com?subject=${encodeURIComponent(
                    `Enquiry — ${card.title}`
                  )}`}
                  data-cursor="Enquire"
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-fg px-5 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] text-bg transition-transform duration-[160ms] ease-out active:scale-[0.97]"
                >
                  Enquire
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
                <a
                  href="https://wa.me/message/YZ5UIBD2HAFOF1"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="Chat"
                  className="group inline-flex w-fit items-center gap-2 rounded-full border border-line px-5 py-2.5 font-sans text-[13px] uppercase tracking-[0.1em] transition-colors duration-200 ease-out hover:border-accent hover:text-accent active:scale-[0.97]"
                >
                  WhatsApp
                  <span className="transition-transform duration-200 ease-out group-hover:translate-x-0.5">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between px-6 md:px-10">
        <div className="flex gap-2">
          {cards.map((card, i) => (
            <button
              key={card.id}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${card.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                i === active ? "w-6 bg-accent" : "w-1.5 bg-line"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => scrollToIndex(active - 1)}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-transform duration-[160ms] ease-out hover:border-accent active:scale-[0.9]"
          >
            ←
          </button>
          <motion.button
            onClick={() => scrollToIndex(active + 1)}
            aria-label="Next"
            animate={hasMore ? { x: [0, 4, 0] } : {}}
            transition={{ duration: 1.3, repeat: hasMore ? Infinity : 0, ease: "easeInOut" }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line transition-transform duration-[160ms] ease-out hover:border-accent active:scale-[0.9]"
          >
            →
            {hasMore && (
              <motion.span
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full border border-accent"
              />
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
